const joi = require("joi");
const asyncHandler = require("express-async-handler");

const categories = [
  "salary",
  "rent",
  "electricity",
  "water",
  "internet",
  "medical_supplies",
  "maintenance",
  "marketing",
  "other",
];

const createExpenseSchema = joi.object({
  title: joi.string().trim().required().min(3).max(100),

  category: joi
    .string()
    .required()
    .valid(...categories),

  amount: joi.number().required().positive(),

  date: joi.date(),

  notes: joi.string().trim().allow("", null).max(500),
});

const updateExpenseSchema = joi.object({
  title: joi.string().trim().min(3).max(100),

  category: joi.string().valid(...categories),

  amount: joi.number().positive(),

  date: joi.date(),

  notes: joi.string().trim().allow("", null).max(500),
});

const getExpensesSchema = joi.object({
  search: joi.string().trim(),

  category: joi.string().valid(...categories),

  from: joi.date(),

  to: joi.date(),

  sort: joi
    .string()
    .valid(
      "title",
      "-title",
      "amount",
      "-amount",
      "date",
      "-date",
      "createdAt",
      "-createdAt",
    ),
});

const createExpenseValidation = (req, res, next) => {
  const { error } = createExpenseSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }

  next();
};

const updateExpenseValidation = (req, res, next) => {
  const { error } = updateExpenseSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid data",
      error: error.details,
    });
  }

  next();
};

const getExpensesValidation = asyncHandler(async (req, res, next) => {
  const { error } = getExpensesSchema.validate(req.query);

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
  createExpenseValidation,
  updateExpenseValidation,
  getExpensesValidation,
};
