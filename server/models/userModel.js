const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, default: 1, min: 1 },
  finalPrice: { type: Number, required: true } // snapshot price at time add-to-cart
}, );

const wishlistItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String, required: true },
  finalPrice: { type: Number, required: true } ,
  discountPercent: { type: Number, default: 0 },
}, { _id: false });

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  street: String,
  commune: String,
  city: String,
  notes: String,
  defaultAddress: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please tell us your name'] },
  email: { type: String, required: [true, 'Please provide email'], unique: true},
  phone: { type: String, required: true },
  photo: { type: String },
  password: { type: String, required: [true, 'Please provide a password'], minlength: 8,select: false},
  role: { type: String, enum: ['user','admin','seller'], default: 'user' },
  cart: [cartItemSchema],
  wishlist: [wishlistItemSchema],
  addresses: [addressSchema],
  createdAt: { type: Date, default: Date.now }, 
  isActive: {type: Boolean, default: true}
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// instance method to compare passwords
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User
