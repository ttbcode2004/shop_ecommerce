const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Voucher = require('../models/voucherModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getDateRange = (query) => {
  let { year, month, day, date } = query;
  let startCurrent, endCurrent, startPrevious, endPrevious;

  if (date) {
    // === Nếu có date (yyyy-mm-dd) → lấy theo ngày ===
    const targetDate = new Date(date);

    startCurrent = new Date(targetDate);
    startCurrent.setHours(0, 0, 0, 0);

    endCurrent = new Date(targetDate);
    endCurrent.setHours(23, 59, 59, 999);

    // ngày hôm trước
    startPrevious = new Date(startCurrent);
    startPrevious.setDate(startPrevious.getDate() - 1);
    startPrevious.setHours(0, 0, 0, 0);

    endPrevious = new Date(endCurrent);
    endPrevious.setDate(endPrevious.getDate() - 1);
    endPrevious.setHours(23, 59, 59, 999);
  } else if (year && month && day) {
    // === Nếu có year + month + day → ngày cụ thể ===
    const y = parseInt(year);
    const m = parseInt(month) - 1; // JS month index (0-11)
    const d = parseInt(day);

    startCurrent = new Date(y, m, d, 0, 0, 0, 0);
    endCurrent = new Date(y, m, d, 23, 59, 59, 999);

    startPrevious = new Date(startCurrent);
    startPrevious.setDate(startPrevious.getDate() - 1);

    endPrevious = new Date(endCurrent);
    endPrevious.setDate(endPrevious.getDate() - 1);
  } else if (year && month) {
    // === Nếu có month + year → lấy trong tháng ===
    const y = parseInt(year);
    const m = parseInt(month) - 1;

    startCurrent = new Date(y, m, 1);
    endCurrent = new Date(y, m + 1, 0, 23, 59, 59, 999);

    startPrevious = new Date(y, m - 1, 1);
    endPrevious = new Date(y, m, 0, 23, 59, 59, 999);
  } else if (year) {
    // === Nếu chỉ có year → lấy trong năm ===
    const y = parseInt(year);

    startCurrent = new Date(y, 0, 1);
    endCurrent = new Date(y, 11, 31, 23, 59, 59, 999);

    startPrevious = new Date(y - 1, 0, 1);
    endPrevious = new Date(y - 1, 11, 31, 23, 59, 59, 999);
  } else {
    // === Default → tháng hiện tại ===
    const now = new Date();
    startCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
    endCurrent = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    startPrevious = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    endPrevious = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );
  }

  return { startCurrent, endCurrent, startPrevious, endPrevious };
};

function calcTrend(currentValue, prevValue) {
  const diff = currentValue - prevValue;
  let trend = 'equal';
  if (diff > 0) trend = 'up';
  else if (diff < 0) trend = 'down';

  const trendValue =
    prevValue === 0
      ? currentValue > 0
        ? '100%'
        : '0%'
      : ((diff / prevValue) * 100).toFixed(1) + '%';

  return { currentValue, prevValue, diff, trend, trendValue };
}

