# SecurePass - Visitor Management System

A premium, MERN-stack based digital visitor management solution designed for modern organizations. SecurePass replaces outdated manual registers with a secure, QR-code based digital pass system.

## 🚀 Features

- **Role-Based Dashboards**: Tailored experiences for Admins, Security, and Employees.
- **Pre-Registration**: Visitors can register online before their visit.
- **One-Click Approval**: Employees receive real-time requests and can approve or reject with one click.
- **QR Pass System**: Secure digital passes generated for every approved visitor.
- **Real-time Scanning**: Security portal with integrated QR scanner for paperless check-in/out.
- **Analytics Dashboard**: Comprehensive stats and traffic trends for administrators.
- **PDF Export**: Professional visitor badges available for download.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express.js, JWT Authentication.
- **Database**: MongoDB (Mongoose).
- **Utilities**: QRCode.js, PDFKit, HTML5-QRCode.

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone <repo-url>
cd visitor-pass-system
```

### 2. Backend Setup
```bash
cd server
npm install
```
- Create a `.env` file based on the provided template.
- Run `npm run seed` to populate initial users.
- Start the server: `npm run dev`

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 🔐 Demo Credentials
- **Admin**: `admin@securepass.com` / `password123`
- **Security**: `security@securepass.com` / `password123`
- **Employee**: `sarah@securepass.com` / `password123`

---
Built with ❤️ for Assignment 9.
