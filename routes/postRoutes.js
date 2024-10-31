// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController"); // Nhập đúng controller

// Route để lấy tất cả các bài viết
router.get("/posts", postController.getAllPosts); // Đảm bảo path và controller chính xác

module.exports = router; // Export router chính xác
