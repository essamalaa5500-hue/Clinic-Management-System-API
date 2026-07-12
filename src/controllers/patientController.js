const Patient = require("../models/Patient");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");

const createPatient = asyncHandler(async (req, res, next) => {
  const existingPatient = await Patient.findOne({
    phoneNumber: req.body.phoneNumber,
  });
  if (existingPatient) {
    return next(new ErrorHandler("Patient already exists", 400));
  }
  const {
    firstName,
    lastName,
    phoneNumber,
    address,
    gender,
    bloodType,
    dateOfBirth,
    notes,
  } = req.body;
  const patient = await Patient.create({
    firstName,
    lastName,
    phoneNumber,
    address,
    gender,
    bloodType,
    dateOfBirth,
    createdBy: req.user.id,
    notes,
  });
  res.status(201).json({
    success: true,
    message: "Patient created successfully",
    data: patient,
  });
});

const getAllPatients = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.search) {
    filter.$or = [
      {
        firstName: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        phoneNumber: {
          $regex: req.query.search,
          $options: "i",
        },
      },
    ];
  }
  const total = await Patient.countDocuments(filter);
  const patients = await Patient.find(filter)
    .populate("createdBy", "firstName lastName")
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: "Patients found successfully",
    data: patients,
    pagination: {
      page: req.pagination.page,
      limit: req.pagination.limit,
      total,
      totalPages: Math.ceil(total / req.pagination.limit),
    },
  });
});

const getPatientById = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id).populate(
    "createdBy",
    "firstName lastName",
  );
  if (!patient) {
    return next(new ErrorHandler("Patient not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Patient found successfully",
    data: patient,
  });
});

const updatePatient = asyncHandler(async (req, res, next) => {
  const updates = {};
  if (req.body.firstName) {
    updates.firstName = req.body.firstName;
  }
  if (req.body.lastName) {
    updates.lastName = req.body.lastName;
  }
  if (req.body.phoneNumber) {
    updates.phoneNumber = req.body.phoneNumber;
  }
  if (req.body.address) {
    updates.address = req.body.address;
  }
  if (req.body.gender) {
    updates.gender = req.body.gender;
  }
  if (req.body.bloodType) {
    updates.bloodType = req.body.bloodType;
  }
  if (req.body.dateOfBirth) {
    updates.dateOfBirth = req.body.dateOfBirth;
  }
  if (req.body.notes) {
    updates.notes = req.body.notes;
  }
  const updatedPatient = await Patient.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updatedPatient) {
    return next(new ErrorHandler("Patient not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Patient updated successfully",
    data: updatedPatient,
  });
});

const getPatientByPhoneNumber = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findOne({
    phoneNumber: req.params.phoneNumber,
  }).populate("createdBy", "firstName lastName");
  if (!patient) {
    return next(new ErrorHandler("Patient not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Patient found successfully",
    data: patient,
  });
});

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  getPatientByPhoneNumber,
};
