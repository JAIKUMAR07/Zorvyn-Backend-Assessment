import AppError from "../utils/AppError.js";

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// for duplicate fields
const handleDuplicateFieldsDB = (err) => {
  let value = "";
  if (err.keyValue) {
    value = JSON.stringify(err.keyValue);
  } else if (err.message) {
    const match = err.message.match(/(["'])(\\?.)*?\1/);
    value = match ? match[0] : "";
  }
  const message = value
    ? `Duplicate field value: ${value}. Please use another value!`
    : "Duplicate field value. Please use another value!";
  return new AppError(message, 400);
};

//  validation errors for schema
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(
    (el) =>
      `${el.name === "ValidatorError" ? el.path + ": " : ""}${el.message}`,
  );
  const message = `Record validation failed: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// for jwt token error
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

// for jwt token expired error
const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

// for development mode
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//  production mode
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

//  error handling middleware
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
    return;
  }

  let error = { ...err };
  error.message = err.message;

  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

  sendErrorProd(error, res);
};