exports.getDashboardOverview = catchAsync(async (req, res, next) => {
  let { startCurrent, endCurrent, startPrevious, endPrevious } = getDateRange(req.query);

  // === ORDERS ===
  const currentOrders = await Order.countDocuments({
    createdAt: { $gte: startCurrent, $lte: endCurrent },
    status: "delivered"
  });

  const prevOrders = await Order.countDocuments({
    createdAt: { $gte: startPrevious, $lte: endPrevious },
    status: "delivered"
  });

  // === REVENUE (NET) ===
  const revenueCurrentAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startCurrent, $lte: endCurrent },
        status: "delivered",
        payment: true,
      },
    },
    { $unwind: "$products" },
    { $match: { "products.isReturn": false } },
    {
      $group: {
        _id: null,
        total: { $sum: { $multiply: ["$products.quantity", "$products.price"] } },
      },
    },
  ]);
  const revenueCurrent = revenueCurrentAgg[0]?.total || 0;

  const revenuePrevAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startPrevious, $lte: endPrevious },
        status: "delivered",
        payment: true,
      },
    },
    { $unwind: "$products" },
    { $match: { "products.isReturn": false } },
    {
      $group: {
        _id: null,
        total: { $sum: { $multiply: ["$products.quantity", "$products.price"] } },
      },
    },
  ]);
  const revenuePrevious = revenuePrevAgg[0]?.total || 0;

  // === USERS ===
  const currentUsers = await User.countDocuments({
    createdAt: { $gte: startCurrent, $lte: endCurrent },
  });
  const prevUsers = await User.countDocuments({
    createdAt: { $gte: startPrevious, $lte: endPrevious },
  });

  // === PRODUCTS ===
  const totalProducts = await Product.countDocuments();

  // === REVIEWS ===
  const currentReviews = await Review.countDocuments({
    createdAt: { $gte: startCurrent, $lte: endCurrent },
  });
  const prevReviews = await Review.countDocuments({
    createdAt: { $gte: startPrevious, $lte: endPrevious },
  });

  const reviewStats = await Review.aggregate([
    { $group: { _id: "$rating", count: { $sum: 1 } } },
  ]);
  const colors = {
    5: "#10B981",
    4: "#F59E0B",
    3: "#EF4444",
    2: "#8B5CF6",
    1: "#6B7280",
  };
  const reviewDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const found = reviewStats.find((s) => s._id === rating);
    return { rating, count: found?.count || 0, color: colors[rating] };
  });

  res.json({
    statCards: [
      {
        title: "Tổng đơn hàng",
        ...calcTrend(currentOrders, prevOrders),
      },
      {
        title: "Doanh thu",
        ...calcTrend(revenueCurrent, revenuePrevious),
      },
      {
        title: "Khách hàng",
        ...calcTrend(currentUsers, prevUsers),
      },
      {
        title: "Sản phẩm",
        totalValue: totalProducts,
      },
      {
        title: "Đánh giá",
        ...calcTrend(currentReviews, prevReviews),
      },
    ],
    reviewDistribution,
    period: { startCurrent, endCurrent, startPrevious, endPrevious },
  });
});

exports.getRevenueByMonth = catchAsync(async (req, res, next) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const monthlyStats = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
        status: "delivered",
        payment: true,
      },
    },
    { $unwind: "$products" }, // tách từng sản phẩm
    { $match: { "products.isReturn": false } }, // chỉ lấy sản phẩm chưa return
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        revenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } },
        orders: { $addToSet: "$_id" }, // gom đơn hàng theo id (tránh trùng khi có nhiều sp)
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        revenue: 1,
        orders: { $size: "$orders" }, // số đơn unique trong tháng
      },
    },
    { $sort: { month: 1 } },
  ]);

  const revenueData = Array.from({ length: 12 }, (_, i) => {
    const found = monthlyStats.find((s) => s.month === i + 1);
    return {
      month: `T${i + 1}`,
      revenue: found?.revenue || 0,
      orders: found?.orders || 0,
    };
  });

  res.json({ revenueData });
});

