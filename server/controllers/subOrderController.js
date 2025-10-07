const Product = require('../models/productModel');
const SubOrder = require('../models/subOrderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Tạo SubOrder
exports.createSubOrder = catchAsync(async (req, res, next) => {
  const { products, address, amount, totalPrice, paymentMethod, deliverId } = req.body;

  if (!products || products.length === 0) {
    return next(new AppError("Không có sản phẩm trong đơn hàng", 400));
  }

  // 1. Tạo đơn hàng trước
  const order = await SubOrder.create({
    products,
    address,
    amount,
    totalPrice,
    paymentMethod,
    deliver: deliverId,
    status: paymentMethod === "cod" ? "processing" : "order placed",
  });

  // 2. Giảm tồn kho
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    const sizeObj = product.sizes.find((s) => s.size === item.size);
    if (!sizeObj) continue;

    const colorObj = sizeObj.colors.find((c) => c.color === item.color);
    if (!colorObj) continue;

    // giảm tồn kho
    colorObj.quantity = Math.max(colorObj.quantity - item.quantity, 0);

    // cộng thêm sold
    product.sold += item.quantity;

    await product.save();
  }

  res.status(201).json({
    success: true,
    data: { order },
    message: "Đặt hàng thành công",
  });
});

// Lấy tất cả SubOrders
exports.getAllSubOrders = catchAsync(async (req, res, next) => {
  const subOrders = await SubOrder.find()
    .populate("products.product", "_id name price")
    .populate("deliver", "deliverFee description");

  res.status(200).json({
    success: true,
    results: subOrders.length,
    data: { subOrders },
  });
});

// Cập nhật trạng thái SubOrder
exports.updateSubOrderStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  let { status } = req.body;

  const subOrder = await SubOrder.findById(orderId);
  if (!subOrder) {
    return next(new AppError("Không tìm thấy đơn hàng", 404));
  }

  subOrder.status = status;
  if (status === "cancelled") {
    // rollback tồn kho
    await Promise.all(
      subOrder.products.map((item) =>
        Product.findOneAndUpdate(
          {
            _id: item.product,
            "sizes.size": item.size,
            "sizes.colors.color": item.color,
          },
          {
            $inc: {
              sold: -item.quantity, // giảm sold
              stock: item.quantity, // cộng lại tổng stock
              "sizes.$[s].colors.$[c].quantity": item.quantity, // cộng lại tồn kho theo size + color
            },
          },
          {
            new: true,
            arrayFilters: [
              { "s.size": item.size },
              { "c.color": item.color },
            ],
          }
        )
      )
    );
  }
  else if (status === "delivered") {
    subOrder.deliveredAt = new Date();
    subOrder.payment = true;
    subOrder.deliveredAt = new Date();
  }
  await subOrder.save();

  res.json({ success: true, data: { subOrder } });
});
