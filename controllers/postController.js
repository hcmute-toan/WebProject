// controllers/postController.js
const db = require("../config/db");

// Hàm để lấy tất cả các bài viết
const getAllPosts = (req, res) => {
  db.query("SELECT * FROM posts", (err, results) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).send("Server error");
    }
    res.render("home", { posts: results }); // Render view 'home' với dữ liệu posts
  });
};

module.exports = {
  getAllPosts,
};
