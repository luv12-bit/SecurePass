const twilio = require('twilio');

// SMS configuration using Twilio (Credentials intentionally left blank per instructions)
// To enable, add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to your .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'your_auth_token_here';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

// Initialize the Twilio client only if credentials exist to prevent crashing on boot
let client;
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    client = twilio(accountSid, authToken);
  }
} catch (error) {
  console.log('Twilio client not initialized: Missing credentials');
}

/**
 * Sends an SMS message to a given phone number
 * @param {Object} options - { to: '+919999999999', message: 'Hello!' }
 */
const sendSMS = async (options) => {
  // If Twilio isn't fully configured, we'll just log the message to the console
  // This satisfies the academic requirement without needing a real account
  if (!client) {
    console.log('\n--- SMS MOCK ---');
    console.log(`To: ${options.to}`);
    console.log(`Message: ${options.message}`);
    console.log('----------------\n');
    return true;
  }

  try {
    const message = await client.messages.create({
      body: options.message,
      from: twilioPhoneNumber,
      to: options.to
    });
    console.log(`SMS sent successfully: ${message.sid}`);
    return true;
  } catch (error) {
    console.error(`Failed to send SMS: ${error.message}`);
    // We don't throw the error so that the main application flow (like checking in) doesn't break
    return false;
  }
};

module.exports = sendSMS;
