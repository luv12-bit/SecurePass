const nodemailer = require('nodemailer');

/**
 * Utility to send emails via Ethereal (Developer Sandbox)
 * @param {Object} options - Email options (to, subject, html)
 */
const sendEmail = async (options) => {
  try {
    // 1. Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real SMTP account for testing
    let testAccount = await nodemailer.createTestAccount();

    // 2. Create a reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // 3. Define email configuration
    const message = {
      from: '"SecurePass System" <noreply@securepass.com>', // sender address
      to: options.to, // list of receivers
      subject: options.subject, // Subject line
      html: options.html, // html body
    };

    // 4. Send email
    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
    
    // Ethereal provides a link to preview the email exactly as it would look
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error) {
    console.error("Email Error:", error);
    return false;
  }
};

module.exports = sendEmail;
