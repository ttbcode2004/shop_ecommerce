const User = require('../models/userModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Không tìm thấy sản phẩm', 404));

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('Vui lòng đăng nhập', 401));

  const idx = user.wishlist.findIndex((item) => item.productId === productId);
  
  if (idx > -1) {
    return res.status(200).json({
      success: true,
      message: 'Sản phẩm đã có trong danh sách yêu thích',
    });
  }

  user.wishlist = [
    {
      productId,
      image: product.images[0],
      name: product.name,
      slug: product.slug,
      finalPrice: product.finalPrice,
      discountPercent: product.discountPercent,
    },
    ...user.wishlist,
  ];

  await user.save();

  res.json({
    success: true,
    message: 'Đã thêm vào yêu thích',
    data: { wishlist: user.wishlist },
  });
});

exports.getWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('Không tìm thấy người dùng', 404));

  res.json({ success: true, data: { wishlist: user.wishlist } });
});

exports.deleteWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('Không tìm thấy người dùng', 404));

  const idx = user.wishlist.findIndex((item) => item.productId === productId);
  if (idx === -1) {
    return next(new AppError('Không tìm thấy sản phẩm trong yêu thích', 404));
  }

  user.wishlist.splice(idx, 1);
  await user.save();

  res.json({
    success: true,
    message: 'Đã xóa yêu thích',
    data: { wishlist: user.wishlist },
  });
});

exports.clearWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('Không tìm thấy người dùng', 404));

  user.wishlist = [];
  await user.save();

  res.json({
    success: true,
    message: 'Đã xóa toàn bộ',
    data: { wishlist: user.wishlist },
  });
});
