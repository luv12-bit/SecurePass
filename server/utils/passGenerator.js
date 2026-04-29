const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateQR = async (text) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error(err);
    return null;
  }
};

exports.generatePassPDF = (visitor, qrDataUrl, callback) => {
  const doc = new PDFDocument({ size: [300, 400], margin: 20 });
  const filename = `pass-${visitor._id}.pdf`;
  const filepath = path.join(__dirname, '../uploads', filename);

  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);

  // Simple text output
  doc.fontSize(20).text('VISITOR PASS', { align: 'center' });
  doc.moveDown();
  
  // Add QR code image
  if (qrDataUrl) {
    doc.image(qrDataUrl, 75, 60, { width: 150 });
  }

  doc.moveDown(10);

  // Add visitor details below the image
  doc.fontSize(14).text(`Name: ${visitor.name}`);
  doc.fontSize(12).text(`Purpose: ${visitor.purpose}`);
  doc.fontSize(12).text(`Host Name: ${visitor.host.name || 'Unknown'}`);
  
  doc.moveDown();
  doc.fontSize(10).text(`Date Generated: ${new Date().toLocaleDateString()}`);

  doc.end();

  stream.on('finish', () => {
    callback(filename);
  });
};
