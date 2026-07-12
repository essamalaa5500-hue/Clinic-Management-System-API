const mongoose = require("mongoose");
const joi = require("joi");
const asyncHandler = require("express-async-handler");

const createPatientSchema = joi.object({
  firstName: joi.string().required().min(2).max(50),
  lastName: joi.string().required().min(2).max(50),
  phoneNumber: joi.string().required(),
  address: joi.string().required(),
  gender: joi.string().required().valid("male", "female").lowercase(),
  bloodType: joi.string().required(),
  dateOfBirth: joi.string().required(),
  notes: joi.string().allow(""),
});

const updatePatientSchema = joi.object({
  firstName: joi.string().min(2).max(50),
  lastName: joi.string().min(2).max(50),
  phoneNumber: joi.string(),
  address: joi.string(),
  gender: joi.string().valid("male", "female").lowercase(),
  bloodType: joi.string(),
  dateOfBirth: joi.string(),
  notes: joi.string(),
});

const getPatientSchema = joi.object({
  search: joi.string().trim(),
});

const createPatientValidation = (req, res, next) => {
  const { error } = createPatientSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }
  next();
};

const updatePatientValidation = (req, res, next) => {
  const { error } = updatePatientSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }
  next();
};

const getPatientValidation = asyncHandler(async (req, res, next) => {
  const { error } = getPatientSchema.validate(req.query);

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
  createPatientValidation,
  updatePatientValidation,
  getPatientValidation,
};