exports.getOrdersOverview = catchAsync(async (req, res, next) => {
  let { startCurrent, endCurrent, startPrevious, endPrevious } = getDateRange(req.query);

  // === Tổng số đơn ===
  const [currentOrders, prevOrders] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: startCurrent, $lte: endCurrent } }),
    Order.countDocuments({ createdAt: { $gte: startPrevious, $lte: endPrevious } }),
  ]);

  // === Trạng thái đơn ===
  const statuses = [
    { key: ['delivered'], title: 'Đã giao' },
    { key: ['shipping'], title: 'Đang giao' },
    { key: ['order placed'], title: 'Đã đặt hàng' },
    { key: ['processing'], title: 'Chờ xác nhận' },
    { key: ['cancelled'], title: 'Đã hủy' },
    { key: ['processing', 'order placed', 'shipping'], title: 'Đang xử lý' },
  ];

  const statusCards = await Promise.all(
    statuses.map(async (st) => {
      const [curr, prev] = await Promise.all([
        Order.countDocuments({
          status: { $in: st.key },
          createdAt: { $gte: startCurrent, $lte: endCurrent },
        }),
        Order.countDocuments({
          status: { $in: st.key },
          createdAt: { $gte: startPrevious, $lte: endPrevious },
        }),
      ]);

      return { title: st.title, ...calcTrend(curr, prev) };
    }),
  );

  // === Doanh thu (net, bỏ sản phẩm return) ===
  const [revenueCurrentAgg, revenuePrevAgg] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startCurrent, $lte: endCurrent },
          status: "delivered",
          payment: true,
        },
      },
      { $unwind: "$products" },
      { $match: { "products.isReturn": false } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$products.quantity", "$products.price"] } },
        },
      },
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startPrevious, $lte: endPrevious },
          status: "delivered",
          payment: true,
        },
      },
      { $unwind: "$products" },
      { $match: { "products.isReturn": false } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$products.quantity", "$products.price"] } },
        },
      },
    ]),
  ]);

  const revenueCurrent = revenueCurrentAgg[0]?.total || 0;
  const revenuePrev = revenuePrevAgg[0]?.total || 0;

  // === Doanh thu theo phương thức thanh toán ===
  const paymentMethodAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startCurrent, $lte: endCurrent },
        status: "delivered",
        payment: true,
      },
    },
    { $unwind: "$products" },
    { $match: { "products.isReturn": false } },
    {
      $group: {
        _id: "$paymentMethod",
        revenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } },
        count: { $addToSet: "$_id" }, // đơn unique
      },
    },
    {
      $project: {
        method: "$_id",
        revenue: 1,
        count: { $size: "$count" },
        _id: 0,
      },
    },
  ]);

  // === Build response ===
  res.json({
    statCards: [
      { title: "Tổng đơn hàng", ...calcTrend(currentOrders, prevOrders) },
      ...statusCards,
      { title: "Doanh thu", ...calcTrend(revenueCurrent, revenuePrev) },
    ],
    paymentMethodData: paymentMethodAgg,
    period: { startCurrent, endCurrent, startPrevious, endPrevious },
  });
});

exports.getOrdersRevenueByMonth = catchAsync(async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const monthlyStats = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
        status: 'delivered',
        payment: true,
        products: { $not: { $elemMatch: { isReturn: true } } } // loại bỏ đơn có sp return
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const revenueData = Array.from({ length: 12 }, (_, i) => {
    const found = monthlyStats.find((s) => s._id === i + 1);
    return {
      month: `T${i + 1}`,
      revenue: found?.revenue || 0,
      orders: found?.orders || 0,
    };
  });

  res.json({ revenueData });
});

exports.getProductsOverview = catchAsync (async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const outOfStock = await Product.countDocuments({ stock: 0 });
  const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lt: 100 } });

  const soldAgg = await Product.aggregate([
    { $group: { _id: null, totalSold: { $sum: "$sold" } } }
  ]);
  const totalSold = soldAgg.length > 0 ? soldAgg[0].totalSold : 0;

  const statCards = [
    { title: "Tổng sản phẩm", totalValue: totalProducts },
    { title: "Đã bán", totalValue: totalSold },
    { title: "Hết hàng", totalValue: outOfStock },
    { title: "Sắp hết", totalValue: lowStock },
  ];

  res.status(200).json({ statCards });
});

