const User = require('../models/userModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, size, color, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new AppError("Không tìm thấy sản phẩm", 404));

  const sizeObj = product.sizes.find((s) => s.size === size);
  if (!sizeObj) return next(new AppError("Size không tồn tại", 400));

  const colorObj = sizeObj.colors.find((c) => c.color === color);
  if (!colorObj) return next(new AppError("Màu không tồn tại", 400));

  if (colorObj.quantity < quantity) {
    return next(new AppError("Số lượng sản phẩm không đủ", 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("Vui lòng đăng nhập", 401));

  const idx = user.cart.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color,
  );

  if (idx > -1) {
    user.cart[idx].quantity += quantity;
    if (user.cart[idx].quantity > colorObj.quantity) {
      return next(
        new AppError(
          `Không đủ số lượng. Trong giỏ đã có ${user.cart[idx].quantity - quantity} sản phẩm`,
          400
        )
      );
    }
  } else {
    user.cart.push({
      product: productId,
      image: product.images[0],
      name: product.name,
      category: product.category,
      size,
      color,
      quantity,
      finalPrice: Number(product.finalPrice),
    });
  }

  await user.save();
  await user.populate("cart.product", "sizes");

  res.status(200).json({
    success: true,
    message: "Thêm vào giỏ hàng thành công",
    data: { cart: user.cart },
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("cart.product", "sizes isActive");
  if (!user) return next(new AppError("Không tìm thấy user", 404));

  res.status(200).json({ success: true, data: { cart: user.cart } });
});

exports.getCartNotUser = catchAsync(async (req, res, next) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return  res.status(200).json({ success: true, data: { cart:[] } });
  }

  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } }).select(
    "name slug price discountPercent flashSale images sizes isActive"
  );

  const productsWithVirtuals = products.map((p) =>
    p.toObject({ virtuals: true })
  );

  const cart = items
    .map((item) => {
      const product = productsWithVirtuals.find(
        (p) => p._id.toString() === item.productId
      );
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean);

  res.status(200).json({ success: true, data: { cart } });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .populate("cart.product", "sizes isActive name slug price images");

  if (!user) return next(new AppError("Không tìm thấy user", 404));

  const { cartId, productId, size, color, quantity } = req.body;

  const idx = user.cart.findIndex((item) => item._id.toString() === cartId);
  if (idx === -1)
    return next(new AppError("Không tìm thấy sản phẩm trong giỏ hàng", 404));

  const product = user.cart[idx].product;
  if (!product || !product.sizes) {
    return next(new AppError("Dữ liệu sản phẩm không hợp lệ", 400));
  }

  const foundSize = product.sizes.find((s) => s.size === size);
  if (!foundSize)
    return next(new AppError("Size không hợp lệ cho sản phẩm này", 400));

  const foundColor = foundSize.colors.find((c) => c.color === color);
  if (!foundColor || foundColor.quantity === 0) {
    return next(new AppError(`Màu ${color} cho size ${size} đã hết`, 400));
  }

  // đảm bảo không vượt quá số lượng tồn kho
  let quantityUpdate = Math.min(quantity, foundColor.quantity);

  // kiểm tra xem có item trùng trong giỏ không (cùng sản phẩm, size, color)
  const duplicateIdx = user.cart.findIndex(
    (item, i) =>
      i !== idx &&
      item.product._id.toString() === productId &&
      item.size === size &&
      item.color === color
  );

  if (duplicateIdx !== -1) {
    // gộp 2 item trùng
    quantityUpdate = Math.min(
      user.cart[duplicateIdx].quantity + quantity,
      foundColor.quantity
    );
    user.cart[duplicateIdx].quantity = quantityUpdate;
    user.cart.splice(idx, 1); // xoá item cũ
  } else {
    user.cart[idx].quantity = quantityUpdate;
    user.cart[idx].color = color;
    user.cart[idx].size = size;
  }

  await user.save();

  // đảm bảo luôn có isActive trong product khi trả về
  const cartWithActive = user.cart.map((item) => ({
    ...item.toObject(),
    product: {
      ...item.product?.toObject?.() || item.product,
      isActive: item.product?.isActive ?? true,
    },
  }));

  res.status(200).json({
    success: true,
    message: "Cập nhật giỏ hàng thành công",
    data: { cart: cartWithActive },
  });
});

exports.deleteCartItem = catchAsync(async (req, res, next) => {
  const { cartId } = req.params;

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("Không tìm thấy user", 404));

  const idx = user.cart.findIndex((item) => item._id.toString() === cartId);
  if (idx === -1) return next(new AppError("Không tìm thấy sản phẩm trong giỏ hàng", 404));

  user.cart.splice(idx, 1);
  await user.save();
  await user.populate("cart.product", "sizes");

  res.status(200).json({
    success: true,
    message: "Xóa sản phẩm thành công",
    data: { cart: user.cart },
  });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("Không tìm thấy user", 404));

  user.cart = [];
  await user.save();

  res.status(200).json({ success: true, data: { cart: user.cart } });
});
