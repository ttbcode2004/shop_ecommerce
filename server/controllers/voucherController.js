const Voucher = require("../models/voucherModel");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createVoucher = catchAsync(async (req, res, next) => {
  const voucher = await Voucher.create(req.body);
  res.status(201).json({ success: true, data: voucher });
});

exports.getAllVouchers = catchAsync(async (req, res, next) => {
  const vouchers = await Voucher.find().sort({ createdAt: -1 });
  res.status(200).json({ 
    success: true, 
    data: { vouchers, total: vouchers.length } 
  });
});

exports.getAllVouchersByUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const now = new Date();

  let vouchers = await Voucher.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ createdAt: -1 });

  if (userId) {
    vouchers = vouchers.filter(v => {
      if (v.usageLimit > 0 && v.usedCount >= v.usageLimit) return false;
      if (v.applicableUsers.length > 0 && !v.applicableUsers.includes(userId)) return false;

      const userUsedCount = v.usedBy.filter(uid => uid.toString() === userId.toString()).length;
      if (userUsedCount >= v.perUserLimit) return false;

      return true;
    });
  }

  res.status(200).json({
    success: true,
    data: { vouchers, total: vouchers.length }
  });
});

exports.getVoucherByCode = catchAsync(async (req, res, next) => {
  const { code } = req.params;
  const voucher = await Voucher.findOne({ code: code.trim().toUpperCase() });

  if (!voucher) return next(new AppError("Voucher không tồn tại", 404));

  res.status(200).json({ success: true, data: voucher });
});

exports.updateVoucher = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const voucher = await Voucher.findByIdAndUpdate(id, req.body, { 
    new: true, 
    runValidators: true 
  });

  if (!voucher) return next(new AppError("Voucher không tồn tại", 404));

  res.status(200).json({ success: true, data: voucher });
});

exports.deleteVoucher = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const voucher = await Voucher.findByIdAndDelete(id);

  if (!voucher) return next(new AppError("Voucher không tồn tại", 404));

  res.status(200).json({ success: true, message: "Voucher đã được xóa" });
});

exports.applyVoucher = catchAsync(async (req, res, next) => {
  const { code, orderTotal } = req.body;
  userId = req.user.id;

  const voucher = await Voucher.findOne({ code: code.trim().toUpperCase(), isActive: true });
  if (!voucher) return next(new AppError("Voucher không tồn tại hoặc đã bị vô hiệu hóa", 404));

  if (voucher.isExpired) return next(new AppError("Voucher đã hết hạn", 400));

  if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit)
    return next(new AppError("Voucher đã hết lượt sử dụng", 400));

  if (voucher.usedBy.includes(userId))
    return next(new AppError("Bạn đã sử dụng voucher này rồi", 400));

  if (orderTotal < voucher.minOrderValue)
    return next(new AppError(`Đơn hàng cần tối thiểu ${voucher.minOrderValue} để áp dụng voucher`, 400));

  voucher.usedCount += 1;
  voucher.usedBy.push(userId);
  await voucher.save();

  res.status(200).json({
    success: true,
    message: "Áp dụng voucher thành công",
  });
});
