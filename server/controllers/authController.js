const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createSendToken = (user, res) => {
  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 ngày
  });

  return token;
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, phone, email, password } = req.body;

  const checkUser = await User.findOne({ email });
  if (checkUser) return next(new AppError("Email đã tồn tại", 400));

  if (password.length < 8)
    return next(new AppError("Mật khẩu ít nhất 8 ký tự", 400));

  const newUser = new User({ name, phone, email, password });
  await newUser.save();

  res.status(201).json({
    success: true,
    message: "Đăng ký thành công",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new AppError("Tài khoản không tồn tại", 404));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError("Mật khẩu không chính xác", 401));

  if(user.isActive === false) return next(new AppError("Tài khoản đã bị khóa", 401));
  
  const token = createSendToken(user, res);

  res.status(200).json({
    success: true,
    message: "Đăng nhập thành công",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
    },
  });
});

exports.logout = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Đăng xuất thành công",
  });
};

exports.updateUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    const isPasswordCorrect = await user.correctPassword(
      req.body.passwordCurrent,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "Mật khẩu hiện tại không đúng",
      });
    }

    // Gán mật khẩu mới
    user.password = req.body.password; // sẽ hash lại nhờ pre('save') trong User model
    await user.save();

    // Tạo lại token mới để user dùng ngay
    const token = createSendToken(user, res);

    res.status(200).json({
      success: true,
      message: "Cập nhật mật khẩu thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Kiểm tra thông tin đầu vào
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ email và mật khẩu mới",
      });
    }

    // 2️⃣ Tìm user theo email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email không tồn tại trong hệ thống",
      });
    }

    // 3️⃣ Gán mật khẩu mới (hàm pre('save') trong model sẽ tự hash lại)
    user.password = password;
    await user.save();

    // 4️⃣ Tạo lại token đăng nhập mới
    const token = createSendToken(user, res);

    // 5️⃣ Trả về kết quả
    res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error("Lỗi reset password:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi đặt lại mật khẩu",
      error: error.message,
    });
  }
};