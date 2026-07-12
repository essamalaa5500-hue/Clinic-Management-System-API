const express = require("express");
const router = express.Router();
const {
  getMe,
  getUserById,
  getAllUsers,
  updateUser,
  updateProfile,
  getDoctorById,
  getAllDoctors,
  getReceptionistById,
  getAllReceptionists,
  CreateUser,
} = require("../controllers/userControllers");
const { createUserValidation } = require("../../middlewares/auth");
const paginate = require("../../middlewares/paginate");
const { verifyAdmin } = require("../../middlewares/verifyAdmin");
const { verifyToken } = require("../../middlewares/verifyToken");
router.post(
  "/create",
  verifyToken,
  verifyAdmin,
  createUserValidation,
  CreateUser,
);
router.get("/me", verifyToken, getMe);
router.get("/", verifyToken, verifyAdmin, paginate, getAllUsers);
router.get("/alldoctors", verifyToken, verifyAdmin, getAllDoctors);
router.get("/allReceptionists", verifyToken, verifyAdmin, getAllReceptionists);
router.get("/doctor/:id", verifyToken, verifyAdmin, getDoctorById);
router.get("/:id", verifyToken, verifyAdmin, getUserById);
router.get("/receptionist/:id", verifyToken, verifyAdmin, getReceptionistById);
router.patch("/:id", verifyToken, verifyAdmin, updateUser);
router.patch("/profile/:id", verifyToken, updateProfile);

module.exports = router;