exports.getProductsData = catchAsync (async (req, res) => {
  const productCategories  = await Order.aggregate([
    { $unwind: "$products" },
    { $match: { "products.isReturn": false } }, // bỏ sản phẩm return
    {
      $group: {
        _id: "$products.category",   // gộp theo category
        sold: { $sum: "$products.quantity" },
        revenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
      }
    },
    { $sort: { revenue: -1 } },
    {
      $lookup: {
        from: "products",
        localField: "_id",        // category string
        foreignField: "category", // join theo field category trong Product
        as: "categoryInfo"
      }
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        sold: 1,
        revenue: 1,
        stock: { $sum: "$categoryInfo.stock" },
        status: {
          $switch: {
            branches: [
              { case: { $eq: [{ $sum: "$categoryInfo.stock" }, 0] }, then: "Đã hết" },
              { case: { $lt: [{ $sum: "$categoryInfo.stock" }, 10] }, then: "Sắp hết" }
            ],
            default: "Còn hàng"
          }
        }
      }
    }
  ]);


  // ---- Pipeline cho top 5 sản phẩm bán nhiều nhất ----
 const topProducts = await Order.aggregate([
    { $unwind: "$products" },
    { $match: { "products.isReturn": false } }, // bỏ sản phẩm return
    {
      $group: {
        _id: "$products.product",
        sold: { $sum: "$products.quantity" },
      },
    },
    { $sort: { sold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: 0,
        name: "$product.name",
        sold: 1,
      },
    },
  ]);

  res.status(200).json({ productCategories, topProducts });
});

exports.getTopSellingProducts = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const stats = await Order.aggregate([
    { $unwind: "$products" },
    { $match: { "products.isReturn": false } }, // 🔥 loại bỏ sản phẩm trả hàng
    {
      $group: {
        _id: "$products.product",
        sold: { $sum: "$products.quantity" },
        revenue: {
          $sum: { $multiply: ["$products.quantity", "$products.price"] },
        },
      },
    },
    { $sort: { sold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: 0,
        name: "$product.name",
        sold: 1,
        stock: "$product.stock",
        revenue: 1,
        status: {
          $switch: {
            branches: [
              { case: { $eq: ["$product.stock", 0] }, then: "Đã hết" },
              { case: { $lt: ["$product.stock", 10] }, then: "Sắp hết" },
            ],
            default: "Còn hàng",
          },
        },
      },
    },
  ]);

  res.json(stats);
});

exports.getUsersOverview = catchAsync (async (req, res) => {
  let { startCurrent, endCurrent, startPrevious, endPrevious } = getDateRange(
    req.query
  );

  // ===== CURRENT PERIOD =====
  const totalUsersCurrent = await User.countDocuments({
    createdAt: { $gte: startCurrent, $lte: endCurrent },
  });

  const activeUsersCurrent = await User.countDocuments({
    isActive: true,
    createdAt: { $gte: startCurrent, $lte: endCurrent },
  });

  const blockedUsersCurrent = await User.countDocuments({
    isActive: false,
    createdAt: { $gte: startCurrent, $lte: endCurrent },
  });

  // VIP = có tổng đơn > 1 triệu trong khoảng
  const vipUsersCurrentAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startCurrent, $lte: endCurrent },
      },
    },
    {
      $group: {
        _id: "$user",
        totalSpent: { $sum: "$totalPrice" },
      },
    },
    { $match: { totalSpent: { $gt: 1000000 } } },
    { $count: "vipCount" },
  ]);
  const vipUsersCurrent =
    vipUsersCurrentAgg.length > 0 ? vipUsersCurrentAgg[0].vipCount : 0;

  // ===== PREVIOUS PERIOD =====
  const totalUsersPrev = await User.countDocuments({
    createdAt: { $gte: startPrevious, $lte: endPrevious },
  });

  const activeUsersPrev = await User.countDocuments({
    isActive: true,
    createdAt: { $gte: startPrevious, $lte: endPrevious },
  });

  const blockedUsersPrev = await User.countDocuments({
    isActive: false,
    createdAt: { $gte: startPrevious, $lte: endPrevious },
  });

  const vipUsersPrevAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startPrevious, $lte: endPrevious },
      },
    },
    {
      $group: {
        _id: "$user",
        totalSpent: { $sum: "$totalPrice" },
      },
    },
    { $match: { totalSpent: { $gt: 1000000 } } },
    { $count: "vipCount" },
  ]);
  const vipUsersPrev =
    vipUsersPrevAgg.length > 0 ? vipUsersPrevAgg[0].vipCount : 0;

  // ===== RESULT =====
  const statCards = [
    {
      title: "Tổng khách hàng",
      currentValue: totalUsersCurrent,
      prevValue: totalUsersPrev,
      ...calcTrend(totalUsersCurrent, totalUsersPrev),
    },
    {
      title: "Khách VIP",
      currentValue: vipUsersCurrent,
      prevValue: vipUsersPrev,
      ...calcTrend(vipUsersCurrent, vipUsersPrev),
    },
    {
      title: "Khách hoạt động",
      currentValue: activeUsersCurrent,
      prevValue: activeUsersPrev,
      ...calcTrend(activeUsersCurrent, activeUsersPrev),
    },
    {
      title: "Khách bị chặn",
      currentValue: blockedUsersCurrent,
      prevValue: blockedUsersPrev,
      ...calcTrend(blockedUsersCurrent, blockedUsersPrev),
    },
  ];

  res.json({ statCards });
});

