const mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const { multipleMongooseToObject } = require("../../util/mongose");
const { mongooseToObject } = require("../../util/mongose");
const multer = require("multer");
const path = require("path");
class GuestController {
  // Trang chủ dành cho guest
  async index(req, res) {
    const articles = await Article.find({
      status: "published",
      Release_at: { $lte: new Date() }, // Kiểm tra ngày xuất bản đã qua hoặc bằng ngày hiện tại
    })
      .populate("category_id")
      .populate("author_id");

    res.render("guest/index", {
      layout: "main",
      isSubscriber: false,
      articles: multipleMongooseToObject(articles),
    });
  }
  async logined(req, res) {
    const articles = await Article.find({
      status: "published",
      Release_at: { $lte: new Date() },
    })
      .populate("category_id", "name")
      .populate("author_id");
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    res.render("guest/index", {
      layout: "logined",
      isSubscriber: false,
      articles: multipleMongooseToObject(articles),
      profile: mongooseToObject(profile),
    });
  }
  async detailArticle(req, res, next) {
    // Article.findById({_id : req.params.id})
    //     .then(( article ) =>
    //         res.render('guest/article'),{article : mongooseToObject(article)}
    //     )
    //     .catch(next);

    const article = await Article.findById(req.params.id);
    const articles = await Article.find({})
      .populate("category_id", "name")
      .populate("author_id");
    const profile = await User.findById(req.session.userId);
    if (article.type === "none") {
      res.render("guest/article", {
        layout: "logined",
        article: mongooseToObject(article),
        articles: multipleMongooseToObject(articles),
        profile: mongooseToObject(profile),
      });
    } else {
      if (profile === null) {
        return res.render("errors/not_authorized", { layout: "error" });
      } else if (profile.role !== "guest") {
        res.render("guest/article", {
          layout: "logined",
          article: mongooseToObject(article),
          articles: multipleMongooseToObject(articles),
          profile: mongooseToObject(profile),
        });
      } else {
        return res.render("errors/not_authorized", { layout: "error" });
      }
    }
  }
  // Trang danh mục
  category(req, res) {
    res.render("guest/category", { layout: "main", isSubscriber: false });
  }

  // Trang tag
  tag(req, res) {
    res.render("guest/tag", { layout: "main", isSubscriber: false });
  }

  // Trang tìm kiếm
  async search(req, res) {
    const keyword = req.query.q || ""; // Lấy từ khóa tìm kiếm từ query string

    try {
      // Lấy thông tin người dùng (kiểm tra đã đăng nhập)
      const user = await User.findById(req.session.userId);
      const isGuest = !user || user.role === "guest"; // Kiểm tra vai trò

      let articles;

      if (isGuest) {
        // Tài khoản guest: Tìm kiếm không ưu tiên
        articles = await Article.find({
          $text: { $search: keyword },
          status: "published", // Chỉ lấy bài viết đã xuất bản
        }).sort({ score: { $meta: "textScore" } }).populate("category_id").populate("author_id"); // Sắp xếp theo độ phù hợp
      } else {
        // Tài khoản không phải guest: Ưu tiên bài viết "pre"
        articles = await Article.find({
          $text: { $search: keyword },
          status: "published", // Chỉ lấy bài viết đã xuất bản
        }).sort({ type: -1, score: { $meta: "textScore" } }).populate("category_id").populate("author_id");; // Ưu tiên bài viết "pre", sau đó độ phù hợp
      }
      // console.log(articles);
      // Render kết quả
      res.render("search", {
        layout: "logined",
        articles: multipleMongooseToObject(articles),
      });
    } catch (error) {
      console.error("Error searching articles:", error); // Log chi tiết lỗi
      res.status(500).json({
        success: false,
        message: "Error searching articles",
      });
    }
  }
}

// Xuất một thể hiện của GuestController
module.exports = new GuestController();
