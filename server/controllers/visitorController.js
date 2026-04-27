const Visitor = require('../models/Visitor');
const CheckLog = require('../models/CheckLog');
const path = require('path');
const { generateQR, generatePassPDF } = require('../utils/passGenerator');

// @desc    Register a new visitor (Pre-registration)
// @route   POST /api/visitors
// @access  Public
exports.registerVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.create(req.body);
    res.status(201).json({ success: true, data: visitor });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single visitor
// @route   GET /api/visitors/:id
// @access  Public
exports.getVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('host', 'name email');
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found' });
    }
    res.status(200).json({ success: true, data: visitor });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all visitors (Admin/Security)
// @route   GET /api/visitors
// @access  Private
exports.getVisitors = async (req, res, next) => {
  try {
    let query;

    // If host, only see their visitors
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
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Approve/Reject visitor
// @route   PUT /api/visitors/:id/status
// @access  Private (Employee/Admin)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    let visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found' });
    }

    // Make sure user is host
    if (visitor.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // If approved, generate QR code data
    let qrData = '';
    if (status === 'approved') {
      qrData = `VP-${visitor._id}-${Date.now()}`;
    }

    visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { status, qrCode: qrData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: visitor,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Check-in visitor via QR
// @route   POST /api/visitors/checkin
// @access  Private (Security)
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

    // Check if already in
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
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Check-out visitor via QR
// @route   POST /api/visitors/checkout
// @access  Private (Security)
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
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Download PDF Pass
// @route   GET /api/visitors/:id/download
// @access  Public
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
    res.status(400).json({ success: false, message: err.message });
  }
};
