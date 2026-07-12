const Expense = require("../models/Expense");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");

const createExpense = asyncHandler(async (req, res, next) => {
  const { title, category, amount, notes, paymentMethod } = req.body;
  const expense = await Expense.create({
    title,
    category,
    amount,
    notes,
    paymentMethod,
    createdBy: req.user._id,
  });
  await expense.save();
  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    data: expense,
  });
});

const getAllExpenses = asyncHandler(async (req, res, next) => {
  const filter = {};

  if (req.query.search) {
    filter.title = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.from || req.query.to) {
    filter.date = {};

    if (req.query.from) {
      filter.date.$gte = new Date(req.query.from);
    }

    if (req.query.to) {
      const endDate = new Date(req.query.to);
      endDate.setHours(23, 59, 59, 999);

      filter.date.$lte = endDate;
    }
  }

  const total = await Expense.countDocuments(filter);

  let sort = { createdAt: -1 };

  if (req.query.sort) {
    sort = req.query.sort.split(",").reduce((acc, field) => {
      if (field.startsWith("-")) {
        acc[field.substring(1)] = -1;
      } else {
        acc[field] = 1;
      }
      return acc;
    }, {});
  }

  const expenses = await Expense.find(filter)
    .populate("createdBy", "firstName lastName")
    .sort(sort)
    .skip(req.pagination.skip)
    .limit(req.pagination.limit);

  res.status(200).json({
    success: true,
    message: "Expenses fetched successfully",
    data: expenses,
    pagination: {
      page: req.pagination.page,
      limit: req.pagination.limit,
      total,
      totalPages: Math.ceil(total / req.pagination.limit),
    },
  });
});

const getExpenseById = asyncHandler(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id).populate(
    "createdBy",
    "firstName lastName",
  );

  if (!expense) {
    return next(new ErrorHandler("Expense not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Expense fetched successfully",
    data: expense,
  });
});

const updateExpense = asyncHandler(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return next(new ErrorHandler("Expense not found", 404));
  }

  const { title, category, amount, notes, date } = req.body;

  const updates = {};

  if (title !== undefined) updates.title = title;
  if (category !== undefined) updates.category = category;
  if (amount !== undefined) updates.amount = amount;
  if (notes !== undefined) updates.notes = notes;
  if (date !== undefined) updates.date = date;

  const updatedExpense = await Expense.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    },
  ).populate("createdBy", "firstName lastName");

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    data: updatedExpense,
  });
});

const deleteExpense = asyncHandler(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return next(new ErrorHandler("Expense not found", 404));
  }

  await expense.deleteOne();

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
  });
});

const getExpenseStatistics = asyncHandler(async (req, res) => {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31);
  endOfYear.setHours(23, 59, 59, 999);

  const [todayResult, monthResult, yearResult, totalResult] = await Promise.all(
    [
      Expense.aggregate([
        {
          $match: {
            date: {
              $gte: startOfToday,
              $lte: endOfToday,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      Expense.aggregate([
        {
          $match: {
            date: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      Expense.aggregate([
        {
          $match: {
            date: {
              $gte: startOfYear,
              $lte: endOfYear,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      Expense.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ],
  );

  res.status(200).json({
    success: true,
    data: {
      todayExpenses: todayResult[0]?.total || 0,
      monthExpenses: monthResult[0]?.total || 0,
      yearExpenses: yearResult[0]?.total || 0,
      totalExpenses: totalResult[0]?.total || 0,
    },
  });
});

const getExpensesPerMonth = asyncHandler(async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear();

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year + 1}-01-01`);

  const expenses = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          month: {
            $month: "$date",
          },
        },
        expenses: {
          $sum: "$amount",
        },
      },
    },
    {
      $sort: {
        "_id.month": 1,
      },
    },
  ]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = months.map((month, index) => {
    const expense = expenses.find((e) => e._id.month === index + 1);

    return {
      month,
      expenses: expense ? expense.expenses : 0,
    };
  });

  res.status(200).json({
    success: true,
    data,
  });
});

const getExpensesByCategory = asyncHandler(async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear();

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year + 1}-01-01`);

  const expenses = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: "$category",
        amount: {
          $sum: "$amount",
        },
      },
    },
    {
      $sort: {
        amount: -1,
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        amount: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: expenses,
  });
});

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStatistics,
  getExpensesPerMonth,
  getExpensesByCategory,
};
