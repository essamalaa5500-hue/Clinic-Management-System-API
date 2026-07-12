const express = require("express");
const router = express.Router();
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  getPatientByPhoneNumber,
} = require("../controllers/patientController");
const {
  createPatientValidation,
  updatePatientValidation,
} = require("../../middlewares/patient");
const { verifyToken } = require("../../middlewares/verifyToken");
const { verifyAdmin } = require("../../middlewares/verifyAdmin");

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  createPatientValidation,
  createPatient,
);

const paginate = require("../../middlewares/paginate");

router.get("/", verifyToken, verifyAdmin, paginate, getAllPatients);
router.get(
  "/phone/:phoneNumber",
  verifyToken,
  verifyAdmin,
  paginate,
  getPatientByPhoneNumber,
);
router.get("/:id", verifyToken, verifyAdmin, paginate, getPatientById);
router.patch(
  "/:id",
  verifyToken,
  verifyAdmin,
  updatePatientValidation,
  updatePatient,
);

module.exports = router;
