const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add visitor name'],
    },
    email: {
      type: String,
      required: [true, 'Please add visitor email'],
    },
    phone: {
      type: String,
      required: [true, 'Please add visitor phone'],
    },
    idType: {
      type: String,
      enum: ['Aadhaar', 'PAN', 'Passport', 'Driving License', 'Other'],
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
    },
    photo: {
      type: String, // URL to image (Cloudinary or local)
      default: 'no-photo.jpg',
    },
    purpose: {
      type: String,
      required: true,
    },
    host: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true, // Employee being visited
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'in', 'out'],
      default: 'pending',
    },
    qrCode: {
      type: String, // Data for QR
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Visitor', visitorSchema);
