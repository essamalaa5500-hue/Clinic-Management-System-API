const Doctor = require("../models/Doctor");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const Specialization = require("../models/Specialization");
const User = require("../models/User");

const createDoctor = asyncHandler(async (req, res, next) => {
  const existingDoctor = await Doctor.findOne({
    user: req.body.user,
  });
  if (existingDoctor) {
    return next(new ErrorHandler("Doctor already exists", 400));
  }
  const user = await User.findById(req.body.user);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (user.role !== "doctor") {
    return next(new ErrorHandler("User is not a doctor", 400));
  }
  const specialization = await Specialization.findById(req.body.specialization);
  if (!specialization) {
    return next(new ErrorHandler("Specialization not found", 404));
  }
  const doctor = await Doctor.create(req.body);
  res.status(201).json({
    success: true,
    message: "Doctor created successfully",
    data: doctor,
  });
});

const getAllDoctors = asyncHandler(async (req, res, next) => {
  const filter = {};

  if (req.query.search) {
    const users = await User.find({
      $or: [
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
      ],
    }).select("_id");

    const specializations = await Specialization.find({
      name: {
        $regex: req.query.search,
        $options: "i",
      },
    }).select("_id");

    const userIds = users.map((user) => user._id);
    const specializationIds = specializations.map(
      (specialization) => specialization._id,
    );

    filter.$or = [
      {
        user: {
          $in: userIds,
        },
      },
      {
        specialization: {
          $in: specializationIds,
        },
      },
    ];
  }

  const total = await Doctor.countDocuments(filter);

  const doctors = await Doctor.find(filter)
    .populate("user", "firstName lastName email")
    .populate("specialization", "name")
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .sort({ createdAt: -1 });

  if (!doctors.length) {
    return next(new ErrorHandler("No doctors found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Doctors fetched successfully",
    data: doctors,
    pagination: {
      page: req.pagination.page,
      limit: req.pagination.limit,
      total,
      totalPages: Math.ceil(total / req.pagination.limit),
    },
  });
});

const getDoctorById = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id)
    .populate("user", "firstName lastName")
    .populate("specialization", "name");
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Doctor found successfully",
    data: doctor,
  });
});

const updateDoctor = asyncHandler(async (req, res, next) => {
  const updates = {};

  if (req.body.user) {
    const user = await User.findById(req.body.user);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.role !== "doctor") {
      return next(new ErrorHandler("User is not a doctor", 400));
    }

    const existingDoctor = await Doctor.findOne({
      user: req.body.user,
      _id: { $ne: req.params.id },
    });

    if (existingDoctor) {
      return next(new ErrorHandler("Doctor already exists", 400));
    }

    updates.user = req.body.user;
  }

  if (req.body.specialization) {
    const specialization = await Specialization.findById(
      req.body.specialization,
    );

    if (!specialization) {
      return next(new ErrorHandler("Specialization not found", 404));
    }

    updates.specialization = req.body.specialization;
  }

  if (req.body.consultationFee !== undefined) {
    updates.consultationFee = req.body.consultationFee;
  }

  if (req.body.workingDays) {
    updates.workingDays = req.body.workingDays;
  }

  if (req.body.appointmentDuration !== undefined) {
    updates.appointmentDuration = req.body.appointmentDuration;
  }

  if (req.body.isActive !== undefined) {
    updates.isActive = req.body.isActive;
  }

  const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  })
    .populate("user", "firstName lastName email")
    .populate("specialization", "name");

  if (!updatedDoctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Doctor updated successfully",
    data: updatedDoctor,
  });
});
module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
};
