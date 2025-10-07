const AppError = require('../utils/appError');

// Xử lý error chi tiết cho môi trường development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Xử lý error đơn giản cho môi trường production
const sendErrorProd = (err, res) => {
  // Nếu là lỗi operational (AppError do mình tạo)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    // Lỗi không lường trước (bug, code sai, etc.)
    console.error('ERROR 💥', err);
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Có lỗi xảy ra, vui lòng thử lại sau!',
    });
  }
};

// Middleware chính
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    // Clone để tránh mutate err gốc
    let error = { ...err, message: err.message };

    // 👉 Có thể custom xử lý thêm các lỗi MongoDB, JWT ở đây
    if (error.name === 'JsonWebTokenError')
      error = new AppError('Token không hợp lệ, vui lòng đăng nhập lại', 401);

    if (error.name === 'TokenExpiredError')
      error = new AppError('Token đã hết hạn, vui lòng đăng nhập lại', 401);

    if (error.code === 11000)
      error = new AppError('Dữ liệu bị trùng lặp', 400);

    sendErrorProd(error, res);
  }
};
