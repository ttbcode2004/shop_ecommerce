const User = require('../models/userModel');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError("Không tìm thấy tài khoản", 404));
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

exports.updatePhotoImage = catchAsync(async (req, res, next) => {
  if (!req.file || !req.file.buffer) {
    return next(new AppError("Không tìm thấy file ảnh", 400));
  }

  const uploadImage = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "avatars",
          public_id: fileName,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  };

  const photoUrl = await uploadImage(req.file.buffer, req.file.originalname);

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { photo: photoUrl },
    { new: true }
  );

  if (!user) {
    return next(new AppError("Không tìm thấy người dùng", 404));
  }

  res.json({
    success: true,
    message: "Cập nhật thành công",
    data: { user },
  });
});

exports.updateUserProfile = catchAsync(async (req, res, next) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return next(new AppError("Vui lòng điền đầy đủ thông tin", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, phone },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError("Không tìm thấy người dùng", 404));
  }

  res.status(200).json({
    success: true,
    message: "Cập nhật thành công",
    data: { user },
  });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.aggregate([
    { $match: { role: { $ne: "admin" } } },

    // Lấy toàn bộ orders của user
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "user",
        as: "orders",
      },
    },

    // Tính toán lại ordersCount & totalSpent nhưng không ảnh hưởng đến dữ liệu orders gốc
    {
      $addFields: {
        ordersCount: {
          $size: {
            $filter: {
              input: "$orders",
              as: "order",
              cond: { $ne: ["$$order.status", "cancelled"] }
            }
          }
        },
        totalSpent: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: "$orders",
                  as: "order",
                  cond: { $ne: ["$$order.status", "cancelled"] }
                }
              },
              as: "order",
              in: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$$order.products",
                        as: "p",
                        cond: { $ne: ["$$p.isReturn", true] }
                      }
                    },
                    as: "p",
                    in: { $multiply: ["$$p.quantity", "$$p.price"] }
                  }
                }
              }
            }
          }
        },
        cartCount: { $size: "$cart" },
      },
    },

    {
      $project: {
        password: 0,
        wishlist: 0,
        addresses: 0,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: { users },
  });
});


// Xóa user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("Không tìm thấy người dùng", 404));
  }

  user.isActive = false;
  await user.save(); // nhớ save lại

  res.status(200).json({
    success: true,
    message: "Người dùng đã bị vô hiệu hóa",
    data: {user},
  });
});

exports.unBlockUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("Không tìm thấy người dùng", 404));
  }

  user.isActive = true;
  await user.save(); // nhớ save lại

  res.status(200).json({
    success: true,
    message: "Người dùng đã được kích hoạt lại",
    data: {user},
  });
});