exports.getNewUsersByMonth = catchAsync(async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const stats = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lte: new Date(`${year}-12-31T23:59:59.999Z`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // map thành 12 tháng (T1 - T12)
  const months = [
    "T1","T2","T3","T4","T5","T6",
    "T7","T8","T9","T10","T11","T12"
  ];

  const statsMap = {};
  stats.forEach(item => {
    statsMap[item._id] = item.count;
  });

  const newUsersData = months.map((m, idx) => ({
    month: m,
    users: statsMap[idx + 1] || 0, // idx + 1 vì tháng bắt đầu từ 1
  }));

  res.json(newUsersData);
});

exports.getTopCustomers = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const stats = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $unwind: "$products" }, // tách từng sản phẩm trong đơn
    { $match: { "products.isReturn": false } }, // 🔥 loại bỏ sản phẩm trả hàng
    {
      $group: {
        _id: "$user",
        totalSpent: {
          $sum: { $multiply: ["$products.quantity", "$products.price"] }
        },
        orders: { $addToSet: "$_id" }, // dùng set để không đếm trùng đơn
      },
    },
    {
      $project: {
        totalSpent: 1,
        orders: { $size: "$orders" },
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $match: { "user.role": "user" } }, // chỉ lấy user thường
    {
      $project: {
        _id: 0,
        name: "$user.name",
        email: "$user.email",
        totalSpent: 1,
        orders: 1,
        averageSpent: {
          $cond: [
            { $eq: ["$orders", 0] },
            0,
            { $divide: ["$totalSpent", "$orders"] }
          ]
        }
      },
    },
  ]);

  res.json(stats);
});

