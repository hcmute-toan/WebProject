const mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const ArticleTag = require("../models/articleTagModel");
const Tag = require("../models/tagModel");
const Subscription = require("../models/subscriptionModel");
const Plan = require("../models/subscriptionPlanModel");
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
  async contact_us(req, res) {
    const profile = await User.findById(req.session.userId);
    if(profile === null)
    {
      res.render("about_us/contact", {
        layout: "main",
      });
    }
    else{
      res.render("about_us/contact", {
        layout: "logined",
        profile: mongooseToObject(profile),
      });
    }
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
    const articleTags = await ArticleTag.find({
      article_id: req.params.id,
    }).populate("tag_id");
    const article = await Article.findById(req.params.id)
      .populate("category_id", "name")
      .populate("author_id");
    const articles = await Article.find({})
      .populate("category_id", "name")
      .populate("author_id");
    const profile = await User.findById(req.session.userId);
    if (article.type === "none") {
      if (profile === null) {
        return res.render("guest/article", {
          layout: "main",
          article: mongooseToObject(article),
          articles: multipleMongooseToObject(articles),
          articleTags: multipleMongooseToObject(articleTags),
        });
      }
      res.render("guest/article", {
        layout: "logined",
        article: mongooseToObject(article),
        articles: multipleMongooseToObject(articles),
        profile: mongooseToObject(profile),
        articleTags: multipleMongooseToObject(articleTags),
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
          articleTags: multipleMongooseToObject(articleTags),
        });
      } else {
        return res.render("errors/not_authorized", { layout: "error" });
      }
    }
  }
  // Trang danh mục
  async category(req, res) {
    const profile = await User.findById(req.session.userId);
    if (profile === null) {
      const articles = await Article.find({ category_id: req.params.id })
        .populate("category_id")
        .populate("author_id");
      res.render("search", {
        layout: "main",
        articles: multipleMongooseToObject(articles),
      });
    } else {
      const articles = await Article.find({ category_id: req.params.id })
        .populate("category_id")
        .populate("author_id");
      res.render("search", {
        layout: "logined",
        articles: multipleMongooseToObject(articles),
        profile: mongooseToObject(profile),
      });
    }
  }

  // Trang tag
  async tag(req, res) {
    const profile = await User.findById(req.session.userId);
    if (profile === null) {
      const articleTags = await ArticleTag.find({ tag_id: req.params.id })
        .populate({
          path: "article_id", // Populate article_id trước
          populate: { path: "author_id" }, // Tiếp tục populate author_id trong article
        })
        .populate("tag_id");
      res.render("search", {
        layout: "main",
        articleTags: multipleMongooseToObject(articleTags),
      });
    } else {
      const articleTags = await ArticleTag.find({ tag_id: req.params.id })
        .populate({
          path: "article_id", // Populate article_id trước
          populate: { path: "author_id" }, // Tiếp tục populate author_id trong article
          populate: { path: "category_id" },
        })
        .populate("tag_id");
      res.render("search", {
        layout: "logined",
        articleTags: multipleMongooseToObject(articleTags),
        profile: mongooseToObject(profile),
      });
    }
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
        })
          .sort({ score: { $meta: "textScore" } })
          .populate("category_id")
          .populate("author_id"); // Sắp xếp theo độ phù hợp
      } else {
        // Tài khoản không phải guest: Ưu tiên bài viết "pre"
        articles = await Article.find({
          $text: { $search: keyword },
          status: "published", // Chỉ lấy bài viết đã xuất bản
        })
          .sort({ type: -1, score: { $meta: "textScore" } })
          .populate("category_id")
          .populate("author_id"); // Ưu tiên bài viết "pre", sau đó độ phù hợp
      }
      const profile = await User.findById(req.session.userId);
      // console.log(articles);
      // Render kết quả
      // console.log("FMMMMMMMMMMM"+profile);
      if (profile === null) {
        res.render("search", {
          layout: "main",
          articles: multipleMongooseToObject(articles),
        });
      }
      res.render("search", {
        layout: "logined",
        articles: multipleMongooseToObject(articles),
        profile: mongooseToObject(profile),
      });
    } catch (error) {
      console.error("Error searching articles:", error); // Log chi tiết lỗi
      res.status(500).json({
        success: false,
        message: "Error searching articles",
      });
    }
  }
  async vip_register(req, res) {
    const { plan } = req.body;
    const userId = req.session.userId;

    if (!plan) {
      return res.status(400).json({ message: "Plan is required" });
    }

    const planDays = parseInt(plan);
    const profile = await User.findById(userId);

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra và cập nhật lại vai trò nếu subscription đã hết hạn
    const existingSubscription = await Subscription.findOne({
      user_id: userId,
    });

    if (
      existingSubscription &&
      existingSubscription.end_date.getTime() < Date.now()
    ) {
      profile.role = "guest";
      await profile.save();
    }

    let newSubscription;
    if (profile.role === "guest") {
      if (
        !existingSubscription ||
        existingSubscription.end_date.getTime() < Date.now()
      ) {
        // Tạo mới subscription nếu không tồn tại hoặc đã hết hạn
        newSubscription = new Subscription({
          user_id: userId,
          start_date: Date.now(),
          end_date: new Date(Date.now() + planDays * 24 * 60 * 60 * 1000),
        });
      } else {
        // Gia hạn subscription
        newSubscription = new Subscription({
          user_id: userId,
          start_date: existingSubscription.end_date,
          end_date: new Date(
            existingSubscription.end_date.getTime() +
              planDays * 24 * 60 * 60 * 1000
          ),
        });
      }

      // Lưu subscription mới
      await newSubscription.save();

      // Cập nhật vai trò thành subscriber
      profile.role = "subscriber";
      await profile.save();

      console.log("Subscription updated successfully");
      res.redirect("vip_registration"); // Hoặc alert từ phía client
    } else {
      res
        .status(403)
        .json({ message: "User is not allowed to register as VIP" });
    }
  }

  async vip_registration(req, res) {
    const profile = await User.findById(req.session.userId);
    const plans = await Plan.find({});
    return res.render("guest/register_premium", {
      layout: "logined",
      profile: mongooseToObject(profile),
      plans : multipleMongooseToObject(plans),
    });
  }
}

// Xuất một thể hiện của GuestController
module.exports = new GuestController();
