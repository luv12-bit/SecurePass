const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate QR Code as Data URL
exports.generateQR = async (text) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Generate PDF Visitor Pass
exports.generatePassPDF = (visitor, qrDataUrl, callback) => {
  const doc = new PDFDocument({ size: [300, 400], margin: 20 });
  const filename = `pass-${visitor._id}.pdf`;
  const filepath = path.join(__dirname, '../uploads', filename);

  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);

  // Background and border
  doc.rect(0, 0, 300, 400).fill('#f8fafc');
  doc.rect(5, 5, 290, 390).lineWidth(2).stroke('#e2e8f0');

  // Header
  doc.fillColor('#1e293b').fontSize(18).text('VISITOR PASS', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor('#64748b').text('Authorized Access Only', { align: 'center' });

  doc.moveDown();

  // QR Code
  doc.image(qrDataUrl, 75, 80, { width: 150 });

  doc.moveDown(12);

  // Visitor Details
  doc.fillColor('#1e293b').fontSize(14).text(visitor.name, { align: 'center', bold: true });
  doc.fontSize(10).fillColor('#64748b').text(`Purpose: ${visitor.purpose}`, { align: 'center' });
  doc.text(`Host: ${visitor.host.name || 'Staff'}`, { align: 'center' });
  
  doc.moveDown();
  doc.fontSize(8).text(`Valid on: ${new Date().toLocaleDateString()}`, { align: 'center' });

  doc.end();

  stream.on('finish', () => {
    callback(filename);
  });
};
