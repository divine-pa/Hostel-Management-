# Hostel Room Allocation System

A Django REST Framework-based backend system for managing hostel room allocations, designed to handle student registrations, payment verification, room assignments, and administrative operations.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [First-Time Setup](#first-time-setup)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing the API](#testing-the-api)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)

## 🎯 Overview

This is the **backend API** for the Hostel Management System. It provides:
- Student and Admin authentication with JWT tokens
- Student dashboard with room allocation details
- Payment verification system
- Hall and room management
- RESTful API for frontend integration

## ✨ Features

- **JWT Authentication**: Secure token-based authentication for students and admins
- **Student Dashboard**: Personalized dashboard showing payment status, room details, and available halls
- **Admin Dashboard**: Comprehensive hall statistics with room occupancy and maintenance tracking
- **Room Booking System**: Sequential room allocation algorithm preventing double bookings
- **Payment Verification**: Automated payment status verification before room allocation
- **Allocation Receipts**: Auto-generated allocation receipts with transaction references
- **Email Notifications**: Automated email notifications when rooms are allocated
- **Room Maintenance Management**: Admin toggle for marking rooms under maintenance
- **Audit Logging**: Comprehensive logging system for all critical actions
- **RESTful API**: Clean API endpoints for frontend integration
- **CORS Enabled**: Ready for React/Vue frontend integration
- **Environment Variables**: Secure configuration management
- **MySQL Database**: Robust data storage with transaction safety

## 🎨 Core Features Explained

### Room Booking System

The system implements a **sequential room allocation algorithm** that ensures:

1. **Fair Distribution**: Rooms are assigned in numerical order (Room 101, 102, etc.)
2. **No Double Booking**: Database transactions and row-level locking prevent conflicts
3. **Payment Verification**: Only students with verified payments can book rooms
4. **Gender Segregation**: Students are only shown halls matching their gender
5. **Maintenance Awareness**: Rooms under maintenance are excluded from allocation
6. **Automatic Receipt Generation**: Each booking creates a unique transaction reference

**Booking Flow:**
- Student logs in → Dashboard shows available halls (if payment verified)
- Student selects a hall → System finds first available room
- System creates allocation record → Generates receipt → Sends confirmation email

### Room Maintenance Management

Admins can toggle room maintenance status with:
- **Real-time Updates**: Maintenance status immediately affects availability
- **Audit Logging**: All maintenance toggles are logged with admin email and timestamp
- **Dashboard Integration**: Admin dashboard shows rooms under maintenance count
- **True Available Beds**: Calculates bookable beds excluding maintenance rooms

### Email Notification System

Automated emails are sent when:
- **Room Allocation**: Student receives confirmation with room details
- **Email Content**: Includes student name, hall name, and room number

> **Note**: Email functionality requires proper SMTP configuration in `.env` file

### Receipt Generation

Each allocation automatically creates a receipt with:
- Unique receipt number format: `BU-HAMS-{allocation_id}`
- Transaction reference (auto-generated)
- Complete student and room details
- Payment information
- Allocation timestamp

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Python**: Version 3.8 or higher ([Download](https://www.python.org/downloads/))
- **MySQL**: Version 5.7 or higher ([Download](https://dev.mysql.com/downloads/mysql/))
- **pip**: Python package installer (comes with Python)
- **Git**: For cloning the repository (optional)

## 🚀 First-Time Setup

Follow these steps **exactly** if this is your first time running the project:

### Step 1: Clone or Download the Project

If you haven't already, get the project files on your computer.

```bash
# If using Git:
cd "Documents/final year project file"
cd Hostel-Management-/trialRoomallocation

# Or just navigate to the folder where you have the project
```

### Step 2: Create a Virtual Environment

A virtual environment keeps your project dependencies isolated.

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

> ✅ You should see `(venv)` at the beginning of your command line after activation.

### Step 3: Install Required Packages

Install all the necessary Python packages:

```bash
# Install core Django packages
pip install django==6.0.1
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install python-decouple

# Install MySQL connector
pip install mysqlclient

# Install email dependencies (for allocation notifications)
pip install python-dotenv
```

> **Note**: If `mysqlclient` installation fails on Windows, see the [Troubleshooting](#2-mysqlclient-installation-fails) section below.

**Alternative for mysqlclient (if installation fails):**

```bash
pip install pymysql
```

Then add this to `trialRoomallocation/__init__.py`:

```python
import pymysql
pymysql.install_as_MySQLdb()
```

## 🗄️ Database Setup

### Step 1: Start MySQL Server

Make sure your MySQL server is running:

- **Windows**: Open MySQL Workbench or check Windows Services
- **macOS**: `brew services start mysql` (if using Homebrew)
- **Linux**: `sudo systemctl start mysql`

### Step 2: Create the Database

You should have received a database SQL file. Import it using one of these methods:

**Method 1: Using MySQL Workbench (Recommended for beginners)**
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Go to `Server` → `Data Import`
4. Select `Import from Self-Contained File`
5. Choose the `.sql` file
6. Click `Start Import`

**Method 2: Using Command Line**

```bash
# Login to MySQL
mysql -u root -p

# Create the database (if not in SQL file)
CREATE DATABASE Room_allocation_system_db;

# Exit MySQL
exit;

# Import the SQL file
mysql -u root -p Room_allocation_system_db < path/to/database_file.sql
```

### Step 3: Verify Database Creation

```bash
mysql -u root -p
SHOW DATABASES;
USE Room_allocation_system_db;
SHOW TABLES;
```

You should see tables like: `student`, `admin`, `hall`, `room`, `payment`, `allocation`, etc.

## ⚙️ Environment Configuration

### Step 1: Set Up Environment Variables

We use environment variables to keep sensitive information (like database passwords) secure.

1. **Copy the example file:**
   ```bash
   copy .env.example .env
   ```
   
   Or on macOS/Linux:
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file:**

   Open `.env` in any text editor and update these values:

   ```env
   # Database Configuration
   DB_NAME=Room_allocation_system_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here    # ⬅️ CHANGE THIS!
   DB_HOST=localhost
   DB_PORT=3306

   # Django Secret Key
   SECRET_KEY=django-insecure-+_#k3+t3sa6vc+1v_&06yzgvcuz19l6o^*9du^-w%ylr7r@%a4

   # Debug Mode
   DEBUG=True

   # Email Configuration (for allocation notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your_email@gmail.com    # ⬅️ CHANGE THIS!
   EMAIL_HOST_PASSWORD=your_app_password   # ⬅️ CHANGE THIS!
   DEFAULT_FROM_EMAIL=your_email@gmail.com
   ```

   ⚠️ **IMPORTANT**: Replace `your_mysql_password_here` with your actual MySQL root password!

3. **Never commit `.env` to Git:**
   
   The `.gitignore` file is already configured to prevent this, but double-check that `.env` is not tracked:
   
   ```bash
   git status  # .env should NOT appear here
   ```

### Step 2: Map Database to Django Models (Optional)

If you're starting fresh or the models need updating:

```bash
python manage.py inspectdb > testdbModel/models.py
```

> **Note**: Only run this if instructed or if you're setting up from scratch.

## 🏃 Running the Application

### Step 1: Apply Database Migrations

```bash
# Create migration files (if needed)
python manage.py makemigrations

# Apply migrations to database
python manage.py migrate
```

> **Note**: Since models are set to `managed = False`, this primarily sets up Django's internal tables.

### Step 2: Start the Development Server

```bash
python manage.py runserver
```

You should see:

```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

✅ **Your backend is now running!**

### Step 3: Verify It's Working

Open your browser and go to:
- `http://127.0.0.1:8000/api/hall/` - You should see JSON data with all halls

## 🔌 API Endpoints

All API endpoints are prefixed with `/api/`:

### Public Endpoints (No Authentication Required)

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/student/` | GET | Get all students | None |
| `/api/admin/` | GET | Get all admins | None |
| `/api/hall/` | GET | Get all halls | None |
| `/api/payment/` | GET | Get all payments | None |
| `/api/student/login/` | POST | Student login | `matriculation_number`, `password` |
| `/api/admin/login/` | POST | Admin login | `email`, `password` |
| `/api/student/dashboard/` | GET | Get student dashboard | `matriculation_number` (query param) |
| `/api/admin/dashboard/` | GET | Get admin dashboard | `email` (query param) |
| `/api/bookRoom/` | POST | Book a room for student | `hall_id`, `matriculation_number` |
| `/api/allocation/` | GET | Get allocation receipt | `matriculation_number` (query param) |
| `/api/rooms/<room_id>/toggle-maintenance/` | PATCH | Toggle room maintenance status | `email` (query param), `room_id` (URL param) |

### Protected Endpoints (Requires Authentication)

> **Note**: Currently, most endpoints use `AllowAny` permission for development. In production, these should require JWT authentication.

| Endpoint | Method | Description | Headers Required |
|----------|--------|-------------|------------------|
| All endpoints | * | All endpoints (to be secured) | `Authorization: Bearer <token>` |

### Authentication Response Format

**Student Login:**
```json
// Request: POST /api/student/login/
{
  "matriculation_number": "CSC/2020/001",
  "password": "student_password"
}

// Response:
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "student_name": "John Doe",
  "level": "300",
  "matric_number": "CSC/2020/001"
}
```

**Admin Login:**
```json
// Request: POST /api/admin/login/
{
  "email": "admin@example.com",
  "password": "admin_password"
}

// Response:
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "admin_name": "Admin Name",
  "email": "admin@example.com"
}
```

**Student Dashboard:**
```json
// Request: GET /api/student/dashboard/?matriculation_number=CSC/2020/001

// Response (Student with room):
{
  "profile": {
    "full_name": "John Doe",
    "matriculation_number": "CSC/2020/001",
    "level": "300",
    "payment_status": "Verified",
    "department": "Computer Science",
    "room_details": {
      "room_id": 1,
      "room_number": "A101",
      "capacity": 4,
      "current_occupants": 2,
      "room_status": "occupied",
      "is_under_maintenance": false
    },
    "hall_details": {
      "hall_id": 1,
      "hall_name": "Grace Hall",
      "gender": "Female"
    }
  },
  "room_details": {
    "hall_name": "Grace Hall",
    "room_number": "A101"
  }
}

// Response (Student without room but payment verified):
{
  "profile": {
    "full_name": "Jane Smith",
    "matriculation_number": "CSC/2020/002",
    "level": "200",
    "payment_status": "Verified",
    "department": "Computer Science"
  },
  "available_halls": [
    {
      "hall_id": 1,
      "hall_name": "Grace Hall",
      "gender": "Female",
      "total_rooms": 50,
      "available_rooms": 10
    }
  ]
}
```

**Admin Dashboard:**
```json
// Request: GET /api/admin/dashboard/?email=admin@example.com

// Response:
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "role": "Hall Admin",
  "hall_details": {
    "hall_name": "Grace Hall",
    "gender": "Female",
    "total_rooms": 50,
    "available_rooms": 10,
    "rooms_under_maintenance": 2,
    "true_available_beds": 40,
    "total_students_in_hall": 150,
    "occupancy_rate": "75%",
    "rooms": [
      {
        "room_id": 1,
        "room_number": "A101",
        "capacity": 4,
        "current_occupants": 3,
        "room_status": "occupied",
        "is_under_maintenance": false,
        "occupants_list": [
          {
            "matric_number": "CSC/2020/001",
            "full_name": "John Doe",
            "level": "300",
            "phone_number": "08012345678",
            "department": "Computer Science"
          }
        ]
      }
    ]
  }
}
```

**Room Booking:**
```json
// Request: POST /api/bookRoom/
{
  "hall_id": 1,
  "matriculation_number": "CSC/2020/001"
}

// Response (Success):
{
  "message": "Room booked successfully",
  "room number": "A101",
  "hall name": "Grace Hall"
}

// Response (Error - Already has room):
{
  "error": "Student already has a room"
}

// Response (Error - Payment not verified):
{
  "error": "Payment not verified"
}

// Response (Error - Hall full):
{
  "error": "The hall is fully booked"
}
```

**Allocation Receipt:**
```json
// Request: GET /api/allocation/?matriculation_number=CSC/2020/001

// Response:
{
  "receipt_no": "BU-HAMS-1234",
  "full_name": "John Doe",
  "matric_no": "CSC/2020/001",
  "department": "Computer Science",
  "level": "300",
  "hall_name": "Grace Hall",
  "room_number": "A101",
  "allocation_date": "2026-02-18T00:00:00Z",
  "status": "active",
  "house_address": "123 Main Street, Lagos",
  "gender": "Male",
  "phone_number": "08012345678",
  "email": "john@example.com",
  "transaction_reference": "TXN-20260218-ABC123",
  "amount_paid": 50000.00
}
```

**Toggle Room Maintenance:**
```json
// Request: PATCH /api/rooms/1/toggle-maintenance/?email=admin@example.com

// Response:
{
  "message": "Room maintenance status toggled successfully",
  "room_number": "A101",
  "hall_name": "Grace Hall",
  "is_under_maintenance": true
}
```

## 🧪 Testing the API

### Using Browser (GET Requests Only)

Simply navigate to:
- `http://127.0.0.1:8000/api/student/`
- `http://127.0.0.1:8000/api/hall/`

### Using Postman (Recommended)

1. **Download Postman**: [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

2. **Test Student Login:**
   - Method: `POST`
   - URL: `http://127.0.0.1:8000/api/student/login/`
   - Body (JSON):
     ```json
     {
       "matriculation_number": "CSC/2020/001",
       "password": "your_password"
     }
     ```
   - Click `Send`
   - Copy the `access` token from the response

3. **Test Student Dashboard:**
   - Method: `GET`
   - URL: `http://127.0.0.1:8000/api/student/dashboard/?matriculation_number=CSC/2020/001`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer <paste_access_token_here>`
   - Click `Send`

### Using curl (Command Line)

```bash
# Test GET endpoint
curl http://127.0.0.1:8000/api/hall/

# Test Student Login
curl -X POST http://127.0.0.1:8000/api/student/login/ \
  -H "Content-Type: application/json" \
  -d "{\"matriculation_number\":\"CSC/2020/001\",\"password\":\"password123\"}"

# Test Dashboard (replace TOKEN with actual token)
curl http://127.0.0.1:8000/api/student/dashboard/?matriculation_number=CSC/2020/001 \
  -H "Authorization: Bearer TOKEN"
```

## 📁 Project Structure

```
trialRoomallocation/
├── manage.py                      # Django management script
├── .env                           # Environment variables (DO NOT COMMIT)
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore file
├── README.md                      # This file
│
├── trialRoomallocation/           # Project configuration
│   ├── __init__.py
│   ├── settings.py                # Project settings (uses .env variables)
│   ├── urls.py                    # Main URL routing
│   ├── wsgi.py                    # WSGI configuration
│   └── asgi.py                    # ASGI configuration
│
└── testdbModel/                   # Main application
    ├── __init__.py
    ├── models.py                  # Database models (Student, Admin, Hall, etc.)
    ├── views.py                   # API view functions
    ├── serializers.py             # DRF serializers
    ├── urls.py                    # App-specific URL routing
    ├── admin.py                   # Django admin configuration
    ├── apps.py                    # App configuration
    └── migrations/                # Database migrations
```

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. **MySQL Connection Error**

**Error**: 
```
django.db.utils.OperationalError: (2003, "Can't connect to MySQL server")
```

**Solutions**:
- ✅ Ensure MySQL service is running
- ✅ Verify database credentials in `.env` file
- ✅ Check if the database exists:
  ```bash
  mysql -u root -p
  SHOW DATABASES;
  ```
- ✅ Make sure MySQL is running on port 3306 (or update `DB_PORT` in `.env`)

#### 2. **mysqlclient Installation Fails**

**Error**: 
```
error: Microsoft Visual C++ 14.0 or greater is required
```

**Solutions**:

**Option 1**: Install Microsoft C++ Build Tools
- Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
- Install "Desktop development with C++" workload

**Option 2**: Use pymysql instead
```bash
pip install pymysql
```

Then add to `trialRoomallocation/__init__.py`:
```python
import pymysql
pymysql.install_as_MySQLdb()
```

#### 3. **"No module named 'decouple'" Error**

**Solution**:
```bash
pip install python-decouple
```

#### 4. **Port Already in Use**

**Error**: 
```
Error: That port is already in use.
```

**Solution**:
```bash
# Use a different port
python manage.py runserver 8080
```

Or find and kill the process using port 8000:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

#### 5. **401 Unauthorized on Dashboard**

**Causes**:
- Missing or invalid JWT token
- Token expired

**Solution**:
- Login again to get a fresh token
- Make sure to include `Authorization: Bearer <token>` header
- Check token expiry (default: 60 minutes)

#### 6. **CORS Errors (from Frontend)**

If your frontend can't connect:

- ✅ Ensure frontend URL is in `settings.py` → `CORS_ALLOWED_ORIGINS`
- ✅ Default allowed: `http://localhost:5173` (Vite) and `http://localhost:3000` (React)
- ✅ Add your frontend URL if different

#### 7. **Database Tables Not Found**

**Solution**:
- Make sure you imported the SQL database file
- Verify tables exist:
  ```bash
  mysql -u root -p
  USE Room_allocation_system_db;
  SHOW TABLES;
  ```

## 🔐 Security Notes

> ⚠️ **WARNING**: This is a development setup. Before deploying to production:

1. ✅ Change `DEBUG = False` in `.env`
2. ✅ Update `SECRET_KEY` to a secure, random value
3. ✅ Configure `ALLOWED_HOSTS` in `settings.py`
4. ✅ **NEVER commit `.env` file to version control**
5. ✅ Use HTTPS in production
6. ✅ Hash passwords (currently using plain text - **MUST FIX BEFORE PRODUCTION**)
7. ✅ Add rate limiting for API endpoints
8. ✅ Use environment-specific `.env` files for different environments
9. ✅ Replace `AllowAny` permissions with proper JWT authentication
10. ✅ Configure email settings with secure credentials (for production email notifications)
11. ✅ Implement proper CORS policy (restrict allowed origins)
12. ✅ Add input validation and sanitization for all endpoints

## 📝 Quick Start Checklist

Use this checklist to ensure you've set everything up correctly:

- [ ] Python 3.8+ installed
- [ ] MySQL installed and running
- [ ] Virtual environment created and activated
- [ ] All packages installed (`pip install ...`)
- [ ] Database imported from SQL file
- [ ] `.env` file created and configured with your MySQL password
- [ ] Migrations applied (`python manage.py migrate`)
- [ ] Server running (`python manage.py runserver`)
- [ ] Tested at least one API endpoint in browser/Postman

## 🤝 Contributing

If you're working on this project as a team:

1. **Always pull latest changes before starting work:**
   ```bash
   git pull origin main
   ```

2. **Create a new branch for features:**
   ```bash
   git checkout -b feature-name
   ```

3. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

4. **Push to the branch:**
   ```bash
   git push origin feature-name
   ```

5. **Create a Pull Request** for code review

### Important Git Rules:
- ❌ **NEVER commit `.env` file** (contains passwords!)
- ✅ Always commit `.env.example` (template without passwords)
- ✅ Write clear commit messages
- ✅ Test your code before committing

## 📧 Support & Resources

### Documentation:
- Django: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- JWT Authentication: https://django-rest-framework-simplejwt.readthedocs.io/

### Getting Help:
1. Check the [Troubleshooting](#troubleshooting) section above
2. Ask your teammates
3. Search for error messages on Stack Overflow
4. Check Django/DRF documentation

---

## 🎓 For Teammates Running This for the First Time

**Start here:**

1. Read the [Prerequisites](#prerequisites) section
2. Follow [First-Time Setup](#first-time-setup) **step by step**
3. Complete the [Database Setup](#database-setup)
4. Configure your [Environment Variables](#environment-configuration)
5. [Run the Application](#running-the-application)
6. [Test the API](#testing-the-api) to make sure everything works

**If you get stuck:**
- Check [Troubleshooting](#troubleshooting)
- Ask the team on your group chat
- Don't skip steps!

---

**Happy Coding! 🚀**

*Last Updated: February 2026*
