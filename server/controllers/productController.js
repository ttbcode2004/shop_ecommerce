const Product = require('../models/productModel');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const uploadImage = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'ecommerce',
        public_id: fileName.split('.')[0],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const calculateStock = (sizes) => {
  let stock = 0;
  if (sizes) {
    sizes.forEach((size) => {
      size.colors.forEach((color) => {
        stock += color.quantity;
      });
    });
  }
  return stock;
};

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 12, 
    sort = '-createdAt', 
    category, 
    people, 
    minPrice, 
    maxPrice,
    rating,
    flashSale,
    search,
  } = req.query;  

  const skip = (page - 1) * limit;

  const pipeline = [];

  // ===== MATCH FILTER CƠ BẢN =====
  const match = {};
  match.isActive = true;

  if (category) {
    const categories = Array.isArray(category) ? category : category.split(',');
    match.categorySlug = { $in: categories.map(c => new RegExp(`^${c}$`, 'i')) };
  }

  if (people) {
    const peoples = Array.isArray(people) ? people : people.split(',');
    match.peopleSlug = { $in: peoples.map(p => new RegExp(`^${p}$`, 'i')) };
  }

  if (rating) match.ratingsAverage = { $gte: Number(rating) };
  if (flashSale === 'true') {
    match['flashSale.isActive'] = true;
    match['flashSale.startDate'] = { $lte: new Date() };
    match['flashSale.endDate'] = { $gte: new Date() };
  }

  if (search) {
    match.$or = [
      { name: new RegExp(search, 'i') },
      { category: new RegExp(search, 'i') },
      { slug: new RegExp(search, 'i') },
    ];
  }

  if (Object.keys(match).length > 0) {
    pipeline.push({ $match: match });
  }

  // ===== TÍNH FINAL PRICE =====
  pipeline.push({
    $addFields: {
      finalPrice: {
        $cond: [
          {
            $and: [
              "$flashSale.isActive",
              { $or: [ { $eq: ["$flashSale.startDate", null] }, { $lte: ["$flashSale.startDate", new Date()] } ] },
              { $or: [ { $eq: ["$flashSale.endDate", null] }, { $gte: ["$flashSale.endDate", new Date()] } ] },
              { $gt: ["$flashSale.discountPercent", 0] }
            ]
          },
          { 
            $round: [
              { $multiply: ["$price", { $subtract: [1, { $divide: ["$flashSale.discountPercent", 100] }] }] }, 
              0
            ] 
          },
          {
            $cond: [
              { $gt: ["$discountPercent", 0] },
              { 
                $round: [
                  { $multiply: ["$price", { $subtract: [1, { $divide: ["$discountPercent", 100] }] }] }, 
                  0
                ] 
              },
              "$price"
            ]
          }
        ]
      },
      isFlashSaleActive: {
        $and: [
          "$flashSale.isActive",
          { $or: [ { $eq: ["$flashSale.startDate", null] }, { $lte: ["$flashSale.startDate", new Date()] } ] },
          { $or: [ { $eq: ["$flashSale.endDate", null] }, { $gte: ["$flashSale.endDate", new Date()] } ] }
        ]
      }
    }
  });

  // ===== FILTER THEO FINAL PRICE =====
  if (minPrice || maxPrice) {
    const priceFilter = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    pipeline.push({ $match: { finalPrice: priceFilter } });
  }

  // ===== SORT =====
  if (sort) {
    const sortField = sort.replace('-', '');
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    pipeline.push({ $sort: { [sortField]: sortOrder } });
  }

  // ===== PHÂN TRANG =====
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: Number(limit) });

