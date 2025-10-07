// middleware/authAdmin.js
const { auth } = require("./auth");
const AppError = require("../utils/appError");

exports.authAdmin = (req, res, next) => {
  auth(req, res, (err) => {
    if (err) return next(err);
    
    if (req.user.role !== "admin") {
      return next(new AppError("Bạn không có quyền truy cập", 403));
    }
    next();
  });
};
