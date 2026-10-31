const User = require("../src/models/User");
const ErrorHandler = require("../utils/ErrorHandler");
const asyncHandler = require("express-async-handler");

const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(
      new ErrorHandler("You are not authorized to access this route", 403),
    );
  }
  next();
});

module.exports = {
  verifyAdmin,
};
