const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: '"SecurePass System" <' + process.env.EMAIL_USER + '>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
    
    return true;
  } catch (error) {
    console.error("Email Error:", error);
    return false;
  }
};

module.exports = sendEmail;
