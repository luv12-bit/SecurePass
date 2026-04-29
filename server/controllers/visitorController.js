const Visitor = require('../models/Visitor');
const CheckLog = require('../models/CheckLog');
const path = require('path');
const { generateQR, generatePassPDF } = require('../utils/passGenerator');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');

exports.registerVisitor = async (req, res, next) => {
  try {
    const visitorData = req.body;
    
    // Add photo if uploaded
    if (req.file) {
      visitorData.photo = req.file.filename;
    }

    const visitor = await Visitor.create(visitorData);
    
    const io = req.app.get('io');
    if (io && visitor.host) {
      io.to(visitor.host.toString()).emit('new_visitor', {
        message: `New visitor registered: ${visitor.name}`,
        visitor
      });
    }

    res.status(201).json({ success: true, data: visitor });
  } catch (err) {
    console.log(err);
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

exports.getVisitors = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'employee') {
      query = Visitor.find({ host: req.user.id });
    } else {
      query = Visitor.find();
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

exports.updateStatus = async (req, res, next) => {
  try {
    const status = req.body.status;
    let foundVisitor = await Visitor.findById(req.params.id).populate('host', 'name');

    if (!foundVisitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found' });
    }

    // Checking if the person updating is the host or an admin
    if (foundVisitor.host._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Generate a QR code string if they are approved
    let qrData = '';
    if (status === 'approved') {
      qrData = `VP-${foundVisitor._id}-${Date.now()}`;
    }

    foundVisitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { status: status, qrCode: qrData },
      { new: true, runValidators: true }
    );

    // Send email notification if approved
    if (status === 'approved') {
      const downloadLink = `http://localhost:5000/api/visitors/${foundVisitor._id}/download`;
      
      // Simple email message
      const message = `
        <h1>Pass Approved!</h1>
        <p>Hi ${foundVisitor.name},</p>
        <p>Your host ${foundVisitor.host.name} approved your visit.</p>
        <p>Download your pass here: <a href="${downloadLink}">${downloadLink}</a></p>
      `;
      
      await sendEmail({
        to: foundVisitor.email,
        subject: 'SecurePass Approved',
        html: message
      });
      
      if (foundVisitor.phone) {
        await sendSMS({
          to: foundVisitor.phone,
          message: `Your pass is approved. Download: ${downloadLink}`
        });
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

exports.checkIn = async (req, res, next) => {
  try {
    const qrCode = req.body.qrCode;

    // Find the visitor with this QR code
    let visitorObj = await Visitor.findOne({ qrCode: qrCode });

    if (!visitorObj) {
      return res.status(404).json({ success: false, message: 'Invalid QR Code' });
    }

    // Check if they are approved
    if (visitorObj.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Visitor not approved' });
    }

    // Check if they already checked in today
    let existingLog = await CheckLog.findOne({ visitor: visitorObj._id, checkOutTime: null });
    
    if (existingLog) {
      return res.status(400).json({ success: false, message: 'Visitor already checked in' });
    }

    // Create a new log entry
    const newLog = await CheckLog.create({
      visitor: visitorObj._id,
      scannedBy: req.user.id,
      organization: req.user.organization,
    });

    // Update visitor status
    visitorObj.status = 'in';
    await visitorObj.save();

    res.status(200).json({
      success: true,
      data: newLog,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.checkOut = async (req, res, next) => {
  try {
    const qrCode = req.body.qrCode;

    let visitorObj = await Visitor.findOne({ qrCode: qrCode });

    if (!visitorObj) {
      return res.status(404).json({ success: false, message: 'Invalid QR Code' });
    }

    // Find the active log to checkout
    let activeLog = await CheckLog.findOne({ visitor: visitorObj._id, checkOutTime: null });

    if (!activeLog) {
      return res.status(400).json({ success: false, message: 'Visitor not checked in' });
    }

    activeLog.checkOutTime = Date.now();
    await activeLog.save();

    visitorObj.status = 'out';
    await visitorObj.save();

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
