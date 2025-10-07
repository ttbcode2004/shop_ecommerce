const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.addAddress = catchAsync(async (req, res, next) => {
  const { fullName, phone, street, commune, city, notes = "", defaultAddress = false } = req.body;

  if (!fullName || !phone || !street || !commune || !city) {
    return next(new AppError("Thiếu thông tin bắt buộc", 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("Vui lòng đăng nhập", 401));

  if (defaultAddress) {
    user.addresses.forEach(addr => (addr.defaultAddress = false));
  }

  user.addresses.push({
    fullName,
    phone,
    street,
    commune,
    city,
    notes,
    defaultAddress,
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: "Thêm địa chỉ thành công",
    data: { addresses: user.addresses },
  });
});

exports.getAllAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("Không tìm thấy user", 404));

  res.status(200).json({
    success: true,
    data: { addresses: user.addresses },
  });
});

exports.editAddress = catchAsync(async (req, res, next) => {
  const { index } = req.params;
  const { fullName, phone, street, commune, city, notes = "", defaultAddress = false } = req.body;

  if ( index === undefined) {
    return next(new AppError("địa chỉ không tồn tại", 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("Vui lòng đăng nhập", 401));

  if (!user.addresses[index]) {
    return next(new AppError("Địa chỉ không tồn tại", 404));
  }

  if (defaultAddress) {
    user.addresses.forEach(addr => (addr.defaultAddress = false));
  }

  user.addresses[index] = {
    ...user.addresses[index]._doc, // giữ id nếu là subdocument
    fullName,
    phone,
    street,
    commune,
    city,
    notes,
    defaultAddress,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Cập nhật địa chỉ thành công",
    data: { addresses: user.addresses },
  });
});

exports.updateDefault = catchAsync(async (req, res, next) => {
  const { index } = req.params;

  if (index === undefined) {
    return next(new AppError("địa chỉ không tồn tại", 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("Vui lòng đăng nhập", 401));

  if (!user.addresses[index]) {
    return next(new AppError("Địa chỉ không tồn tại", 404));
  }

  user.addresses.forEach(addr => (addr.defaultAddress = false));
  user.addresses[index].defaultAddress = true;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Đặt địa chỉ mặc định thành công",
    data: { addresses: user.addresses },
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  const { index } = req.params;

  if (index === undefined) {
    return next(new AppError("Không tìm thấy địa chỉ", 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("Không tìm thấy user", 404));

  if (!user.addresses[index]) {
    return next(new AppError("Địa chỉ không tồn tại", 404));
  }

  user.addresses.splice(index, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Xóa địa chỉ thành công",
    data: { addresses: user.addresses },
  });
});
