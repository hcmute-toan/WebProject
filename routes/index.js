// routes/index.js
const express = require("express");
const router = express.Router();
const postRoutes = require("./postRoutes"); // Import routes khác, ví dụ: postRoutes

// Kết nối các routes trong postRoutes
router.use("/", postRoutes); // Hoặc bạn có thể điều chỉnh theo prefix mong muốn như '/posts'

module.exports = router; // Đảm bảo export router chính xác
