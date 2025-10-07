const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  size: String,
  color: String,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  isReview: { type: Boolean, default: false },
  isReturn: { type: Boolean, default: false },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  products: [orderItemSchema],
  amount: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, enum: ['processing','order placed','shipping','delivered','cancelled'], default: 'order placed' },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false },
  paidAt: Date,
  createdAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
  isReceive: { type: Boolean, default: false },
  orderCode: { type: String, unique: true }, // friendly order id

  deliver: { type: mongoose.Schema.ObjectId, ref: "Deliver" }
});

orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Format: BACHHHmmss
    const now = new Date();
    const timePart = now.toTimeString().slice(0,8).replace(/:/g,""); // HHmmss
    this.orderCode = `BACH${timePart}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
