# SecurePass - Visitor Management System (MERN)

This is my Assignment 9 submission. SecurePass is a digital visitor management system that replaces paper-based entry registers. Organizations can register visitors, approve visits, issue QR-code passes, and track check-in/check-out.

## Tech Stack

- **Frontend**: React.js (Vite), Lucide Icons, Recharts, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Auth**: JWT tokens, role-based access control
- **Other**: Nodemailer (Gmail SMTP), PDFKit, QRCode, Socket.io, Multer

---

## Setup & Installation

### Prerequisites
- Node.js v16 or higher
- MongoDB Atlas account (or local MongoDB)
- Gmail App Password for email notifications (optional)

### 1. Clone and install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Environment Variables

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_random_string_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Note:** If you don't set up EMAIL_USER and EMAIL_PASS, the app still works — email sending will just fail silently and log an error to the console.

### 3. Seed the database

```bash
cd server
npm run seed
```

This creates 3 test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@securepass.com | password123 |
| Security | security@securepass.com | password123 |
| Employee | sarah@securepass.com | password123 |

### 4. Run the app

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Backend runs on `http://localhost:5000`, Frontend on `http://localhost:5173`.

---

## Features - What Works vs What's Limited

### Fully Working
- **JWT Authentication** - Login, register, token persistence, role-based routing
- **Visitor Registration** - Public form with photo upload (via Multer)
- **Employee Dashboard** - See assigned visitors, approve/reject with real-time Socket.io notifications
- **Admin Dashboard** - Stats cards, traffic chart (Recharts), searchable/filterable visitor table, CSV export
- **Security Dashboard** - QR code scanner using device camera (html5-qrcode library)
- **Pass Generation** - PDF badge with embedded QR code image (PDFKit + qrcode library)
- **Check-in/Check-out** - QR scan logs entry and exit times in the database
- **Server-side Validation** - express-validator on all auth and visitor routes

### Partially Working / Limited
- **Email Notifications** - Works if Gmail App Password is configured. If not, approval still goes through but email fails silently. I chose this approach so the grader can test without setting up email.
- **SMS Notifications** - Requires a Twilio account with credits. The code is there but will log an error if Twilio env vars are not set. I didn't want to hardcode paid API keys.
- **Photo Upload** - Files are saved to server's `uploads/` folder. Works locally but on free hosting (Render) the filesystem is ephemeral so photos don't persist after restart.

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Create new staff account |
| POST | /api/auth/login | No | Login, returns JWT token |
| GET | /api/auth/me | Yes | Get current user info |
| GET | /api/auth/employees | No | List employees (for host dropdown) |

### Visitors
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/visitors | No | Register visitor (multipart form) |
| GET | /api/visitors | Yes | List visitors (filtered by role) |
| GET | /api/visitors/:id | No | Get single visitor details |
| PUT | /api/visitors/:id/status | Yes | Approve or reject visitor |
| GET | /api/visitors/:id/download | No | Download PDF pass |

### Security
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/visitors/checkin | Yes | Log check-in via QR scan |
| POST | /api/visitors/checkout | Yes | Log check-out via QR scan |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/admin/stats | Yes | Dashboard statistics |

---

## Project Structure

```
Assignment 9/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── pages/             # All page components
│   │   ├── components/        # Reusable UI (Sidebar)
│   │   ├── context/           # AuthContext for global state
│   │   ├── hooks/             # useSocket custom hook
│   │   └── services/          # Axios API client
│   └── package.json
├── server/                    # Express backend
│   ├── controllers/           # Route handler logic
│   ├── middleware/             # auth, upload, validator, error
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express route definitions
│   ├── utils/                 # passGenerator, sendEmail, sendSMS
│   ├── seed.js                # Database seeder
│   └── package.json
└── README.md
```

## What I Learned

Building this project taught me how JWT authentication works end-to-end (token generation on server, storage on client, verification on each request). I also learned how to use Socket.io for real-time notifications — the tricky part was understanding that each user needs their own "room" so messages go to the right person. The QR code flow was interesting: I generate a unique string when a visitor is approved, convert it to a QR image using the qrcode library, then embed it into a PDF with PDFKit. The security guard scans that same QR, and the server looks up the visitor by matching the string.
