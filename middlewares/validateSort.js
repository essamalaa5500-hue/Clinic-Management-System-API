const ErrorHandler = require("../utils/ErrorHandler");

const allowedSortFields = [
  "date",
  "startTime",
  "queueNumber",
  "status",
  "createdAt",
];

const validateSort = (req, res, next) => {
  if (!req.query.sort) return next();

  const fields = req.query.sort.split(",");

  for (const field of fields) {
    const fieldName = field.startsWith("-") ? field.substring(1) : field;

    if (!allowedSortFields.includes(fieldName)) {
      return next(new ErrorHandler("Invalid sort field", 400));
    }
  }

  next();
};

module.exports = validateSort;
