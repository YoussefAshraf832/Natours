const AppError = require('../utils/appErrors');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value: ${value[0]}. please use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const values = Object.entries(err.errors);

  const message = values
    .reduce((acc, cur) => {
      const str = `${cur[0]}: ${cur[1]?.message}. `;
      return str + acc;
    }, '')
    .trim();

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. please log in again!', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  });
};

const sendErrorProd = (err, res) => {
  if (err?.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else if (err?.error?.isOperational) {
    res.status(err.error.statusCode).json({
      status: err.error.status,
      message: err.error.message,
    });
  } else {
    console.error('Error💥💥', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { error: err };

    if (error.error.name === 'CastError')
      error = handleCastErrorDB(error.error);

    if (error.error?.code === 11000)
      error = handleDuplicateFieldsDB(error.error);

    if (error.error.name === 'ValidationError')
      error = handleValidationErrorDB(error.error);

    if (error.error?.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.error?.name === 'TokenExpiredError')
      error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};
