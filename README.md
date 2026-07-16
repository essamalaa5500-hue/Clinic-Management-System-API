# 🏥 Clinic Management System API

A complete **Clinic Management System REST API** built with **Node.js**, **Express.js**, and **MongoDB**.

This project helps clinics manage patients, doctors, appointments, expenses, and provides dashboard analytics with secure JWT authentication.

---

## 🚀 Features

### 🔐 Authentication

- JWT Authentication
- Refresh Token Authentication
- Forgot Password (OTP via Email)
- Reset Password
- Change Password
- Secure Password Hashing (bcrypt)

### 👤 User Management

- Create Users
- Admin / Doctor / Receptionist Roles
- Get Current User
- Update User
- Doctor & Receptionist Listing

### 👨‍⚕️ Doctor Management

- Create Doctor
- Update Doctor
- Working Schedule
- Consultation Fee
- Appointment Duration
- Search Doctors
- Pagination

### 🧑 Patient Management

- Create Patient
- Update Patient
- Search Patients
- Get Patient by Phone Number
- Pagination

### 📅 Appointment Management

- Create Appointment
- Update Appointment
- Update Appointment Status
- Delete Appointment
- Today's Appointments
- Search & Filter
- Sorting
- Pagination
- Queue Number
- Prevent Duplicate Appointment Times

### 🩺 Specializations

- CRUD Operations
- Get Doctors by Specialization

### 💰 Expense Management

- Create Expense
- Update Expense
- Delete Expense
- Expense Statistics
- Monthly Expenses
- Expenses by Category

### 📊 Dashboard & Analytics

- Dashboard Cards
- Revenue Statistics
- Monthly Appointments
- Top Doctors
- Top Patients
- Doctor Performance

### 📖 API Documentation

- Swagger UI Documentation

---

# 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Joi
- Swagger
- Cloudinary
- Nodemailer
- bcrypt
- express-async-handler

---

# 📁 Project Structure

```
src
│
├── controllers
├── models
├── routes
├── middlewares
├── config
├── docs
└── utils
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/essamalaa5500-hue/Clinic-Management-System-API
```

Go to the project

```bash
cd Clinic-Management-System-API
```

Install dependencies

```bash
npm install
```

Create a `.env` file.

Run the server

```bash
npm run dev
```

or

```bash
npm start
```

---

# 🔑 Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

MONGO_URI=

JWT_ACCESS_TOKEN_SECRET_KEY=
JWT_REFRESH_TOKEN_SECRET_KEY=

EMAIL_USER=
EMAIL_PASS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# 📖 API Documentation

Local

```
http://localhost:3000/api-docs
```

Production

```
https://essam-clinic-api.bonto.run/api-docs
```

---

# 🔒 Authentication

Most endpoints require a JWT Access Token.

Example

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# 📊 Main Modules

- Authentication
- Users
- Doctors
- Patients
- Appointments
- Dashboard
- Expenses
- Specializations

---

# ✅ Validation

Request validation is implemented using **Joi**.

---

# 📦 API Features

- RESTful API
- Pagination
- Search
- Filtering
- Sorting
- Aggregation Pipelines
- Error Handling
- JWT Authentication
- Refresh Tokens
- Swagger Documentation

---

# 👨‍💻 Author

**Essam Alaa**

Backend Developer

GitHub:
https://github.com/essamalaa5500-hue

---

# ⭐ If you like this project

Give it a ⭐ on GitHub.
