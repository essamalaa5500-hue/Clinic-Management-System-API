const Specialization = require("../models/Specialization");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const Doctor = require("../models/Doctor");

const createSpecialization = asyncHandler(async (req, res, next) => {
  const existingSpecialization = await Specialization.findOne({
    name: req.body.name,
  });
  if (existingSpecialization) {
    return next(new ErrorHandler("Specialization already exists", 400));
  }

  const specialization = await Specialization.create(req.body);
  res.status(201).json({
    success: true,
    message: "Specialization created successfully",
    data: specialization,
  });
});

const getAllSpecializations = asyncHandler(async (req, res) => {
  const total = await Specialization.countDocuments();
  const specializations = await Specialization.find()
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: "Specializations found successfully",
    data: specializations,
    pagination: {
      page: req.pagination.page,
      limit: req.pagination.limit,
      total,
      totalPages: Math.ceil(total / req.pagination.limit),
    },
  });
});

const getSpecializationById = asyncHandler(async (req, res, next) => {
  const specialization = await Specialization.findById(req.params.id);
  if (!specialization) {
    return next(new ErrorHandler("Specialization not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Specialization found successfully",
    data: specialization,
  });
});

const updateSpecialization = asyncHandler(async (req, res, next) => {
  const updates = {};
  if (req.body.name) {
    updates.name = req.body.name;
  }
  if (req.body.description) {
    updates.description = req.body.description;
  }
  if (updates.name) {
    const exists = await Specialization.findOne({
      name: updates.name,
      _id: { $ne: req.params.id },
    });
    if (exists) {
      return next(new ErrorHandler("Specialization already exists", 400));
    }
  }
  const updatedSpecialization = await Specialization.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updatedSpecialization) {
    return next(new ErrorHandler("Specialization not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Specialization updated successfully",
    data: updatedSpecialization,
  });
});

const getDoctorsBySpecialization = asyncHandler(async (req, res, next) => {
  const doctors = await Doctor.find({ specialization: req.params.id }).populate(
    "specialization",
  );
  if (!doctors || doctors.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Doctor found successfully",
    data: doctors,
  });
});

const deleteSpecialization = asyncHandler(async (req, res, next) => {
  const specialization = await Specialization.findById(req.params.id);
  if (!specialization) {
    return next(new ErrorHandler("Specialization not found", 404));
  }
  const doctors = await Doctor.countDocuments({
    specialization: req.params.id,
  });
  if (doctors > 0) {
    return next(
      new ErrorHandler(
        "Cannot delete specialization because doctors are assigned to it",
        400,
      ),
    );
  }
  await specialization.deleteOne();
  res.status(200).json({
    success: true,
    message: "Specialization deleted successfully",
    data: null,
  });
});

module.exports = {
  createSpecialization,
  getAllSpecializations,
  getSpecializationById,
  updateSpecialization,
  getDoctorsBySpecialization,
  deleteSpecialization,
};
