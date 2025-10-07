const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: { type: String },
  rating: { type: Number, min: 1, max: 5, required: true },
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  nameUser: { type: String, required: true },
  photoUser: { type: String},
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings = async function(productId) {
  const stats = await this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } }, // FIXED
    { $group: { _id: '$product', n: { $sum: 1 }, avg: { $avg: '$rating' } } }
  ]);

  const Product = require('./productModel');
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].n,
      ratingsAverage: Math.round(stats[0].avg * 10) / 10
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.post('findOneAndDelete', function(doc) {
  if (doc) doc.constructor.calcAverageRatings(doc.product);
});

reviewSchema.post('findOneAndUpdate', function(doc) {
  if (doc) doc.constructor.calcAverageRatings(doc.product);
});

module.exports = mongoose.model('Review', reviewSchema);
