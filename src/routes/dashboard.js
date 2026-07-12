const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middlewares/verifyToken");
const { verifyAdmin } = require("../../middlewares/verifyAdmin");
const {
  getDashboard,
  getAppointmentsPerMonth,
  getTopDoctors,
  getTopPatients,
  getDoctorPerformance,
} = require("../controllers/dashboardController");

router.get("/", verifyToken, verifyAdmin, getDashboard);
router.get(
  "/appointments-per-month",
  verifyToken,
  verifyAdmin,
  getAppointmentsPerMonth,
);
router.get("/top-doctors", verifyToken, verifyAdmin, getTopDoctors);

router.get("/top-patients", verifyToken, verifyAdmin, getTopPatients);

router.get(
  "/doctor-performance",
  verifyToken,
  verifyAdmin,
  getDoctorPerformance,
);

module.exports = router;
