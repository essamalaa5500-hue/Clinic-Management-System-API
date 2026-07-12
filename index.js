const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
require("dotenv").config();
require("./config/db");
const PORT = process.env.PORT || 6000;
const usersRouter = require("./src/routes/users");
const authRouter = require("./src/routes/auth");
const patientRouter = require("./src/routes/patient");
const specializationRouter = require("./src/routes/specialization");
const doctorRouter = require("./src/routes/doctor");
const appointmentRouter = require("./src/routes/appointment");
const dashboardRouter = require("./src/routes/dashboard");
const expenseRouter = require("./src/routes/expense");
const swaggerDocs = require("./docs/swagger");

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
swaggerDocs(app);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Clinic Management System API is running 🚀",
    version: "1.0.0",
  });
});
const cors = require("cors");

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

//routes
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/patient", patientRouter);
app.use("/specialization", specializationRouter);
app.use("/doctor", doctorRouter);
app.use("/appointment", appointmentRouter);
app.use("/dashboard", dashboardRouter);
app.use("/expense", expenseRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    status: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    error: err.errors || null,
  });
});
// Start Server
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
