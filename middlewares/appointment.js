const Appointment = require("../src/models/Appointment");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");
const doctor = require("../src/models/Doctor");
const patient = require("../src/models/Patient");
const joi = require("joi");

const createAppointmentSchema = joi.object({
  patient: joi.string().hex().length(24).required(),
  doctor: joi.string().hex().length(24).required(),
  date: joi.date().required(),
  startTime: joi
    .string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),

  endTime: joi
    .string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  notes: joi.string().allow("").optional(),
});

const updateAppointmentSchema = joi
  .object({
    date: joi.date(),
    startTime: joi
      .string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),

    endTime: joi
      .string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),
    notes: joi.string().allow(""),
  })
  .min(1);

const updateAppointmentStatusSchema = joi.object({
  status: joi
    .string()
    .valid("pending", "confirmed", "completed", "canceled")
    .required(),
});

const getAppointmentsSchema = joi.object({
  doctor: joi.string().hex().length(24),
  patient: joi.string().hex().length(24),
  status: joi.string().valid("pending", "confirmed", "completed", "canceled"),
  date: joi.date(),
  sort: joi.string(),
});

const createAppointmentValidation = asyncHandler(async (req, res, next) => {
  const { error } = createAppointmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }
  next();
});

const updateAppointmentValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateAppointmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }
  next();
});

const updateAppointmentStatusValidation = asyncHandler(
  async (req, res, next) => {
    console.log("STATUS VALIDATION");
    console.log(req.body);
    const { error } = updateAppointmentStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: "Invalid data",
        error: error.details,
      });
    }
    next();
  },
);

const getAppointmentsValidation = asyncHandler(async (req, res, next) => {
  const { error } = getAppointmentsSchema.validate(req.query);

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
  createAppointmentValidation,
  updateAppointmentValidation,
  updateAppointmentStatusValidation,
  getAppointmentsValidation,
};
