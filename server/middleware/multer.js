// middleware/upload.js
const multer = require("multer");

// Lưu file vào bộ nhớ RAM để upload trực tiếp lên Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // giới hạn 5MB mỗi file
});

module.exports = upload;
