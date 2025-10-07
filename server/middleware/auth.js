// middleware/auth.js
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.auth = catchAsync(async (req, res, next) => {
  const token = req.cookies?.token;
  
  if (!token) {
    return next(new AppError("Bạn chưa đăng nhập hoặc token không tồn tại", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Token đã hết hạn, vui lòng đăng nhập lại"
        : "Token không hợp lệ";
    return next(new AppError(message, 401));
  }
});
