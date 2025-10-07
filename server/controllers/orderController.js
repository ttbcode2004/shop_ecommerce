const mongoose = require('mongoose');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const { createMoMoPayment } = require('../services/momo');
const { createVNPayPayment } = require('../services/vnpay');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { products, address, amount, totalPrice, paymentMethod, selectedCart, deliverId } = req.body;

  const userOrder = await User.findById(req.user.id);
  if (!userOrder || !products || products.length === 0) {
    return next(new AppError("Không có sản phẩm", 400));
  }

  const order = await Order.create({
    user: req.user.id,
    products,
    address,
    amount,
    totalPrice,
    paymentMethod,
    deliver: deliverId,
    status: paymentMethod === "cod" ? "processing" : "order placed",
  });

  if (selectedCart && selectedCart.length > 0) {
    userOrder.cart = userOrder.cart.filter(
      (item) => !selectedCart.includes(item._id.toString())
    );
    await userOrder.save();
  }

  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    const sizeObj = product.sizes.find((s) => s.size === item.size);
    if (!sizeObj) continue;

    const colorObj = sizeObj.colors.find((c) => c.color === item.color);
    if (!colorObj) continue;

    colorObj.quantity = Math.max(colorObj.quantity - item.quantity, 0);
    product.sold += item.quantity;

    await product.save();
  }

  let payUrl = null;
  if (paymentMethod === "momo") {
    payUrl = await createMoMoPayment(order);
  } else if (paymentMethod === "vnpay") {
    payUrl = await createVNPayPayment(order, req);
  }

  res.status(201).json({
    success: true,
    data: { order, payUrl },
    message: "Đặt hàng thành công",
  });
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.json({ status: "success", results: orders.length, data: { orders } });
});

exports.clearUserOrders = catchAsync(async (req, res, next) => {
  const result = await Order.deleteMany({ user: req.user.id  });

  res.status(200).json({
    status: "success",
    deletedCount: result.deletedCount,
    message: `Đã xóa ${result.deletedCount} đơn hàng của user ${req.user.id }`,
  });
});

exports.updateOrderStateUser = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { state } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Không tìm thấy đơn hàng", 404));

  // Nếu đơn đã hủy thì không xử lý lại
  if (order.status === "cancelled") {
    return next(new AppError("Đơn hàng đã bị hủy trước đó", 400));
  }

  // Nếu đơn đã giao thành công thì không được hủy nữa
  if (order.status === "delivered" && state === "cancelled") {
    return next(new AppError("Đơn hàng đã giao, không thể hủy", 400));
  }

  // Hủy đơn
  if (state === "cancelled") {
    order.status = "cancelled";

    // rollback tồn kho
    await Promise.all(
      order.products.map((item) =>
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
  // Xác nhận đã nhận hàng
  else if (state === "received") {
    order.isReceive = true;
    order.status = "delivered"; // khi user xác nhận nhận hàng -> delivered
    order.deliveredAt = new Date();
  }

  await order.save();

  res.json({
    success: true,
    data: { order },
    message:
      state === "cancelled"
        ? "Hủy đơn thành công"
        : state === "return"
        ? "Trả hàng thành công"
        : "Cảm ơn quý khách đã nhận hàng",
  });
});

exports.updateOrderReturnState = catchAsync(async (req, res, next) => {
  const { orderId, itemId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Không tìm thấy đơn hàng", 404));

  // Check còn trong 7 ngày kể từ ngày giao hàng
  if (!order.deliveredAt) return next(new AppError("Đơn hàng chưa được giao", 400));
  const now = new Date();
  const diffDays = (now - order.deliveredAt) / (1000 * 60 * 60 * 24);
  if (diffDays > 7) {
    return next(new AppError("Đã quá hạn 7 ngày, không thể trả hàng", 400));
  }

  // Tìm item trong products
  const item = order.products.id(itemId);
  if (!item) return next(new AppError("Không tìm thấy sản phẩm trong đơn hàng", 404));

  if (item.isReturn) return next(new AppError("Sản phẩm này đã được trả trước đó", 400));

  // Cập nhật lại stock trong Product
  await Product.findOneAndUpdate(
    {
      _id: item.product,
      "sizes.size": item.size,
      "sizes.colors.color": item.color,
    },
    {
      $inc: {
        sold: -item.quantity, // giảm sold
        stock: item.quantity, // cộng lại stock tổng
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
  );

  // Đánh dấu sản phẩm đã return
  item.isReturn = true;
  await order.save();

  res.status(200).json({
    status: "success",
    message: "Trả hàng thành công",
    data: {order},
  });
});


exports.updateOrderReviewProduct = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { idxProduct } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Không tìm thấy đơn hàng", 404));

  if (idxProduct < 0 || idxProduct >= order.products.length) {
    return next(new AppError("Sản phẩm không hợp lệ", 400));
  }

  order.products[idxProduct].isReview = true;
  order.markModified("products");
  await order.save();

  res.json({ success: true, data: { order }, message:"Đánh giá thành công" });
});

exports.updatePaymentOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return next(new AppError("Không tìm thấy đơn hàng", 404));

  order.payment = true;
  order.paidAt = new Date();
  await order.save();

  res.json({ success: true, data: { order } });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate("user", "_id name phone email")
    .populate("products.product", "_id name price")
    .populate("deliver", "deliverFee description");

  res.status(200).json({
    success: true,
    results: orders.length,
    data: { orders },
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  let { status } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Không tìm thấy đơn hàng", 404));

  order.status = status;
  if (status === "delivered") {
    order.deliveredAt = new Date();
    order.paidAt = new Date();
    order.payment = true;
  }
  await order.save();

  res.json({ success: true, data: { order } });
});

exports.clearOrders = catchAsync(async (req, res, next) => {
  const result = await Order.deleteMany({});
  res.status(200).json({
    status: "success",
    deletedCount: result.deletedCount,
  });
});