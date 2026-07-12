const express = require("express");
const router = express.Router();
const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
} = require("../controllers/doctorController");
const {
  createDoctorValidation,
  updateDoctorValidation,
} = require("../../middlewares/doctor");
const { verifyToken } = require("../../middlewares/verifyToken");
const { verifyAdmin } = require("../../middlewares/verifyAdmin");
const paginate = require("../../middlewares/paginate");

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  createDoctorValidation,
  createDoctor,
);
router.get("/", verifyToken, paginate, getAllDoctors);
router.get("/:id", verifyToken, getDoctorById);
router.patch(
  "/:id",
  verifyToken,
  verifyAdmin,
  updateDoctorValidation,
  updateDoctor,
);

module.exports = router;
