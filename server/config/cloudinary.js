const { v2: cloudinary } = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

console.log("Cloudinary ENV:", {
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "✅ loaded" : "❌ missing",
  CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY ? "✅ loaded" : "❌ missing",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

module.exports = cloudinary;
