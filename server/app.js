const express = require('express');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const AppError = require("./utils/appError");
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

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(morgan('dev'));

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

app.all("/{*any}", (req, res, next) => {
  next(new AppError(`Không tìm thấy ${req.originalUrl} trên server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