exports.getReviewsOverview = catchAsync (async (req, res) => {
  let { startCurrent, endCurrent, startPrevious, endPrevious } = getDateRange(req.query);

  // ====== Current period ======
  const stats = await Review.aggregate([
    { $match: { createdAt: { $gte: startCurrent, $lte: endCurrent } } },
    { $group: { _id: "$rating", count: { $sum: 1 } } }
  ]);

  const total = stats.reduce((sum, r) => sum + r.count, 0);

  // ====== Previous period ======
  const prevStats = await Review.aggregate([
    { $match: { createdAt: { $gte: startPrevious, $lte: endPrevious } } },
    { $group: { _id: "$rating", count: { $sum: 1 } } }
  ]);
  const prevTotal = prevStats.reduce((sum, r) => sum + r.count, 0);

  // ====== Build summary (phân bố theo rating) ======
  const summary = [5, 4, 3, 2, 1].map(rating => {
    const found = stats.find(s => s._id === rating);
    return {
      rating,
      count: found ? found.count : 0,
      percent: total > 0 ? ((found ? found.count : 0) / total) * 100 : 0
    };
  });

  // ====== Dưới 3 sao ======
  const belowThree = summary.filter(d => d.rating < 3).reduce((sum, d) => sum + d.count, 0);
  const prevBelowThree = prevStats
    .filter(d => d._id < 3)
    .reduce((sum, d) => sum + d.count, 0);

  // ====== Build distribution (so sánh kỳ trước) ======
  const buildTrend = (curr, prev) => {
    if (prev === 0 && curr > 0) return { trend: "up", trendValue: "100%" };
    if (prev === 0 && curr === 0) return { trend: "flat", trendValue: "0%" };
    const diff = curr - prev;
    const percent = ((diff / prev) * 100).toFixed(1) + "%";
    return {
      trend: diff > 0 ? "up" : diff < 0 ? "down" : "flat",
      trendValue: percent
    };
  };

  const distribution = [
    {
      title: "Tổng đánh giá",
      count: total,
      prevCount: prevTotal,
      ...buildTrend(total, prevTotal)
    },
    {
      title: "5 sao",
      count: summary.find(s => s.rating === 5)?.count || 0,
      prevCount: prevStats.find(s => s._id === 5)?.count || 0,
      ...buildTrend(
        summary.find(s => s.rating === 5)?.count || 0,
        prevStats.find(s => s._id === 5)?.count || 0
      )
    },
    {
      title: "4 sao",
      count: summary.find(s => s.rating === 4)?.count || 0,
      prevCount: prevStats.find(s => s._id === 4)?.count || 0,
      ...buildTrend(
        summary.find(s => s.rating === 4)?.count || 0,
        prevStats.find(s => s._id === 4)?.count || 0
      )
    },
    {
      title: "Dưới 3 sao",
      count: belowThree,
      prevCount: prevBelowThree,
      ...buildTrend(belowThree, prevBelowThree)
    }
  ];

  res.json({ distribution, summary });
});

exports.getVouchersOverview =catchAsync ( async (req, res) => {
  const now = new Date();

  // 1. Voucher đang hoạt động
  const activeVouchersCount = await Voucher.countDocuments({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });

  // 2. Voucher sắp hết hạn (trong 7 ngày tới)
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  const expiringSoonCount = await Voucher.countDocuments({
    isActive: true,
    endDate: { $gte: now, $lte: sevenDaysLater },
  });

  // 3. Voucher đã sử dụng hôm nay
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));
  const usedTodayCount = await Voucher.countDocuments({
    usedBy: { $exists: true, $ne: [] },
    updatedAt: { $gte: startOfDay, $lte: endOfDay },
  });

  // 4. Tỷ lệ sử dụng
  const totalVouchers = await Voucher.aggregate([
    { $group: { _id: null, totalVouchers: { $sum: "$usageLimit" } } },
  ]);
  const totalUsed = await Voucher.aggregate([
    { $group: { _id: null, totalUsed: { $sum: "$usedCount" } } },
  ]);
  const usedRate = totalVouchers[0]?.totalVouchers
    ? ((totalUsed[0]?.totalUsed || 0) / totalVouchers[0]?.totalVouchers) * 100
    : 0;

  const statCards = [
    { title: "Voucher đang hoạt động", total: activeVouchersCount },
    { title: "Sắp hết hạn", total: expiringSoonCount },
    { title: "Đã sử dụng hôm nay", total: usedTodayCount },
    { title: "Tỷ lệ sử dụng", total: usedRate.toFixed(2) + "%" },
  ];

  // Lấy danh sách voucher đang hoạt động chi tiết (ví dụ: top 5)
  const activeVouchers = await Voucher.find({
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  })
    .sort({ endDate: 1 })
    .select("code discountType discountValue  maxDiscountAmount usedCount usageLimit endDate");

  const formattedVouchers = activeVouchers.map(v => ({
    code: v.code,
    type: v.discountType,
    value: v.discountValue,
    maxValue: v.maxDiscountAmount,
    used: v.usedCount,
    limit: v.usageLimit,
    expiry: v.endDate.toISOString().split("T")[0],
    usedPercent: v.usageLimit
      ? ((v.usedCount / v.usageLimit) * 100)
      : 0,
  }));

  res.json({ statCards, activeVouchers: formattedVouchers });
});

