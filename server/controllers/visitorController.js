const Visitor = require('../models/Visitor');
const CheckLog = require('../models/CheckLog');
const path = require('path');
const { generateQR, generatePassPDF } = require('../utils/passGenerator');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');

// Register a new visitor - this is a public route, anyone can submit a registration

exports.registerVisitor = async (req, res, next) => {
  try {
    const visitorData = req.body;
    
    // Add photo if uploaded
    if (req.file) {
      visitorData.photo = req.file.filename;
    }

    const visitor = await Visitor.create(visitorData);
    
    // Send real-time notification to the host employee via socket.io
    // The host's userId matches a socket room they joined on login
    const io = req.app.get('io');
    if (io && visitor.host) {
      io.to(visitor.host.toString()).emit('new_visitor', {
        message: `New visitor registered: ${visitor.name}`,
        visitor
      });
    }

    res.status(201).json({ success: true, data: visitor });
  } catch (err) {
    console.log('Registration error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('host', 'name email');
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found' });
    }
    res.status(200).json({ success: true, data: visitor });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all visitors - employees see only their own visitors, admins see all
exports.getVisitors = async (req, res, next) => {
  try {
    let query;

    // I check the role here to decide what data to return
    // employees should only see visitors assigned to them
    if (req.user.role === 'employee') {
      query = Visitor.find({ host: req.user.id });
    } else {
      query = Visitor.find(); // admin sees everything
    }

    const visitors = await query.populate('host', 'name email');

    res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update visitor status (approve/reject) - only the assigned host or an admin can do this
exports.updateStatus = async (req, res, next) => {
  try {
    const status = req.body.status;
    let foundVisitor = await Visitor.findById(req.params.id).populate('host', 'name');

    if (!foundVisitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found' });
    }

    // Security check: make sure only the host or admin can approve/reject
    if (foundVisitor.host._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // When approved, I generate a unique QR code string for this visitor
    // format: VP-{visitorId}-{timestamp} so each code is unique
    // this string will be embedded into the QR image in the PDF pass
    let qrData = '';
    if (status === 'approved') {
      qrData = `VP-${foundVisitor._id}-${Date.now()}`;
    }

    foundVisitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { status: status, qrCode: qrData },
      { new: true, runValidators: true }
    );

    // If approved, send an email to the visitor with their pass download link
    if (status === 'approved') {
      const downloadLink = `http://localhost:5000/api/visitors/${foundVisitor._id}/download`;
      
      const message = `
        <h1>Pass Approved!</h1>
        <p>Hi ${foundVisitor.name},</p>
        <p>Your host ${foundVisitor.host.name} approved your visit.</p>
        <p>Download your pass here: <a href="${downloadLink}">${downloadLink}</a></p>
      `;
      
      // I wrap this in try-catch separately because I dont want email failure
      // to block the approval itself
      try {
        await sendEmail({
          to: foundVisitor.email,
          subject: 'SecurePass Approved',
          html: message
        });
      } catch (emailErr) {
        console.log('Email failed but approval went through:', emailErr.message);
      }
      
      // Also try SMS if phone number exists
      if (foundVisitor.phone) {
        try {
          await sendSMS({
            to: foundVisitor.phone,
            message: `Your pass is approved. Download: ${downloadLink}`
          });
        } catch (smsErr) {
          console.log('SMS failed:', smsErr.message);
        }
      }
    }

    res.status(200).json({
      success: true,
      data: foundVisitor,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Check-in: security scans the QR code, we find the visitor and log their entry
exports.checkIn = async (req, res, next) => {
  try {
    const qrCode = req.body.qrCode;

    // look up the visitor by their unique QR code string
    let visitorObj = await Visitor.findOne({ qrCode: qrCode });

    if (!visitorObj) {
      return res.status(404).json({ success: false, message: 'Invalid QR Code' });
    }

    // they must be approved before they can enter
    if (visitorObj.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Visitor not approved' });
    }

    // prevent double check-in: look for a log with no checkout time
    let existingLog = await CheckLog.findOne({ visitor: visitorObj._id, checkOutTime: null });
    
    if (existingLog) {
      return res.status(400).json({ success: false, message: 'Visitor already checked in' });
    }

    // create the check-in log entry
    const newLog = await CheckLog.create({
      visitor: visitorObj._id,
      scannedBy: req.user.id,
      organization: req.user.organization,
    });

    // update their status to 'in' so the dashboard shows they're inside
    visitorObj.status = 'in';
    await visitorObj.save();

    console.log(`Visitor ${visitorObj.name} checked IN`);
    res.status(200).json({
      success: true,
      data: newLog,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Check-out: same as check-in but we find the active log and set the checkout time
exports.checkOut = async (req, res, next) => {
  try {
    const qrCode = req.body.qrCode;

    let visitorObj = await Visitor.findOne({ qrCode: qrCode });

    if (!visitorObj) {
      return res.status(404).json({ success: false, message: 'Invalid QR Code' });
    }

    // find the log that has no checkout time - thats the active visit
    let activeLog = await CheckLog.findOne({ visitor: visitorObj._id, checkOutTime: null });

    if (!activeLog) {
      return res.status(400).json({ success: false, message: 'Visitor not checked in' });
    }

    // set the checkout timestamp to now
    activeLog.checkOutTime = Date.now();
    await activeLog.save();

    visitorObj.status = 'out';
    await visitorObj.save();

    console.log(`Visitor ${visitorObj.name} checked OUT`);
    res.status(200).json({
      success: true,
      data: activeLog,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.downloadPass = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('host', 'name');

    if (!visitor || !visitor.qrCode) {
      return res.status(404).json({ success: false, message: 'Pass not found or not approved' });
    }

    const qrDataUrl = await generateQR(visitor.qrCode);
    
    generatePassPDF(visitor, qrDataUrl, (filename) => {
      const filepath = path.join(__dirname, '../uploads', filename);
      res.download(filepath);
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};
