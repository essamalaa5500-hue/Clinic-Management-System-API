const mongoose = require("mongoose");
const joi = require("joi");
const asyncHandler = require("express-async-handler");

const createDoctorSchema = joi.object({
  user: joi
    .string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),
  specialization: joi
    .string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),
  consultationFee: joi.number().required().min(100),
  workingDays: joi.array().items(
    joi.object({
      day: joi
        .string()
        .required()
        .valid(
          "saturday",
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
        )
        .lowercase(),
      from: joi.string().required().min(1).max(50),
      to: joi.string().required().min(1).max(50),
    }),
  ),
  appointmentDuration: joi.number().required().min(5).max(60),
  isActive: joi.boolean(),
});

const updateDoctorSchema = joi.object({
  user: joi.string().min(2).max(50),
  specialization: joi.string().min(2).max(50),
  consultationFee: joi.number().min(100),
  workingDays: joi.array().items(
    joi.object({
      day: joi
        .string()
        .valid(
          "saturday",
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
        )
        .lowercase(),
      from: joi.string().min(2).max(50),
      to: joi.string().min(2).max(50),
    }),
  ),
  appointmentDuration: joi.number().min(0).max(100),
  isActive: joi.boolean(),
});

const getDoctorsSchema = joi.object({
  search: joi.string().trim(),
});

const createDoctorValidation = (req, res, next) => {
  const { error } = createDoctorSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }
  next();
};

const updateDoctorValidation = (req, res, next) => {
  const { error } = updateDoctorSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }
  next();
};

const getDoctorsValidation = asyncHandler(async (req, res, next) => {
  const { error } = getDoctorsSchema.validate(req.query);

  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }

  next();
});

module.exports = {
  createDoctorValidation,
  updateDoctorValidation,
  getDoctorsValidation,
};
