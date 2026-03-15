# BU-HAMS — Hostel Allocation & Management System

> **Final Year Project** — A full-stack web application for managing university hostel room allocations at Babcock University.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [API Reference](#api-reference)
- [Frontend Pages & Routes](#frontend-pages--routes)
- [Testing the API](#testing-the-api)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)
- [Contributing](#contributing)
- [Resources](#resources)

---

## 🎯 Overview

**BU-HAMS** (Babcock University – Hostel Allocation & Management System) is a full-stack application that streamlines the hostel room allocation process for both students and administrators.

**Students** can:
- Log in and view their dashboard with payment status
- Browse available halls filtered by gender
- Select a specific room from available rooms in a hall
- Receive an e-receipt (viewable in-app and emailed as a PDF)
- View their roommates after allocation

**Administrators** can:
- View a comprehensive dashboard with hall statistics and occupancy metrics
- Manage rooms (view occupants, toggle maintenance status)
- Search and browse student records within their hall
- View allocation analytics with interactive charts
- Access and download student allocation receipts

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.8+ | Language |
| Django | 6.0.1 | Web framework |
| Django REST Framework | 3.15.2 | RESTful API |
| SimpleJWT | 5.4.0 | JWT authentication |
| django-cors-headers | 4.6.0 | Cross-origin requests |
| python-decouple | 3.8 | Environment variables |
| PyMySQL | 1.1.1 | MySQL database driver |
| xhtml2pdf | 0.2.17 | PDF receipt generation |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| Vite | 5.x | Build tool & dev server |
| TailwindCSS | 3.4 | Utility-first styling |
| Axios | 1.13 | HTTP client |
| React Router | 7.x | Client-side routing |
| Recharts | 3.7 | Data visualisation (charts) |
| @react-pdf/renderer | 4.3 | In-browser PDF generation |

### Database
- **MySQL 5.7+** (or Aiven-hosted MySQL for remote development)

---

## ✨ Features

### Core Features
- **JWT Authentication** — Secure token-based login for students and admins (access + refresh tokens)
- **Student Dashboard** — Tabbed layout with *Available Halls*, *My Room*, and *E-Receipt* tabs
- **Room Selection** — Students pick a specific room from a list showing room number and available beds
- **Room Booking** — Atomic, transaction-safe booking with row-level locking to prevent double-booking
- **Admin Dashboard** — Sidebar layout with Dashboard, Rooms, Students, and Reports sections
- **Allocation Receipts** — Auto-generated receipts with unique `BU-HAMS-{id}` receipt numbers
- **PDF Receipt Download** — In-app PDF generation using `@react-pdf/renderer`

### Student Features
- View personal profile (name, matric number, department, level, payment status)
- Browse gender-matched halls with available room counts
- Select a specific room and see available bed spaces
- View allocated room details and roommates (name & level)
- Download allocation receipt as PDF
- Receive email confirmation with PDF receipt attached

### Admin Features
- **Dashboard Overview**: Occupancy rate, total rooms, available rooms, maintenance count, total students, true available beds
- **Room Management**: View all rooms with occupant details, toggle room maintenance status with audit logging
- **Student Records**: Search and browse all students allocated within the admin's hall
- **Reports & Analytics**: Allocation trend graph (daily allocations filtered by hall), student receipt list with download capability
- **Allocation Graph**: Interactive Recharts-powered line/bar chart showing daily allocation trends

### System Features
- **Gender Segregation** — Students only see halls matching their gender
- **Payment Verification** — Only students with verified payments can book rooms
- **Maintenance Awareness** — Rooms under maintenance are excluded from allocation
- **Email Notifications** — Automated emails on room allocation with PDF receipt attachment
- **Audit Logging** — All critical actions (maintenance toggles, bookings) are logged with timestamps
- **CORS Enabled** — Ready for cross-origin frontend integration
- **Responsive Design** — Mobile-friendly UI tested down to 320px screen width

---

## 📁 Project Structure

```
Hostel-Management-/
├── README.md                          # This file
├── ROOM_SELECTION_EXPLAINED.md        # Detailed room selection documentation
├── DataBaseForProject.sql             # Database schema & seed data
│
├── trialRoomallocation/               # ── Django Backend ──
│   ├── manage.py                      # Django management script
│   ├── requirements.txt               # Python dependencies
│   ├── .env                           # Environment variables (DO NOT COMMIT)
│   ├── .env.example                   # Environment template
│   │
│   ├── trialRoomallocation/           # Project configuration
│   │   ├── settings.py                # Django settings (DB, JWT, CORS, Email)
│   │   ├── urls.py                    # Root URL routing
│   │   ├── wsgi.py                    # WSGI entry point
│   │   └── asgi.py                    # ASGI entry point
│   │
│   └── testdbModel/                   # Main Django app
│       ├── models.py                  # Database models (Student, Admin, Hall, Room, etc.)
│       ├── views.py                   # API view functions (14 endpoints)
│       ├── serializers.py             # DRF serializers
│       ├── urls.py                    # App URL routing
│       ├── utils.py                   # Helpers (email sending, transaction ID generation)
│       ├── admin.py                   # Django admin configuration
│       ├── templates/                 # HTML email templates
│       └── migrations/                # Database migrations
│
└── PROJECTFRONTEND/                   # ── React Frontend ──
    ├── package.json                   # Node dependencies & scripts
    ├── vite.config.js                 # Vite configuration
    ├── tailwind.config.js             # Tailwind CSS configuration
    ├── index.html                     # HTML entry point
    │
    └── src/
        ├── main.jsx                   # React entry point
        ├── App.jsx                    # Root component with routing
        ├── index.css                  # Global styles & design tokens
        ├── styles.css                 # Component styles
        │
        ├── auth/
        │   └── authcontext.jsx        # Authentication context provider
        │
        ├── component/
        │   └── protectedroute.jsx     # Route guard (redirects if not logged in)
        │
        ├── services/
        │   └── auth.jsx               # API service layer (Axios interceptors, auth helpers)
        │
        └── pages/
            ├── landingpage.jsx        # Landing / Home page
            ├── login.jsx              # Login type selector
            ├── studentLoginn.jsx      # Student login form
            ├── adminLogin.jsx         # Admin login form
            ├── studentdashboard.jsx   # Student dashboard (tabs: Halls, My Room, E-Receipt)
            ├── reciept.jsx            # Student receipt page
            ├── ReceiptDocument.jsx    # PDF receipt template (@react-pdf)
            ├── AdminLayout.jsx        # Admin sidebar wrapper
            ├── admindashboard.jsx     # Admin dashboard overview
            ├── AdminRooms.jsx         # Admin room management
            ├── AdminStudents.jsx      # Admin student records
            ├── AdminReports.jsx       # Admin reports & analytics
            ├── AdminSettings.jsx      # Admin settings (currently disabled)
            ├── adminReceipts.jsx      # Admin receipt list view
            ├── Charts.jsx             # Recharts allocation graph component
            └── persistent.jsx         # Legacy persistent data view
```

---

## 🔧 Prerequisites

- **Python** 3.8+ — [Download](https://www.python.org/downloads/)
- **Node.js** 18+ with npm — [Download](https://nodejs.org/)
- **MySQL** 5.7+ — [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** (optional) — [Download](https://git-scm.com/)

---

## 🚀 Getting Started

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd "Hostel-Management-/trialRoomallocation"

# 2. Create and activate a virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Set up your environment variables (see section below)
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux

# 5. Edit .env with your database credentials and email settings

# 6. Run migrations
python manage.py makemigrations
python manage.py migrate

# 7. Start the backend server
python manage.py runserver
```

> ✅ Backend will be running at `http://127.0.0.1:8000/`

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd "Hostel-Management-/PROJECTFRONTEND"

# 2. Install Node dependencies
npm install

# 3. Start the development server
npm run dev
```

> ✅ Frontend will be running at `http://localhost:5173/`

> ⚠️ **React 18 Required**: The project uses React 18. If you encounter `Missing "./compiler-runtime" specifier in "react" package`, run:
> ```bash
> npm install react@18 react-dom@18 vite@5 @vitejs/plugin-react@4
> ```

---

## ⚙️ Environment Configuration

Create a `.env` file inside `trialRoomallocation/` with the following variables:

```env
# Database Configuration
DB_NAME=Room_allocation_system_db
DB_USER=root
DB_PASSWORD=your_mysql_password       # ⬅️ CHANGE THIS
DB_HOST=localhost
DB_PORT=3306

# Django Settings
SECRET_KEY=django-insecure-+_#k3+t3sa6vc+1v_&06yzgvcuz19l6o^*9du^-w%ylr7r@%a4
DEBUG=True

# Email Configuration (for receipt emails)
EMAIL_HOST_USER=your_email@gmail.com   # ⬅️ CHANGE THIS
EMAIL_HOST_PASSWORD=your_app_password  # ⬅️ CHANGE THIS (use Gmail App Password)
```

> ⚠️ **NEVER commit `.env` to version control.** The `.gitignore` is already configured to exclude it.

---

## 🗄️ Database Setup

### Option 1: Import the SQL File (Recommended)

```bash
# Using MySQL command line
mysql -u root -p < DataBaseForProject.sql
```

Or import `DataBaseForProject.sql` via **MySQL Workbench** → `Server` → `Data Import` → `Import from Self-Contained File`.

### Option 2: Create from Scratch

```sql
mysql -u root -p
CREATE DATABASE Room_allocation_system_db;
exit;
mysql -u root -p Room_allocation_system_db < DataBaseForProject.sql
```

### Verify

```sql
mysql -u root -p
USE Room_allocation_system_db;
SHOW TABLES;
-- Expected: admin, allocation, hall, log, payment, receipt, room, student
```

---

## 🔌 API Reference

All endpoints are prefixed with `/api/`. The backend runs at `http://127.0.0.1:8000`.

### Data Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/student/` | GET | List all students |
| `/api/admin/` | GET | List all admins |
| `/api/hall/` | GET | List all halls |
| `/api/payment/` | GET | List all payments |

### Authentication

| Endpoint | Method | Body | Description |
|---|---|---|---|
| `/api/student/login/` | POST | `{ matriculation_number, password }` | Student login → returns JWT tokens |
| `/api/admin/login/` | POST | `{ email, password }` | Admin login → returns JWT tokens |

**Response (both logins):**
```json
{
  "refresh": "eyJ...",
  "access": "eyJ...",
  "student_name": "John Doe",   // or "admin_name"
  "matric_number": "CSC/2020/001"  // or "email"
}
```

### Student Endpoints

| Endpoint | Method | Params | Description |
|---|---|---|---|
| `/api/student/dashboard/` | GET | `?matriculation_number=...` | Student dashboard data (profile, available halls or room details + roommates) |
| `/api/available-rooms/` | GET | `?hall_id=...` | List available rooms in a hall (room number, capacity, occupants) |
| `/api/bookRoom/` | POST | `{ hall_id, room_id, matriculation_number }` | Book a specific room |
| `/api/allocation/` | GET | `?matriculation_number=...` | Get allocation receipt data |

### Admin Endpoints

| Endpoint | Method | Params | Description |
|---|---|---|---|
| `/api/admin/dashboard/` | GET | `?email=...` | Admin dashboard (hall stats, rooms, occupants) |
| `/api/rooms/<room_id>/toggle-maintenance/` | PATCH | `?email=...` | Toggle room maintenance status |
| `/api/allocation-graph/` | GET | `?email=...` | Daily allocation trend data (filtered by admin's hall) |
| `/api/admin/receipts/` | GET | `?email=...` | All student receipts in admin's hall |

---

## 🗺️ Frontend Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` or `/landingpage` | Landing Page | Public |
| `/LoginPage` | Login Selector | Public |
| `/studentlogin` | Student Login | Public |
| `/adminlogin` | Admin Login | Public |
| `/studentdashboard` | Student Dashboard (tabbed) | 🔒 Protected |
| `/reciept` | Student Receipt | 🔒 Protected |
| `/admin` | Admin Dashboard | 🔒 Protected |
| `/admin/rooms` | Room Management | 🔒 Protected |
| `/admin/students` | Student Records | 🔒 Protected |
| `/admin/reports` | Reports & Analytics | 🔒 Protected |

### Student Dashboard Tabs
1. **Available Halls** — Browse halls matching student's gender, select a hall, then pick a room
2. **My Room** — View allocated room details (hall, room number, capacity) and roommates list
3. **E-Receipt** — View and download allocation receipt as PDF

### Admin Dashboard Sections
1. **Dashboard** — Overview cards (occupancy rate, room counts, student count) + allocation trend chart
2. **Rooms** — Grid of all rooms showing occupant count, status, maintenance toggle, and occupant details modal
3. **Students** — Searchable table of all students in the admin's hall
4. **Reports** — Allocation analytics and downloadable student receipt list

---

## 🧪 Testing the API

### Browser (GET requests)
Navigate to `http://127.0.0.1:8000/api/hall/` to verify the backend is running.

### Postman

1. **Login**: `POST http://127.0.0.1:8000/api/student/login/` with JSON body
2. **Dashboard**: `GET http://127.0.0.1:8000/api/student/dashboard/?matriculation_number=CSC/2020/001`
3. **Book Room**: `POST http://127.0.0.1:8000/api/bookRoom/` with `{ "hall_id": 1, "room_id": 5, "matriculation_number": "CSC/2020/001" }`

### curl

```bash
# List halls
curl http://127.0.0.1:8000/api/hall/

# Student login
curl -X POST http://127.0.0.1:8000/api/student/login/ \
  -H "Content-Type: application/json" \
  -d "{\"matriculation_number\":\"CSC/2020/001\",\"password\":\"password123\"}"

# Student dashboard
curl "http://127.0.0.1:8000/api/student/dashboard/?matriculation_number=CSC/2020/001"
```

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---|---|
| `Can't connect to MySQL server` | Ensure MySQL is running. Verify credentials in `.env`. |
| `mysqlclient` installation fails | Use `pip install pymysql` and add `import pymysql; pymysql.install_as_MySQLdb()` to `trialRoomallocation/__init__.py` |
| `No module named 'decouple'` | Run `pip install python-decouple` |
| `Port already in use` | Run `python manage.py runserver 8080` or kill the process on port 8000 |
| `Missing "./compiler-runtime"` (frontend) | Downgrade: `npm install react@18 react-dom@18 vite@5 @vitejs/plugin-react@4` |
| CORS errors from frontend | Check `CORS_ALLOW_ALL_ORIGINS = True` in `settings.py` or add your frontend URL to `CORS_ALLOWED_ORIGINS` |
| Tables not found | Import `DataBaseForProject.sql` into MySQL first, then run `python manage.py migrate` |

---

## 🔐 Security Notes

> ⚠️ This is a **development** setup. Before deploying to production:

1. Set `DEBUG = False` in `.env`
2. Generate a strong, random `SECRET_KEY`
3. Configure `ALLOWED_HOSTS` in `settings.py`
4. **Never** commit `.env` to version control
5. Use HTTPS in production
6. **Hash passwords** (currently stored in plain text — must fix for production)
7. Add rate limiting for API endpoints
8. Replace `AllowAny` permissions with proper JWT authentication on all endpoints
9. Restrict CORS to specific allowed origins
10. Configure email with secure credentials and app-specific passwords

---

## 📝 Quick Start Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] MySQL installed and running
- [ ] Virtual environment created and activated
- [ ] `pip install -r requirements.txt` completed
- [ ] Database imported from `DataBaseForProject.sql`
- [ ] `.env` configured with database password and email credentials
- [ ] `python manage.py migrate` ran successfully
- [ ] Backend running at `http://127.0.0.1:8000/`
- [ ] `npm install` in `PROJECTFRONTEND/` completed
- [ ] Frontend running at `http://localhost:5173/`
- [ ] Tested at least one API endpoint

---

## 🤝 Contributing

```bash
# 1. Pull latest changes
git pull origin main

# 2. Create a feature branch
git checkout -b feature-name

# 3. Make changes and commit
git add .
git commit -m "Description of changes"

# 4. Push and create a Pull Request
git push origin feature-name
```

**Rules:**
- ❌ Never commit `.env` (contains passwords)
- ✅ Always commit `.env.example`
- ✅ Write clear commit messages
- ✅ Test your code before committing

---

## 📧 Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/docs/)
- [Recharts](https://recharts.org/)
- [React PDF](https://react-pdf.org/)

---

*Last Updated: March 2026*
