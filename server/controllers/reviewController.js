const Review = require('../models/reviewModel');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createReview = catchAsync(async (req, res, next) => {
  const { productId, review, rating, nameUser, photoUser = "", userId } = req.body;

  const hadDelivered = await Order.findOne({
    user: userId,
    status: "delivered",
    "products.product": productId,
  });

  if (!hadDelivered) {
    return next(new AppError("Bạn chỉ có thể review sau khi nhận hàng", 403));
  }

  try {
    const newReview = await Review.create({
      review,
      rating,
      nameUser,
      photoUser,
      product: productId,
      user: userId,
    });

    res.status(201).json({ success: true, data: { review: newReview } });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError("Bạn đã review sản phẩm này rồi", 400));
    }
    throw err;
  }
});

exports.getProductReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.id })
    .populate("user", "name email") // populate thông tin user thay vì 'review'
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    results: reviews.length,
    data: { reviews },
  });
});
