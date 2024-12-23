const mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const ArticleTag = require("../models/articleTagModel");
const Tag = require("../models/tagModel");
const Subscription = require("../models/subscriptionModel");
const Comment = require("../models/commentModel");
const Plan = require("../models/subscriptionPlanModel");
const { multipleMongooseToObject } = require("../../util/mongose");
const { mongooseToObject } = require("../../util/mongose");
const multer = require("multer");
const path = require("path");
class GuestController {
  // Trang chủ dành cho guest
  async index(req, res) {
    req.session.destroy();
    const parentCategories = await Category.find({ parent_id: null });
    const categoriesWithChildren = [];

    // Use the utility function to convert Mongoose objects to plain objects
    const parentCategoriesObjects = multipleMongooseToObject(parentCategories);

    for (let parentCategory of parentCategoriesObjects) {
      const childCategories = await Category.find({
        parent_id: parentCategory._id,
      });

      // Convert the child categories to plain objects as well
      const childCategoriesObjects = multipleMongooseToObject(childCategories);

      categoriesWithChildren.push({
        parentCategory,
        childCategories: childCategoriesObjects,
      });
    }
    const startOfWeek = new Date();
    //3-4 bài viết nổi bật trong tuần
    startOfWeek.setDate(startOfWeek.getDate() - 7); // Lấy ngày đầu tuần (7 ngày trước)
    const featured_articles = await Article.find({
      status: "published",
      Release_at: { $gte: startOfWeek, $lte: new Date() }, // Lấy các bài viết trong tuần qua
    })
      .sort({ count_view: -1 }) // Sắp xếp theo lượt xem giảm dần
      .limit(4) // Giới hạn 3-4 bài viết
      .populate("category_id")
      .populate("author_id");
    // 10 bài viết được xem nhiều nhất
    const articles_10_most_view = await Article.find({
      status: "published",
      Release_at: { $lte: new Date() }, // Kiểm tra ngày xuất bản đã qua hoặc bằng ngày hiện tại
    })
      .sort({ count_view: -1 }) // Sắp xếp theo count_view giảm dần (cao nhất trước)
      .limit(10)
      .populate("category_id")
      .populate("author_id");
    // 10 bài viết mới nhất
    const articles_10_newest = await Article.find({
      status: "published",
      Release_at: { $lte: new Date() }, // Kiểm tra ngày xuất bản đã qua hoặc bằng ngày hiện tại
    })
      .sort({ Release_at: -1 }) // Sắp xếp theo count_view giảm dần (cao nhất trước)
      .limit(10)
      .populate("category_id")
      .populate("author_id");
    // top 10 chuyên mục, mỗi chuyên mục 1 bài mới nhất
    const top_10_categories_with_latest_articles = await Article.aggregate([
      {
        $match: {
          status: "published",
          category_id: { $ne: null }, // Đảm bảo bài viết có category_id
          Release_at: { $lte: new Date() }, // Lọc bài đã phát hành
        },
      },
      {
        $sort: {
          category_id: 1, // Sắp xếp theo chuyên mục
          Release_at: -1, // Bài viết mới nhất trước
        },
      },
      {
        $group: {
          _id: "$category_id", // Nhóm theo category_id
          latestArticle: { $first: "$$ROOT" }, // Lấy bài viết mới nhất trong mỗi nhóm
        },
      },
      { $limit: 10 }, // Lấy top 10 chuyên mục
      {
        $lookup: {
          from: "categories", // Tên collection của Category
          localField: "_id", // Trường liên kết (category_id)
          foreignField: "_id", // Trường _id của Category
          as: "category", // Tên trường sau khi join
        },
      },
      {
        $lookup: {
          from: "users", // Tên collection của User
          localField: "latestArticle.author_id", // Trường liên kết (author_id)
          foreignField: "_id", // Trường _id của User
          as: "author", // Tên trường sau khi join
        },
      },
      {
        $project: {
          _id: 1,
          latestArticle: 1,
          category: { $arrayElemAt: ["$category", 0] }, // Lấy category đầu tiên
          author: { $arrayElemAt: ["$author", 0] }, // Lấy author đầu tiên
        },
      },
    ]);
    res.render("guest/index", {
      layout: "main",
      isSubscriber: false,
      articles: multipleMongooseToObject(articles_10_most_view),
      featured_articles: multipleMongooseToObject(featured_articles),
      articles_10_most_view: multipleMongooseToObject(articles_10_most_view),
      articles_10_newest: multipleMongooseToObject(articles_10_newest),
      top_10_categories_with_latest_articles:
        top_10_categories_with_latest_articles, // Dữ liệu lấy từ MongoDB
      categoriesWithChildren: categoriesWithChildren,
    });
  }
  async logined(req, res) {
    const parentCategories = await Category.find({ parent_id: null });
    const categoriesWithChildren = [];

    // Use the utility function to convert Mongoose objects to plain objects
    const parentCategoriesObjects = multipleMongooseToObject(parentCategories);

    for (let parentCategory of parentCategoriesObjects) {
      const childCategories = await Category.find({
        parent_id: parentCategory._id,
      });

      // Convert the child categories to plain objects as well
      const childCategoriesObjects = multipleMongooseToObject(childCategories);

      categoriesWithChildren.push({
        parentCategory,
        childCategories: childCategoriesObjects,
      });
    }
    const startOfWeek = new Date();
    //3-4 bài viết nổi bật trong tuần
    startOfWeek.setDate(startOfWeek.getDate() - 7); // Lấy ngày đầu tuần (7 ngày trước)
    const featured_articles = await Article.find({
      status: "published",
      Release_at: { $gte: startOfWeek, $lte: new Date() }, // Lấy các bài viết trong tuần qua
    })
      .sort({ count_view: -1 }) // Sắp xếp theo lượt xem giảm dần
      .limit(4) // Giới hạn 3-4 bài viết
      .populate("category_id")
      .populate("author_id");
    // 10 bài viết được xem nhiều nhất
    const articles_10_most_view = await Article.find({
      status: "published",
      Release_at: { $lte: new Date() }, // Kiểm tra ngày xuất bản đã qua hoặc bằng ngày hiện tại
    })
      .sort({ count_view: -1 }) // Sắp xếp theo count_view giảm dần (cao nhất trước)
      .limit(10)
      .populate("category_id")
      .populate("author_id");
    // 10 bài viết mới nhất
    const articles_10_newest = await Article.find({
      status: "published",
      Release_at: { $lte: new Date() }, // Kiểm tra ngày xuất bản đã qua hoặc bằng ngày hiện tại
    })
      .sort({ Release_at: -1 }) // Sắp xếp theo count_view giảm dần (cao nhất trước)
      .limit(10)
      .populate("category_id")
      .populate("author_id");
    // top 10 chuyên mục, mỗi chuyên mục 1 bài mới nhất
    const top_10_categories_with_latest_articles = await Article.aggregate([
      {
        $match: {
          status: "published",
          category_id: { $ne: null }, // Đảm bảo bài viết có category_id
          Release_at: { $lte: new Date() }, // Lọc bài đã phát hành
        },
      },
      {
        $sort: {
          category_id: 1, // Sắp xếp theo chuyên mục
          Release_at: -1, // Bài viết mới nhất trước
        },
      },
      {
        $group: {
          _id: "$category_id", // Nhóm theo category_id
          latestArticle: { $first: "$$ROOT" }, // Lấy bài viết mới nhất trong mỗi nhóm
        },
      },
      { $limit: 10 }, // Lấy top 10 chuyên mục
      {
        $lookup: {
          from: "categories", // Tên collection của Category
          localField: "_id", // Trường liên kết (category_id)
          foreignField: "_id", // Trường _id của Category
          as: "category", // Tên trường sau khi join
        },
      },
      {
        $lookup: {
          from: "users", // Tên collection của User
          localField: "latestArticle.author_id", // Trường liên kết (author_id)
          foreignField: "_id", // Trường _id của User
          as: "author", // Tên trường sau khi join
        },
      },
      {
        $project: {
          _id: 1,
          latestArticle: 1,
          category: { $arrayElemAt: ["$category", 0] }, // Lấy category đầu tiên
          author: { $arrayElemAt: ["$author", 0] }, // Lấy author đầu tiên
        },
      },
    ]);
    console.log(categoriesWithChildren);
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    res.render("guest/index", {
      layout: "logined",
      isSubscriber: false,
      articles: multipleMongooseToObject(articles_10_most_view),
      featured_articles: multipleMongooseToObject(featured_articles),
      articles_10_most_view: multipleMongooseToObject(articles_10_most_view),
      articles_10_newest: multipleMongooseToObject(articles_10_newest),
      top_10_categories_with_latest_articles:
        top_10_categories_with_latest_articles, // Dữ liệu lấy từ MongoDB
      profile: mongooseToObject(profile),
      categoriesWithChildren: categoriesWithChildren,
    });
  }
  async detailArticle(req, res, next) {
    const parentCategories = await Category.find({ parent_id: null });
    const categoriesWithChildren = [];

    // Use the utility function to convert Mongoose objects to plain objects
    const parentCategoriesObjects = multipleMongooseToObject(parentCategories);

    for (let parentCategory of parentCategoriesObjects) {
      const childCategories = await Category.find({
        parent_id: parentCategory._id,
      });

      // Convert the child categories to plain objects as well
      const childCategoriesObjects = multipleMongooseToObject(childCategories);

      categoriesWithChildren.push({
        parentCategory,
        childCategories: childCategoriesObjects,
      });
    }
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
    const articles = await Article.find({
      status: "published",
      _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
      Release_at: { $lte: new Date() },
    })
      .limit(4)
      .populate("category_id", "name")
      .populate("author_id");
    const profile = await User.findById(req.session.userId);
    const comments = await Comment.find({ article_id: req.params.id }).populate(
      "user_id",
      "username image _id"
    );

    const filteredCommentAuthor = comments.filter((item) =>
      item.user_id._id.equals(req.session.userId)
    );
    const filteredCommentDiffAuthor = comments.filter(
      (item) => !item.user_id._id.equals(req.session.userId)
    );
    if (article.type === "none") {
      if (profile === null) {
        await Article.findByIdAndUpdate(req.params.id, {
          $inc: { count_view: 1 }, // Tăng count_view thêm 1
        });
        return res.render("guest/article", {
          layout: "main",
          article: mongooseToObject(article),
          articles: multipleMongooseToObject(articles),
          articleTags: multipleMongooseToObject(articleTags),
          comments: multipleMongooseToObject(comments),
          categoriesWithChildren: categoriesWithChildren,
        });
      }
      await Article.findByIdAndUpdate(req.params.id, {
        $inc: { count_view: 1 }, // Tăng count_view thêm 1
      });
      res.render("guest/article", {
        layout: "logined",
        article: mongooseToObject(article),
        articles: multipleMongooseToObject(articles),
        profile: mongooseToObject(profile),
        articleTags: multipleMongooseToObject(articleTags),
        commentAuthor: multipleMongooseToObject(filteredCommentAuthor),
        commentAll: multipleMongooseToObject(filteredCommentDiffAuthor),
        categoriesWithChildren: categoriesWithChildren,
      });
    } else {
      if (profile === null) {
        return res.render("errors/not_authorized", { layout: "error" });
      }
      if (profile.role !== "guest") {
        await Article.findByIdAndUpdate(req.params.id, {
          $inc: { count_view: 1 }, // Tăng count_view thêm 1
        });
        res.render("guest/article", {
          layout: "logined",
          article: mongooseToObject(article),
          articles: multipleMongooseToObject(articles),
          profile: mongooseToObject(profile),
          articleTags: multipleMongooseToObject(articleTags),
          commentAuthor: multipleMongooseToObject(filteredCommentAuthor),
          commentAll: multipleMongooseToObject(filteredCommentDiffAuthor),
          categoriesWithChildren: categoriesWithChildren,
        });
      } else {
        return res.render("errors/not_authorized", {
          layout: "error",
        });
      }
    }
  }
  async commentArticle(req, res) {
    if (!req.session.userId) {
      return res
        .status(401)
        .json({ message: "You need to log in to comment." });
    }
    const profile = await User.findById(req.session.userId);
    try {
      // Nhận dữ liệu từ payload
      const { content } = req.body;

      const newComment = new Comment({
        article_id: req.params.id,
        user_id: profile._id,
        content,
      });

      // Lưu vào cơ sở dữ liệu
      await newComment.save();
      res.redirect(`/articleDetail/${req.params.id}`);
    } catch (error) {
      console.error("Error creating category:", error.message);

      // Kiểm tra lỗi nếu tên danh mục đã tồn tại
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "Category name already exists" });
      }

      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateCommentArticle(req, res) {
    try {
      const { content, comment_id } = req.body;

      const comment = await Comment.findById(req.params.id);

      await Comment.updateOne({ _id: req.params.id }, { content: content });
      res.redirect(`/articleDetail/${comment.article_id}`);
    } catch (error) {
      res.status(500).send("An error occurred while updating the category.");
    }
  }
  // Trang danh mục
  async category(req, res) {
    const parentCategories = await Category.find({ parent_id: null });
    const categoriesWithChildren = [];

    // Use the utility function to convert Mongoose objects to plain objects
    const parentCategoriesObjects = multipleMongooseToObject(parentCategories);

    for (let parentCategory of parentCategoriesObjects) {
      const childCategories = await Category.find({
        parent_id: parentCategory._id,
      });

      // Convert the child categories to plain objects as well
      const childCategoriesObjects = multipleMongooseToObject(childCategories);

      categoriesWithChildren.push({
        parentCategory,
        childCategories: childCategoriesObjects,
      });
    }
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
        categoriesWithChildren: categoriesWithChildren,
      });
    }
  }
  async author(req, res) {
    const parentCategories = await Category.find({ parent_id: null });
    const categoriesWithChildren = [];

    // Use the utility function to convert Mongoose objects to plain objects
    const parentCategoriesObjects = multipleMongooseToObject(parentCategories);

    for (let parentCategory of parentCategoriesObjects) {
      const childCategories = await Category.find({
        parent_id: parentCategory._id,
      });

      // Convert the child categories to plain objects as well
      const childCategoriesObjects = multipleMongooseToObject(childCategories);

      categoriesWithChildren.push({
        parentCategory,
        childCategories: childCategoriesObjects,
      });
    }
    const profile = await User.findById(req.session.userId);
    if (profile === null) {
      const articles = await Article.find({ author_id: req.params.id })
        .populate("category_id")
        .populate("author_id");
      res.render("search", {
        layout: "main",
        articles: multipleMongooseToObject(articles),
        categoriesWithChildren: categoriesWithChildren,
      });
    } else {
      const articles = await Article.find({ author_id: req.params.id })
        .populate("category_id")
        .populate("author_id");
      res.render("search", {
        layout: "logined",
        articles: multipleMongooseToObject(articles),
        profile: mongooseToObject(profile),
        categoriesWithChildren: categoriesWithChildren,
      });
    }
  }
  // Trang tag
  async tag(req, res) {
    const parentCategories = await Category.find({ parent_id: null });
    const categoriesWithChildren = [];

    // Use the utility function to convert Mongoose objects to plain objects
    const parentCategoriesObjects = multipleMongooseToObject(parentCategories);

    for (let parentCategory of parentCategoriesObjects) {
      const childCategories = await Category.find({
        parent_id: parentCategory._id,
      });

      // Convert the child categories to plain objects as well
      const childCategoriesObjects = multipleMongooseToObject(childCategories);

      categoriesWithChildren.push({
        parentCategory,
        childCategories: childCategoriesObjects,
      });
    }
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
        categoriesWithChildren: categoriesWithChildren,
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
        categoriesWithChildren: categoriesWithChildren,
      });
    }
  }

  // Trang tìm kiếm
  async search(req, res) {
    const parentCategories = await Category.find({ parent_id: null });
    const categoriesWithChildren = [];

    // Use the utility function to convert Mongoose objects to plain objects
    const parentCategoriesObjects = multipleMongooseToObject(parentCategories);

    for (let parentCategory of parentCategoriesObjects) {
      const childCategories = await Category.find({
        parent_id: parentCategory._id,
      });

      // Convert the child categories to plain objects as well
      const childCategoriesObjects = multipleMongooseToObject(childCategories);

      categoriesWithChildren.push({
        parentCategory,
        childCategories: childCategoriesObjects,
      });
    }
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
          categoriesWithChildren: categoriesWithChildren,
        });
      }
      res.render("search", {
        layout: "logined",
        articles: multipleMongooseToObject(articles),
        profile: mongooseToObject(profile),
        categoriesWithChildren: categoriesWithChildren,
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
      // profile.role = "subscriber";
      // await profile.save();

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
      plans: multipleMongooseToObject(plans),
    });
  }
}


// Xuất một thể hiện của GuestController
module.exports = new GuestController();
