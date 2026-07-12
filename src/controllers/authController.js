const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ErrorHandler = require("../../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../config/sendOtp");
const crypto = require("crypto");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    "+resetPasswordOTP +resetPasswordOTPExpires",
  );
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const otp = generateOTP();

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  user.resetPasswordOTP = hashedOtp;
  user.resetPasswordOTPExpires = new Date(Date.now() + 1000 * 60 * 10);
  await user.save();
  const emailTemplate = `
<h2>Reset Password</h2>

<p>Hello ${user.firstName},</p>

<p>Use this OTP to reset your password:</p>

<h1 style="letter-spacing:5px">${otp}</h1>

<p>This code expires in 10 minutes.</p>

<p>If you didn't request this, ignore this email.</p>
`;
  await sendEmail({
    to: email,
    subject: "Reset Password",
    html: emailTemplate,
  });
  res.status(200).json({
    success: true,
    message: "Email sent successfully",
    data: null,
  });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { otp, email, newPassword } = req.body;
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  const user = await User.findOne({
    email,
    resetPasswordOTP: hashedOtp,
  }).select("+password +resetPasswordOTP +resetPasswordOTPExpires");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (user.resetPasswordOTPExpires < new Date()) {
    return res.status(400).json(new ErrorHandler("OTP expired", 400));
  }
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpires = undefined;
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findOne({ _id: req.user.id }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Incorrect password", 400));
  }
  user.password = await bcrypt.hash(newPassword, 10);
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Incorrect email or password", 400));
  }
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );
  user.refreshToken = refreshToken;
  await user.save();
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: true,
  });
  user.password = undefined;
  user.refreshToken = undefined;
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      user,
    },
  });
});

const logout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return next(new ErrorHandler("Refresh token not found", 400));
  }
  const user = await User.findOne({ refreshToken });
  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
    data: {
      user: userResponse,
    },
  });
});

const refreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new ErrorHandler("Refresh token not found", 400));
  }
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
  );
  const user = await User.findOne({ _id: decoded.id }).select("+refreshToken");
  if (!user || user.refreshToken !== refreshToken) {
    return next(new ErrorHandler("Refresh token not found", 400));
  }
  const newRefreshToken = jwt.sign(
    { id: user._id, role: user.role, jti: crypto.randomUUID() },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );
  user.refreshToken = newRefreshToken;
  await user.save();

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: true,
  });
  res.status(200).json({
    success: true,
    message: "Refresh token refreshed successfully",
    data: {
      accessToken,
    },
  });
});

module.exports = {
  signIn,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
};
