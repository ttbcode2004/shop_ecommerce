const mongoose = require('mongoose');

const subOrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  size: String,
  color: String,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
}, { _id: false });

const subOrderSchema = new mongoose.Schema({
  products: [subOrderItemSchema],
  amount: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, enum: ['processing','order placed','shipping','delivered','cancelled'], default: 'order placed' },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false },
  paidAt: Date,
  createdAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
  deliver: { type: mongoose.Schema.ObjectId, ref: "Deliver" }
});

const SubOrder = mongoose.model('SubOrder', subOrderSchema);
module.exports = SubOrder;