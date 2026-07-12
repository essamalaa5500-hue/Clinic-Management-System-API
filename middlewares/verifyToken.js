const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const asyncHandler = require("express-async-handler");
const User = require("../src/models/User");

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new ErrorHandler("Authorization header not found", 401));
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new ErrorHandler("Token not found", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return next(new ErrorHandler("User not found", 401));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }
});

module.exports = {
  verifyToken,
};
