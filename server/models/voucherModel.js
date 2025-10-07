const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true },
  description: { type: String },

  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  usageLimit: { type: Number, default: 0 }, // 0 = unlimited
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },

  applicableUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  applicableCategories: [String],
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

voucherSchema.index({ code: 1 });
voucherSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

voucherSchema.pre("save", function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error("End date must be after start date"));
  }
  next();
});

voucherSchema.virtual("isExpired").get(function () {
  return Date.now() > this.endDate;
});

const Voucher = mongoose.model("Voucher", voucherSchema);
module.exports = Voucher;
