const mongoose = require('mongoose');

const checkLogSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Visitor',
      required: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    checkOutTime: {
      type: Date,
    },
    scannedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User', // Security staff
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CheckLog', checkLogSchema);
