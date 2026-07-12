const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const bcrypt = require("bcryptjs");

const CreateUser = asyncHandler(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400));
  }
  const { firstName, lastName, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });
  user.password = undefined;
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "User found successfully",
    data: user,
  });
});

const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "User found successfully",
    data: user,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: "Users found successfully",
    data: users,
  });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const updates = {};
  if (req.body.firstName) {
    updates.firstName = req.body.firstName;
  }
  if (req.body.lastName) {
    updates.lastName = req.body.lastName;
  }
  if (req.body.email) {
    updates.email = req.body.email;
  }
  if (req.body.role) {
    updates.role = req.body.role;
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  }).select("-password -refreshToken");

  if (!updatedUser) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
});

const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id }).select(
    "+profileImagePublicId",
  );
  if (!user) {
    return res.status(400).json(new ErrorHandler("User not found", 400));
  }
  const { profileImage } = req.file;
  if (!profileImage) {
    return next(new ErrorHandler("Profile image not found", 400));
  }
  const { public_id } = await cloudinary.v2.uploader.upload(profileImage.path, {
    folder: "profile_images",
    public_id: user.profileImagePublicId,
    overwrite: true,
  });
  user.profileImagePublicId = public_id;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Profile image updated successfully",
    data: user,
  });
});

const getDoctorById = asyncHandler(async (req, res, next) => {
  const doctor = await User.findOne({
    _id: req.params.id,
    role: "doctor",
  }).select("+profileImagePublicId");
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Doctor found successfully",
    data: doctor,
  });
});

const getAllDoctors = asyncHandler(async (req, res, next) => {
  console.log("GET ALL DOCTORS");
  console.log(req.params);
  const doctor = await User.find({ role: "doctor" }).select(
    "+profileImagePublicId",
  );
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Doctor found successfully",
    data: doctor,
  });
});

const getReceptionistById = asyncHandler(async (req, res, next) => {
  const receptionist = await User.findOne({
    _id: req.params.id,
    role: "receptionist",
  }).select("+profileImagePublicId");
  if (!receptionist) {
    return next(new ErrorHandler("Receptionist not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Receptionist found successfully",
    data: receptionist,
  });
});

const getAllReceptionists = asyncHandler(async (req, res, next) => {
  const receptionist = await User.find({ role: "receptionist" }).select(
    "+profileImagePublicId",
  );
  if (!receptionist) {
    return next(new ErrorHandler("Receptionist not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Receptionist found successfully",
    data: receptionist,
  });
});

module.exports = {
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
};
