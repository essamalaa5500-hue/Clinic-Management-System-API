const joi = require("joi");
const User = require("../src/models/User");

const createUserSchema = joi.object({
  firstName: joi.string().required().min(2).max(50),
  lastName: joi.string().required().min(2).max(50),
  email: joi.string().required().email().lowercase().trim(),
  password: joi.string().required().min(8).max(128),
  role: joi.string().required().valid("admin", "doctor", "receptionist"),
});
const signInSchema = joi.object({
  email: joi.string().required().email().lowercase().trim(),
  password: joi.string().required().min(8).max(128),
});
const forgotPasswordSchema = joi.object({
  email: joi.string().required().email(),
});
const resetPasswordSchema = joi.object({
  email: joi.string().required().email(),
  otp: joi.string().required().length(6),
  newPassword: joi.string().required().min(8).max(50),
});
const changePasswordSchema = joi.object({
  oldPassword: joi.string().required(),
  newPassword: joi.string().required().min(8).max(50),
});

const createUserValidation = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }
  next();
};
const signInValidation = (req, res, next) => {
  const { error } = signInSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }
  next();
};
const forgotPasswordValidation = (req, res, next) => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }
  next();
};
const resetPasswordValidation = (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }
  next();
};
const changePasswordValidation = (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body);
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
  createUserValidation,
  signInValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
};
