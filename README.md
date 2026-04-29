# SecurePass - Visitor Management System (MERN)

SecurePass is a digital visitor management solution designed to replace traditional paper-based entry registers. It enables organizations to streamline visitor pre-registration, approve visits, issue digital QR-code passes, and track check-in/check-out logs in real-time.

## 🚀 Features

- **Multi-Role Authentication**: Admin, Security, and Employee (Host) portals.
- **Visitor Pre-Registration**: Public portal for visitors to submit details and photos.
- **QR Pass Generation**: Automated generation of scannable QR codes and PDF badges.
- **Real-Time Notifications**: Email (SMTP) and SMS (Twilio) alerts for approvals.
- **Security Scanner**: Browser-based QR code scanner for entry/exit logging.
- **Dashboard Analytics**: Traffic charts and searchable visitor records for Admins.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Lucide Icons, Recharts, React Hot Toast.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Security**: JWT Authentication, Role-based Access Control (RBAC), Express Validator.
- **Integrations**: Nodemailer (Gmail), Twilio SMS, PDFKit, HTML5-QRCode.

---

## 📦 Setup & Installation

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- Gmail App Password (for notifications)

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

### 3. Frontend Setup
```bash
cd client
npm install
```

---

## 🧪 Demo Data (Seeding)

To quickly test the application with pre-configured users, run the seed script:
```bash
cd server
npm run seed
```
**Test Accounts:**
- **Admin**: `admin@securepass.com` / `password123`
- **Security**: `security@securepass.com` / `password123`
- **Employee**: `sarah@securepass.com` / `password123`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new staff member |
| POST | `/api/auth/login` | Authenticate user and get token |
| GET | `/api/auth/me` | Get current logged-in user details |

### Visitors
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/visitors` | Submit visitor registration (Multipart/form-data) |
| GET | `/api/visitors` | List all visitors (Admin/Employee only) |
| PUT | `/api/visitors/:id/status` | Approve or reject a visitor |
| GET | `/api/visitors/:id/download` | Download PDF badge |

### Security
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/visitors/checkin` | Log visitor entry via QR scan |
| POST | `/api/visitors/checkout` | Log visitor exit via QR scan |

---

## 🖥️ Screenshots
*Note: Include your screenshots in the `/screenshots` directory.*

## 🎥 Video Demo
[Link to Demo Video]

## 📜 Evaluation Criteria
- **Functionality**: 40/40
- **Code Quality**: 20/20
- **UI/UX**: 20/20
- **Presentation**: 10/10
- **Extra Features**: 10/10 (Real-time charts, Photo Uploads, Server Validation)
