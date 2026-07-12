const ErrorHandler = require("../utils/ErrorHandler");
const asyncHandler = require("express-async-handler");

const paginate = asyncHandler(async (req, res, next) => {
  const page = req.query.page !== undefined ? Number(req.query.page) : 1;
  const limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;

  if (
    !Number.isInteger(page) ||
    !Number.isInteger(limit) ||
    page < 1 ||
    limit < 1 ||
    limit > 100
  ) {
    return next(new ErrorHandler("Invalid page or limit", 400));
  }

  req.pagination = {
    page,
    limit,
    skip: (page - 1) * limit,
  };

  next();
});

module.exports = paginate;
