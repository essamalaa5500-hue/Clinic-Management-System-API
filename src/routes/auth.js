const express = require("express");
const router = express.Router();

const {
  signIn,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");
const { verifyToken } = require("../../middlewares/verifyToken");
const {
  signInValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
} = require("../../middlewares/auth");
router.post("/forgotPassword", forgotPasswordValidation, forgotPassword);
router.post("/resetPassword", resetPasswordValidation, resetPassword);
router.patch(
  "/changePassword",
  verifyToken,
  changePasswordValidation,
  changePassword,
);
router.post("/signin", signInValidation, signIn);
router.post("/logout", verifyToken, logout);
router.post("/refreshToken", refreshToken);

module.exports = router;
