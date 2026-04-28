# SecurePass - Visitor Management System

# Assignment 9: SecurePass MERN Application

This is my submission for Assignment 9. It is a full-stack Visitor Management System built using the MERN stack (MongoDB, Express, React, Node.js). 

## Features
   \`\`\`bash
   cd ../client
   npm install
   \`\`\`

### Environment Setup

**1. Backend `.env` (in `server/` directory):**
\`\`\`env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Email Notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
# SMS Notifications (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
\`\`\`

**2. Frontend Configuration (in `client/src/config.js`):**
Make sure the `API_BASE_URL` points to your backend. By default, it is set to `http://localhost:5000/api`.

### Running the Application

1. **Start the Backend Server:**
   \`\`\`bash
   cd server
   npm start
   \`\`\`
   The backend should run on `http://localhost:5000`.

2. **Start the Frontend Development Server:**
   \`\`\`bash
   cd client
   npm run dev
   \`\`\`
   The frontend will usually start on `http://localhost:5173`.

## Usage & Testing
1. **Register as an Employee/Security/Admin** or use seeded data if available.
2. **Register a Visitor** from the public registration portal.
3. **Employee Dashboard:** Log in as the host to approve the visitor. You will receive real-time alerts if connected.
4. **Download Pass:** The visitor will receive an email with a link to download their QR Code pass.
5. **Security Dashboard:** Log in as security and use the camera to scan the visitor's QR code to log their check-in and check-out times.

## Disclaimer
This project is an academic submission designed to demonstrate an understanding of full-stack MERN development, WebSockets, and third-party API integration.