// ===== CHỈ SELECT CÁC FIELD CẦN THIẾT =====
  pipeline.push({
    $project: {
      name: 1,
      slug: 1,
      price: 1,
      discountPercent: 1,  
      images: 1,
      sizes: 1,
      flashSale: 1,
      isActive: 1,
      finalPrice: 1,      
      isFlashSaleActive: 1  
    }
  });

  // chạy query
  const products = await Product.aggregate(pipeline);

  // tổng count (phải chạy pipeline riêng vì aggregate không có total mặc định)
  const totalPipeline = pipeline.filter(stage => !('$skip' in stage || '$limit' in stage || '$sort' in stage || '$project' in stage));
  totalPipeline.push({ $count: "total" });
  const totalResult = await Product.aggregate(totalPipeline);
  const total = totalResult.length > 0 ? totalResult[0].total : 0;

  res.status(200).json({
    success: true,
    status: 'success',
    results: products.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    data: products,
  });
});

exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const limit = Number(req.query.limit) || 12;
  const sort = req.query.sort || "-sold";

  let filter = {};

  // Gom nhóm slug - cập nhật để match với frontend
  if (slug === "ao") {
    filter = { categorySlug: { $in: ["ao-thun", "ao-polo", "ao-khoac"] } };
  } else if (slug === "quan") {
    filter = { categorySlug: { $in: ["quan-short", "quan-dai"] } };
  } else {
    filter = { categorySlug: slug };
  }

  filter.isActive = true;
  const products = await Product.find(filter)
    .sort(sort)
    .limit(limit)
    .select("name slug price category discountPercent images sizes flashSale isActive");

  const total = await Product.countDocuments(filter);

  if (total === 0) {
    return next(new AppError("Không tìm thấy sản phẩm cho danh mục này", 404));
  }

  const categoryInfo = products[0]
    ? {
        category: products[0].category,
        people: products[0].people,
        categoryPeopleSlug: products[0].categoryPeopleSlug,
      }
    : null;

  res.status(200).json({
    success: true,
    results: products.length,
    total,
    categoryInfo,
    data: products,
  });
});

exports.getFlashSaleProducts = catchAsync(async (req, res, next) => {
  const { limit = 12 } = req.query;
  const now = new Date();

  const products = await Product.find({
    'flashSale.isActive': true,
    'flashSale.startDate': { $lte: now },
    'flashSale.endDate': { $gte: now },
  })
    .sort('-flashSale.discountPercent')
    .limit(Number(limit))
    .select(
      'name slug summary category price images price discountPercent flashSale sold stock isActive',
    );

  res.status(200).json({
    success: true,
    status: 'success',
    results: products.length,
    data: products,
  });
});

exports.getProductBySlug = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug }).populate({
    path: 'reviews',
    select: 'rating review user createdAt',
    populate: {
      path: 'user',
      select: 'name photo',
    },
  });

  if (!product) {
    return next(new AppError('Không tìm thấy sản phẩm', 404));
  }

  res.status(200).json({
    success: true,
    status: 'success',
    data: product,
  });
});

exports.getFeaturedProducts = catchAsync(async (req, res, next) => {
  const { limit = 10 } = req.query;
  
  const products = await Product.find({ isActive: true })
    .sort('-ratingsAverage -sold')
    .limit(Number(limit))
    .select('name slug price category discountPercent images sizes flashSale isActive',);

  res.status(200).json({
    success: true,
    status: 'success',
    results: products.length,
    data: products,
  });
});

exports.getRelatedProducts = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const limit = Number(req.params.limit) || 4; // ✅ lấy từ query thay vì params

  const currentProduct = await Product.findOne({ slug }).select('category people');

  if (!currentProduct) {
    return next(new AppError('Không tìm thấy sản phẩm', 404));
  }

  const relatedProducts = await Product.find({
    slug: { $ne: slug },
    category: currentProduct.category,
    people: currentProduct.people,
  })
    .sort('-sold -ratingsAverage')
    .limit(limit)
    .select('name slug price category discountPercent images sizes flashSale isActive');

  res.status(200).json({
    success: true,
    status: 'success',
    results: relatedProducts.length,
    data: relatedProducts,
  });
});


