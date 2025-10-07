const fs = require('fs');
const path = require("path");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require("../models/productModel");
const cloudinary = require('../config/cloudinary');

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB)
  .then(() => console.log("✅ DB connection successful!"))
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });

const uploadToCloudinary = (filePath, fileName, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: `ecommerce/${folder}`,
        public_id: path.parse(fileName).name,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
  });
};

const products = JSON.parse(fs.readFileSync(`${__dirname}/sample_products.json`, 'utf-8'));

const categoryFolderMap = {
  "áo thun": "ao-thun",
  "áo polo": "ao-polo",
  "áo khoác": "ao-khoac",
  "quần short": "quan-short",
  "quần dài": "quan-dai",
};

const assignImagesToProducts = async () => {
  const categoryCount = {};

  for (let product of products) {
    const folder = categoryFolderMap[product.category];
    if (!folder) {
      console.warn(`⚠️ Category "${product.category}" chưa có trong map`);
      continue;
    }

    // Đếm sản phẩm theo category
    categoryCount[folder] = (categoryCount[folder] || 0) + 1;

    // Hàng (row) = từ 1 → 9, quay vòng
    const rowIndex = ((categoryCount[folder] - 1) % 9) + 1;

    // Lấy toàn bộ ảnh có rowIndex đó
    const folderPath = path.join(__dirname, "images", folder);
    const files = fs.readdirSync(folderPath);

    // lọc file trùng với rowIndex (vd: ao-khoac-3-*.jpeg)
    const rowFiles = files.filter(file => file.startsWith(`${folder}-${rowIndex}-`));

    const imageUrls = [];
    for (let file of rowFiles) {
      const filePath = path.join(folderPath, file);
      if (fs.existsSync(filePath)) {
        const imageUrl = await uploadToCloudinary(filePath, file, folder);
        imageUrls.push(imageUrl);
      }
    }

    product.images = imageUrls;

    await Product.create(product);
    console.log(`✅ Seeded ${product.name} with row ${rowIndex} (${imageUrls.length} images)`);
  }

  console.log("🎉 All products seeded successfully!");
  process.exit();
};

assignImagesToProducts();
