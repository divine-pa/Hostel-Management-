# Trial Room Allocation System

A Django REST Framework-based backend system for managing hostel room allocations, designed to handle student registrations, payment verification, room assignments, and administrative operations.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)


## ✨ Features

- **RESTful API**: Clean API endpoints for frontend integration

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Python**: Version 3.8 or higher
- **MySQL**: Version 5.7 or higher
- **pip**: Python package installer
- **Virtual Environment** (recommended): `venv` or `virtualenv`

## 📦 Installation

## open the file in IDE


### 1. Create a Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install django==6.0.1
pip install djangorestframework
pip install mysqlclient
```

> **Note**: If you encounter issues installing `mysqlclient` on Windows, you may need to install Microsoft C++ Build Tools or use an alternative like `pymysql`.

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

### 1. Create MySQL Database from the database file previously sent



```sql

```

### 2. Configure Database Credentials

Open `trialRoomallocation/settings.py` and update the database configuration (lines 77-86):

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'Room_allocation_system_db',
        'USER': 'root',           # Your MySQL username
        'PASSWORD': 'your_password',  # Your MySQL password
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

> ⚠️ **IMPORTANT**: Replace `'your_password'` with your actual MySQL password. Never commit sensitive credentials to version control.

### 3. Run Migrations

```bash
# Create migration files
python manage.py makemigrations

# Apply migrations to database
python manage.py migrate
```
# run this to map ORM in the database
python manage.py inspectdb > testdbModel/models.py


> **Note**: The models are currently set with `managed = False`, which means Django won't create tables automatically. You may need to create the database schema manually or set `managed = True` in the models.


## 🚀 Running the Application

### 1. Start the Development Server

```bash
python manage.py runserver
```

The server will start at `http://127.0.0.1:8000/`

### 2. Access the Application

- **Admin Panel**: `http://127.0.0.1:8000/admin/`
- **API Base URL**: `http://127.0.0.1:8000/api/`

## 🔌 API Endpoints

All API endpoints are prefixed with `/api/`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/student/` | GET | Retrieve all students |
| `/api/admin/` | GET | Retrieve all administrators |
| `/api/hall/` | GET | Retrieve all halls |
| `/api/payment/` | GET | Retrieve all payments |

### Example API Request

```bash
# Get all students
curl http://127.0.0.1:8000/api/student/

# Or use a browser/Postman to access:
http://127.0.0.1:8000/api/student/
```

### Example Response

```json
[
    {
        "student_id": 1,
        "matric_number": "CSC/2020/001",
        "full_name": "John Doe",
        "email": "john@example.com",
        "department": "Computer Science",
        "level": "300",
        "gender": "Male",
        "payment_status": "Verified"
    }
]
```

## 📁 Project Structure

```
trialRoomallocation/
├── manage.py                      # Django management script
├── trialRoomallocation/           # Project configuration
│   ├── __init__.py
│   ├── settings.py                # Project settings & database config
│   ├── urls.py                    # Main URL routing
│   ├── wsgi.py                    # WSGI configuration
│   └── asgi.py                    # ASGI configuration
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

**Error**: `django.db.utils.OperationalError: (2003, "Can't connect to MySQL server")`

**Solution**:
- Ensure MySQL service is running
- Verify database credentials in `settings.py`
- Check if the database exists: `SHOW DATABASES;`

#### 2. **mysqlclient Installation Fails**

**Error**: `error: Microsoft Visual C++ 14.0 or greater is required`

**Solution**:
- Install Microsoft C++ Build Tools
- Or use `pymysql` as an alternative (see Installation section)

#### 3. **No Tables Created After Migration**

**Issue**: Models have `managed = False`

**Solution**:
- Change `managed = False` to `managed = True` in all models in `models.py`
- Run `python manage.py makemigrations` and `python manage.py migrate` again
- Or create tables manually using SQL

#### 4. **Port Already in Use**

**Error**: `Error: That port is already in use.`

**Solution**:
```bash
# Run on a different port
python manage.py runserver 8080
```

#### 5. **CSRF Token Errors**

**Solution**: For API testing, you can temporarily disable CSRF for specific views or use Django REST Framework's built-in CSRF handling.

## 🔐 Security Notes

> ⚠️ **WARNING**: This is a development setup. Before deploying to production:

1. Change `DEBUG = False` in `settings.py`
2. Update `SECRET_KEY` to a secure, random value
3. Configure `ALLOWED_HOSTS` properly
4. Use environment variables for sensitive data
5. Enable HTTPS
6. Implement proper authentication and authorization
7. Add rate limiting and security middleware

## 📝 Next Steps

After getting the application running:

1. **Populate Database**: Add sample halls, rooms, and students
2. **Test API Endpoints**: Use Postman or curl to test all endpoints
3. **Extend Functionality**: Add POST, PUT, DELETE endpoints for full CRUD operations
4. **Frontend Integration**: Connect with a React/Vue/Angular frontend
5. **Authentication**: Implement JWT or session-based authentication
6. **Documentation**: Use tools like Swagger/OpenAPI for API documentation

## 🤝 Contributing

If you're working on this project as a team:

1. Create a new branch for features: `git checkout -b feature-name`
2. Make your changes and commit: `git commit -m "Description"`
3. Push to the branch: `git push origin feature-name`
4. Create a Pull Request

## 📧 Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review Django documentation: https://docs.djangoproject.com/
- Review DRF documentation: https://www.django-rest-framework.org/

---

**Happy Coding! 🚀**
