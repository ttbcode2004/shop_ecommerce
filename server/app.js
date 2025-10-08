const express = require('express');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const globalErrorHandler = require('./controllers/errorController');

const productRouter = require('./routes/productRoutes');
const voucherRouter = require('./routes/voucherRoutes');
const deliverRouter = require('./routes/deliverRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const cartRouter = require('./routes/cartRoutes');
const wishlistRouter = require('./routes/wishlistRoutes');
const addressRouter = require('./routes/addressRoutes');
const orderRouter = require('./routes/orderRoutes');
const subOrderRouter = require('./routes/subOrderRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://bach-shop-frontend.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

console.log("Allowed Origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/vouchers', voucherRouter);
app.use('/api/v1/delivers', deliverRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/wishlists', wishlistRouter);
app.use('/api/v1/address', addressRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/subOrders', subOrderRouter);
app.use('/api/v1/dashboard', dashboardRouter);

app.use(globalErrorHandler);

module.exports = app;
