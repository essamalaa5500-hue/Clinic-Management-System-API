const mongoose = require("mongoose");
const joi = require("joi");
const asyncHandler = require("express-async-handler");

const createSpecializationSchema = joi.object({
  name: joi.string().required().min(2).max(50),
  description: joi.string().allow(""),
});

const updateSpecializationSchema = joi.object({
  name: joi.string().min(2).max(50),
  description: joi.string(),
});

const createSpecializationValidation = (req, res, next) => {
  const { error } = createSpecializationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }
  next();
};

const updateSpecializationValidation = (req, res, next) => {
  const { error } = updateSpecializationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }
  next();
};

module.exports = {
  createSpecializationValidation,
  updateSpecializationValidation,
};
