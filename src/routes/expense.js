const express = require("express");
const router = express.Router();

const {
  createExpenseValidation,
  updateExpenseValidation,
  getExpensesValidation,
} = require("../../middlewares/expenseValidation");

const validateObjectId = require("../../middlewares/validateObjectId");
const paginate = require("../../middlewares/paginate");
const { verifyToken } = require("../../middlewares/verifyToken");
const { verifyAdmin } = require("../../middlewares/verifyAdmin");

const {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStatistics,
  getExpensesPerMonth,
  getExpensesByCategory,
} = require("../controllers/expensesController");

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  createExpenseValidation,
  createExpense,
);

router.get("/statistics", verifyToken, verifyAdmin, getExpenseStatistics);

router.get("/per-month", verifyToken, verifyAdmin, getExpensesPerMonth);

router.get("/categories", verifyToken, verifyAdmin, getExpensesByCategory);

router.get(
  "/",
  verifyToken,
  verifyAdmin,
  getExpensesValidation,
  paginate,
  getAllExpenses,
);

router.get("/:id", verifyToken, verifyAdmin, validateObjectId, getExpenseById);

router.patch(
  "/:id",
  verifyToken,
  verifyAdmin,
  validateObjectId,
  updateExpenseValidation,
  updateExpense,
);

router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  validateObjectId,
  deleteExpense,
);

module.exports = router;
