const Joi = require("joi");
const ErrorHandler = require("../utils/ErrorHandler");
const schema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const validateObjectId = (req, res, next) => {
  const { error } = schema.validate(req.params);

  if (error) {
    return next(new ErrorHandler("Invalid ID", 400));
  }

  next();
};

module.exports = validateObjectId;