exports.getFullReport = async (req, res) => {
  try {
    let { startCurrent, endCurrent, startPrevious, endPrevious } = getDateRange(req.query);

    // Đảm bảo endCurrent bao gồm cả ngày cuối
    endCurrent.setHours(23, 59, 59, 999);
    if (endPrevious) endPrevious.setHours(23, 59, 59, 999);

    // ============== 1. TỔNG QUAN DOANH THU ==============
    const revenueStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startCurrent, $lte: endCurrent },
          status: "delivered",
          payment: true,
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
          totalProducts: { $sum: '$amount' },
          avgOrderValue: { $avg: '$totalPrice' },
          paidOrders: { $sum: 1 },
          paidRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    // So sánh với kỳ trước (nếu có)
    let previousRevenueStats = null;
    let revenueGrowth = null;
    if (startPrevious && endPrevious) {
      previousRevenueStats = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startPrevious, $lte: endPrevious },
            status: "delivered",
            payment: true
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            totalOrders: { $sum: 1 }
          }
        }
      ]);

      if (previousRevenueStats.length > 0 && revenueStats.length > 0) {
        const prevRev = previousRevenueStats[0].totalRevenue;
        const currRev = revenueStats[0].totalRevenue;
        revenueGrowth = {
          revenue: prevRev > 0 ? parseFloat(((currRev - prevRev) / prevRev * 100).toFixed(2)) : 0,
          orders: previousRevenueStats[0].totalOrders > 0 
            ? parseFloat(((revenueStats[0].totalOrders - previousRevenueStats[0].totalOrders) / previousRevenueStats[0].totalOrders * 100).toFixed(2))
            : 0
        };
      }
    }

    // ============== 2. ĐƠN HÀNG THEO TRẠNG THÁI ==============
    const ordersByStatus = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startCurrent, $lte: endCurrent }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // ============== 3. DOANH THU THEO NGÀY ==============
    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startCurrent, $lte: endCurrent },
          status: { $nin: ['cancelled'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          date: { $first: '$createdAt' },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
          products: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // ============== 4. TOP SẢN PHẨM BÁN CHẠY ==============
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startCurrent, $lte: endCurrent },
          status: { $nin: ['cancelled'] }
        }
      },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          name: { $first: '$products.name' },
          category: { $first: '$products.category' },
          image: { $first: '$products.image' },
          totalQuantity: { $sum: '$products.quantity' },
          totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
          avgPrice: { $avg: '$products.price' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);

    // ============== 5. DOANH THU THEO DANH MỤC ==============
    const revenueByCategory = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startCurrent, $lte: endCurrent },
          status: { $nin: ['cancelled'] }
        }
      },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.category',
          totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
          totalQuantity: { $sum: '$products.quantity' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // ============== 6. THỐNG KÊ KHÁCH HÀNG ==============
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startCurrent, $lte: endCurrent }
    });

    const activeUsers = await Order.distinct('user', {
      createdAt: { $gte: startCurrent, $lte: endCurrent }
    });

    const topCustomers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startCurrent, $lte: endCurrent },
          status: { $nin: ['cancelled'] }
        }
      },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
          totalProducts: { $sum: '$amount' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          userId: '$_id',
          name: '$userInfo.name',
          email: '$userInfo.email',
          phone: '$userInfo.phone',
          totalSpent: 1,
          orderCount: 1,
          totalProducts: 1,
          avgOrderValue: { $divide: ['$totalSpent', '$orderCount'] }
        }
      }
    ]);

    // ============== 7. PHƯƠNG THỨC THANH TOÁN ==============
    const paymentMethods = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startCurrent, $lte: endCurrent }
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          paidCount: { $sum: { $cond: ['$payment', 1, 0] } }
        }
      }
    ]);

    // ============== 8. ĐÁNH GIÁ SẢN PHẨM ==============
    const reviewStats = await Review.aggregate([
      {
        $match: {
          createdAt: { $gte: startCurrent, $lte: endCurrent }
        }
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
        }
      }
    ]);

    // ============== 9. SẢN PHẨM TỒN KHO ==============
    const inventoryStats = await Product.aggregate([
      {
        $project: {
          name: 1,
          category: 1,
          stock: 1,
          sold: 1,
          price: 1,
          inventoryValue: { $multiply: ['$stock', '$price'] },
          turnoverRate: {
            $cond: [
              { $gt: ['$stock', 0] },
              { $divide: ['$sold', { $add: ['$stock', '$sold'] }] },
              0
            ]
          }
        }
      },
      {
        $facet: {
          lowStock: [
            { $match: { stock: { $lte: 10, $gt: 0 } } },
            { $sort: { stock: 1 } },
            { $limit: 20 }
          ],
          outOfStock: [
            { $match: { stock: 0 } },
            { $limit: 20 }
          ],
          totalInventoryValue: [
            {
              $group: {
                _id: null,
                totalValue: { $sum: '$inventoryValue' },
                totalStock: { $sum: '$stock' }
              }
            }
          ]
        }
      }
    ]);

    // ============== 10. VOUCHER SỬ DỤNG ==============
    const voucherUsage = await Voucher.aggregate([
      {
        $match: {
          startDate: { $lte: endCurrent },
          endDate: { $gte: startCurrent }
        }
      },
      {
        $project: {
          code: 1,
          description: 1,
          discountType: 1,
          discountValue: 1,
          usedCount: 1,
          usageLimit: 1,
          usageRate: {
            $cond: [
              { $gt: ['$usageLimit', 0] },
              { $multiply: [{ $divide: ['$usedCount', '$usageLimit'] }, 100] },
              100
            ]
          },
          isActive: 1
        }
      },
      { $sort: { usedCount: -1 } }
    ]);

    // ============== 11. TỶ LỆ HOÀN THÀNH ĐƠN HÀNG ==============
    const orderCompletionRate = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startCurrent, $lte: endCurrent }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          processing: { $sum: { $cond: [{ $in: ['$status', ['processing', 'order placed', 'shipping']] }, 1, 0] } }
        }
      },
      {
        $project: {
          total: 1,
          delivered: 1,
          cancelled: 1,
          processing: 1,
          deliveryRate: {
            $cond: [
              { $gt: ['$total', 0] },
              { $multiply: [{ $divide: ['$delivered', '$total'] }, 100] },
              0
            ]
          },
          cancellationRate: {
            $cond: [
              { $gt: ['$total', 0] },
              { $multiply: [{ $divide: ['$cancelled', '$total'] }, 100] },
              0
            ]
          }
        }
      }
    ]);

    // ============== RESPONSE ==============
    res.status(200).json({
      success: true,
      dateRange: {
        current: { start: startCurrent, end: endCurrent },
        previous: startPrevious && endPrevious ? { start: startPrevious, end: endPrevious } : null
      },
      summary: {
        revenue: revenueStats[0] || {
          totalRevenue: 0,
          totalOrders: 0,
          totalProducts: 0,
          avgOrderValue: 0,
          paidOrders: 0,
          paidRevenue: 0
        },
        growth: revenueGrowth,
        customers: {
          newUsers,
          activeUsers: activeUsers.length,
          totalUsers: await User.countDocuments({ isActive: true })
        }
      },
      orders: {
        byStatus: ordersByStatus,
        dailyRevenue,
        completionRate: orderCompletionRate[0] || null
      },
      products: {
        topSelling: topProducts,
        byCategory: revenueByCategory,
        inventory: inventoryStats[0]
      },
      customers: {
        top: topCustomers
      },
      payment: {
        methods: paymentMethods
      },
      reviews: reviewStats[0] || {
        totalReviews: 0,
        avgRating: 0,
        rating5: 0,
        rating4: 0,
        rating3: 0,
        rating2: 0,
        rating1: 0
      },
      vouchers: voucherUsage
    });

  } catch (error) {
    console.error('Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo báo cáo',
      error: error.message
    });
  }
};
