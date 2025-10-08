const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log("✅ Kết nối thành công MongoDB Atlas!"))
  .catch((err) => {
    console.error("❌ Lỗi kết nối:", err.message);
    process.exit(1);
  });

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`🚀 App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});