exports.addProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    summary,
    description,
    price,
    discountPercent,
    category,
    people,
    bestSeller,
  } = req.body;

  let imageUrls = [];
  if (req.files?.length > 0) {
    imageUrls = await Promise.all(
      req.files.map((file) => uploadImage(file.buffer, file.originalname))
    );
  }

  const sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];
  const stock = calculateStock(sizes);
  const isActive = stock > 0;

  const newProduct = await Product.create({
    name,
    summary,
    description,
    price,
    discountPercent,
    category,
    people,
    sizes,
    stock,
    isActive,
    bestSeller,
    images: imageUrls,
  });

  res.status(201).json({
    success: true,
    status: 'success',
    message: 'Thêm sản phẩm thành công',
    data: newProduct,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) return next(new AppError('Không tìm thấy sản phẩm', 404));

  const {
    name,
    summary,
    description,
    price,
    discountPercent,
    category,
    people,
    bestSeller,
  } = req.body;

  let oldImages = [];
  if (req.body.oldImages) {
    try {
      oldImages = JSON.parse(req.body.oldImages);
    } catch {
      return next(new AppError('Dữ liệu oldImages không hợp lệ', 400));
    }
  }

  let newImageUrls = [];
  if (req.files?.length > 0) {
    newImageUrls = await Promise.all(
      req.files.map((file) => uploadImage(file.buffer, file.originalname))
    );
  }

  const sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];
  const stock = calculateStock(sizes);
  const isActive = stock > 0;

  // Update fields
  product.name = name ?? product.name;
  product.summary = summary ?? product.summary;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.discountPercent = discountPercent ?? product.discountPercent;
  product.category = category ?? product.category;
  product.people = people ?? product.people;
  product.bestSeller = bestSeller ?? product.bestSeller;
  product.sizes = sizes;
  product.stock = stock;
  product.isActive = isActive;
  product.images = [...oldImages, ...newImageUrls];

  if (req.body.flashSale) {
    try {
      const { isActive, discountPercent, startDate, endDate } = req.body.flashSale;
      product.flashSale = {
        isActive: isActive === 'true' || isActive === true,
        discountPercent: discountPercent ? Number(discountPercent) : 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      };
    } catch {
      return next(new AppError('Dữ liệu flashSale không hợp lệ', 400));
    }
  }

  await product.save();

  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Cập nhật sản phẩm thành công',
    data: product,
  });
});

exports.getAllProductsAdmin = catchAsync(async (req, res, next) => {
  const products = await Product.find({});
  res.status(200).json({
    success: true,
    status: 'success',
    results: products.length,
    data: products,
  });
});

exports.updateFlashsaleProducts = catchAsync(async (req, res, next) => {
  const { productIds, flashSaleData } = req.body;
  if (!productIds || !flashSaleData) {
    return next(new AppError('Thiếu dữ liệu cập nhật flashSale', 400));
  }

  const { isActive = true, discountPercent, startDate, endDate } = flashSaleData;

  await Product.updateMany(
    { _id: { $in: productIds } },
    {
      $set: {
        "flashSale.isActive": isActive,
        "flashSale.discountPercent": discountPercent,
        "flashSale.startDate": startDate,
        "flashSale.endDate": endDate,
      },
    }
  );

  const products = await Product.find();
  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Cập nhật flashSale thành công',
    data: { products },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) return next(new AppError('Không tìm thấy sản phẩm', 404));

  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Xóa sản phẩm thành công!',
  });
});

exports.blockProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) return next(new AppError('Không tìm thấy sản phẩm', 404));
  
  const isActive = product.isActive;

  product.isActive = !isActive;
  await product.save();

  res.status(200).json({
    success: true,
    status: 'success',
    data: product,
    message: isActive ? 'Khóa sản phẩm thành công!' : 'Mở khóa sản phẩm thành công!',
  });
});
