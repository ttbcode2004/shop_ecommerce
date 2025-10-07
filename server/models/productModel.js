const mongoose = require('mongoose');
const slugify = require('slugify');

const colorSchema = new mongoose.Schema({
  color: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 }
}, { _id: false });

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true, enum: ['S','M','L','XL','XXL'] },
  colors: [colorSchema]
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, unique: true },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercent: { type: Number },
  images: [String],
  
  // Category info
  category: { 
    type: String, 
    required: true,
    enum: ['áo thun', 'áo polo', 'áo khoác', 'quần short', 'quần dài']
  },
  categorySlug: { type: String }, // auto-generated
  
  // People info
  people: { 
    type: String, 
    required: true,
    enum: ['nam', 'nữ', 'trẻ em']
  },
  peopleSlug: { type: String }, // auto-generated
  
  // Combined category-people slug for URL
  categoryPeopleSlug: { type: String, index: true }, // e.g: "ao-thun-nam"
  
  sizes: [sizeSchema],
  sold: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  bestSeller: { type: Boolean, default: false },
  flashSale: {
    isActive: { type: Boolean, default: false },
    discountPercent: { type: Number, min: 0, max: 100, default:0 },
    startDate: { type: Date, default:null },
    endDate: { type: Date, default: null }
  },
  ratingsAverage: { type: Number, default: 4.5, min: 1, max: 5 },
  ratingsQuantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ category: 1, people: 1 });

productSchema.index({ bestSeller: 1 });
productSchema.index({ 'flashSale.isActive': 1 });
productSchema.index({ ratingsAverage: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index(
  { name: 'text', summary: 'text', category: 'text', slug: 'text' },
  { weights: { name: 5, summary: 3, category: 2, slug: 1 }, default_language: 'none' }
);


productSchema.pre('save', function(next) {
  // name -> slug (nếu muốn theo tên)
  if (this.isModified('name') && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: 'vi' });
  }
  // Luôn đồng bộ slug cho category/people khi thay đổi
  if (this.isModified('category') && this.category) {
    this.categorySlug = slugify(this.category, { lower: true, strict: true, locale: 'vi' });
  }
  if (this.isModified('people') && this.people) {
    this.peopleSlug = slugify(this.people, { lower: true, strict: true, locale: 'vi' });
  }
  if (this.isModified('category') || this.isModified('people')) {
    this.categoryPeopleSlug = slugify(`${this.category}-${this.people}`, { lower: true, strict: true, locale: 'vi' });
  }
  next();
});


productSchema.virtual("finalPrice").get(function () {
  const now = new Date();

  // Nếu flashSale hợp lệ (active + trong thời gian)
  if (
    this.flashSale &&
    this.flashSale.isActive &&
    this.flashSale.discountPercent > 0 &&
    (!this.flashSale.startDate || now >= this.flashSale.startDate) &&
    (!this.flashSale.endDate || now <= this.flashSale.endDate)
  ) {
    return Math.round(this.price * (1 - this.flashSale.discountPercent / 100));
  }

  // Nếu không thì dùng discountPercent thường
  if (this.discountPercent && this.discountPercent > 0) {
    return Math.round(this.price * (1 - this.discountPercent / 100));
  }

  return this.price;
});

// Virtual field: isFlashSaleActive (auto check ngày, không cần lưu thủ công)
productSchema.virtual("isFlashSaleActive").get(function () {
  const now = new Date();
  return (
    this.flashSale &&
    this.flashSale.isActive &&
    (!this.flashSale.startDate || now >= this.flashSale.startDate) &&
    (!this.flashSale.endDate || now <= this.flashSale.endDate)
  );
});



// Virtual populate reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

// Static method to find by category-people slug
productSchema.statics.findByCategoryPeopleSlug = function(slug) {
  return this.find({ categoryPeopleSlug: slug });
};

// Static method to get categories with product counts
productSchema.statics.getCategoriesWithCounts = async function() {
  return this.aggregate([
    {
      $group: {
        _id: {
          category: '$category',
          people: '$people',
          categoryPeopleSlug: '$categoryPeopleSlug'
        },
        count: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { '_id.people': 1, '_id.category': 1 }
    }
  ]);
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;