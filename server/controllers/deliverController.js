const Deliver = require("../models/deliverModel")
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createDeliver = catchAsync(async (req, res, next) => {
  const deliver = await Deliver.create(req.body);
  res.status(201).json({ success: true, data: deliver });
});

exports.getAllDelivers = catchAsync(async (req, res, next) => {
  const delivers = await Deliver.find().sort( 'deliverFee' );
  res.status(200).json({ 
    success: true, 
    data: { delivers, total: delivers.length } 
  });
});

exports.updateDeliver = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deliver = await Deliver.findByIdAndUpdate(id, req.body, { 
    new: true, 
    runValidators: true 
  });

  if (!deliver) return next(new AppError("Phí vận chuyển không tồn tại", 404));

  res.status(200).json({ success: true, data: deliver, message: "Cập nhật phí vận chuyển thành công" });
});

exports.deleteDeliver = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deliver = await Deliver.findByIdAndDelete(id);

  if (!deliver) return next(new AppError("Phí vận chuyển không tồn tại", 404));

  res.status(200).json({ success: true, message: "Phí vận chuyển đã được xóa" });
});