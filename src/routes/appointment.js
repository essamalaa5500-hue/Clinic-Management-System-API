const express = require("express");
const router = express.Router();

const {
  createAppointmentValidation,
  updateAppointmentValidation,
  updateAppointmentStatusValidation,
  getAppointmentsValidation,
} = require("../../middlewares/appointment");

const validateObjectId = require("../../middlewares/validateObjectId");
const paginate = require("../../middlewares/paginate");
const { verifyToken } = require("../../middlewares/verifyToken");
const { verifyAdmin } = require("../../middlewares/verifyAdmin");

const {
  createAppointment,
  getAppointmentById,
  updateAppointment,
  updateAppointmentStatus,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  getTodaysAppointments,
  getAppointments,
  getAllAppointments,
  deleteAppointment,
} = require("../controllers/appointmentController");

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  createAppointmentValidation,
  createAppointment,
);

router.get(
  "/",
  verifyToken,
  verifyAdmin,
  getAppointmentsValidation,
  paginate,
  getAppointments,
);

router.get("/all", verifyToken, verifyAdmin, getAllAppointments);

router.get("/today", verifyToken, verifyAdmin, paginate, getTodaysAppointments);

router.get(
  "/doctor/:id",
  verifyToken,
  verifyAdmin,
  validateObjectId,
  paginate,
  getAppointmentsByDoctor,
);

router.get(
  "/patient/:id",
  verifyToken,
  verifyAdmin,
  validateObjectId,
  paginate,
  getAppointmentsByPatient,
);

router.get(
  "/:id",
  verifyToken,
  verifyAdmin,
  validateObjectId,
  getAppointmentById,
);

router.patch(
  "/:id",
  verifyToken,
  verifyAdmin,
  validateObjectId,
  updateAppointmentValidation,
  updateAppointment,
);

router.patch(
  "/:id/status",
  verifyToken,
  verifyAdmin,
  validateObjectId,
  updateAppointmentStatusValidation,
  updateAppointmentStatus,
);

router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  validateObjectId,
  deleteAppointment,
);

module.exports = router;
