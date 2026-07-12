const express = require("express");
const router = express.Router();
const {
  createSpecialization,
  getAllSpecializations,
  getSpecializationById,
  updateSpecialization,
  getDoctorsBySpecialization,
  deleteSpecialization,
} = require("../controllers/specializationController");
const {
  createSpecializationValidation,
  updateSpecializationValidation,
} = require("../../middlewares/specialization");
const { verifyToken } = require("../../middlewares/verifyToken");
const { verifyAdmin } = require("../../middlewares/verifyAdmin");
const paginate = require("../../middlewares/paginate");

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  createSpecializationValidation,
  createSpecialization,
);

router.get("/", verifyToken, paginate, getAllSpecializations);

router.get("/:id", verifyToken, getSpecializationById);

router.patch(
  "/:id",
  verifyToken,
  verifyAdmin,
  updateSpecializationValidation,
  updateSpecialization,
);
router.get("/:id/doctors", verifyToken, getDoctorsBySpecialization);

router.delete("/:id", verifyToken, verifyAdmin, deleteSpecialization);

module.exports = router;
