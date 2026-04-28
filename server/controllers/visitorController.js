const Visitor = require('../models/Visitor');
const CheckLog = require('../models/CheckLog');
const path = require('path');
const { generateQR, generatePassPDF } = require('../utils/passGenerator');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');

exports.registerVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.create(req.body);
    
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
    const { status } = req.body;

    let visitor = await Visitor.findById(req.params.id).populate('host', 'name');

    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found' });
    }

    if (visitor.host._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    let qrData = '';
    if (status === 'approved') {
      qrData = `VP-${visitor._id}-${Date.now()}`;
    }

    visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { status, qrCode: qrData },
      { new: true, runValidators: true }
    );

    if (status === 'approved') {
      const downloadLink = `http://localhost:5000/api/visitors/${visitor._id}/download`;
      const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #2563eb;">Pass Approved!</h2>
          <p>Hi ${visitor.name},</p>
          <p>Your host, <strong>${visitor.host.name}</strong>, has approved your visit.</p>
          <p>Please click the button below to download your secure QR Pass. You will need to show this to security upon arrival.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Download Digital Pass</a>
          </div>
          <p style="color: #6b7280; font-size: 0.9em;">If you have any questions, please contact your host directly.</p>
        </div>
      `;
      
      await sendEmail({
        to: visitor.email,
        subject: 'Your SecurePass is Ready',
        html: message
      });
      
      // Also send an SMS notification
      if (visitor.phone) {
        await sendSMS({
          to: visitor.phone,
          message: `Hi ${visitor.name}, your SecurePass has been approved by ${visitor.host.name}. Download it here: ${downloadLink}`
        });
      }
    }

    res.status(200).json({
      success: true,
      data: visitor,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.checkIn = async (req, res, next) => {
  try {
    const { qrCode } = req.body;

    const visitor = await Visitor.findOne({ qrCode });

    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Invalid QR Code' });
    }

    if (visitor.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Visitor not approved' });
    }

    const activeLog = await CheckLog.findOne({ visitor: visitor._id, checkOutTime: null });
    if (activeLog) {
      return res.status(400).json({ success: false, message: 'Visitor already checked in' });
    }

    const log = await CheckLog.create({
      visitor: visitor._id,
      scannedBy: req.user.id,
      organization: req.user.organization,
    });

    visitor.status = 'in';
    await visitor.save();

    res.status(200).json({
      success: true,
      data: log,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.checkOut = async (req, res, next) => {
  try {
    const { qrCode } = req.body;

    const visitor = await Visitor.findOne({ qrCode });

    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Invalid QR Code' });
    }

    const log = await CheckLog.findOne({ visitor: visitor._id, checkOutTime: null });

    if (!log) {
      return res.status(400).json({ success: false, message: 'Visitor not checked in' });
    }

    log.checkOutTime = Date.now();
    await log.save();

    visitor.status = 'out';
    await visitor.save();

    res.status(200).json({
      success: true,
      data: log,
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
