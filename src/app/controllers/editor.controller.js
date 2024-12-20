const Article = require("../models/articleModel");
const mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Tag = require("../models/tagModel");
const CategoryTag = require("../models/articleTagModel");
const User = require("../models/userModel");
const { multipleMongooseToObject } = require("../../util/mongose");
const { mongooseToObject } = require("../../util/mongose");

class EditorController {
  async dashboard(req, res) {
    try {
      if (!req.session.userId) {
        return res.redirect("/auth/register");
      }
      const profile = await User.findById(req.session.userId);
      if (profile.role !== "editor") {
        return res.render("errors/not_authorized", { layout: "error" });
      }
      const { filter } = req.query; // Retrieve the filter query parameter
      // Determine the filter condition based on the query
      let filterCondition = {};
      if (filter === "draft") {
        filterCondition.status = "draft";
      } else if (filter === "rejected") {
        filterCondition.status = "rejected";
      } else if (filter === "published") {
        filterCondition.status = "published"; // Filter for published articles
      } // No condition for 'all', fetch all articles.

      // Fetch articles from the database based on the filter
      const articles = await Article.find(filterCondition)
        .populate("category_id")
        .populate("author_id")
        .lean();

      const categoryParent = await Category.find({});

      // Render the dashboard template with the filtered articles
      res.render("editor/editor_dashboard", {
        layout: "dashboard",
        articles: articles,
        category: multipleMongooseToObject(categoryParent),
        currentFilter: filter || "all", // Track the current filter
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi Server");
    }
  }

  async rejectArticle(req, res) {
    try {
      const { id } = req.params; // Lấy ID bài viết từ URL
      console.log(id);
      console.log("Đang xử lý từ chối bài viết với ID:", id);

      // Cập nhật trạng thái bài viết thành 'rejected'
      const result = await Article.findByIdAndUpdate(id, {
        status: "rejected",
      });
      if (!result) {
        console.error(`Không tìm thấy bài viết với ID: ${id}`);
        return res.status(404).send("Không tìm thấy bài viết");
      }

      console.log("Từ chối bài viết thành công:", result);

      // Redirect quay lại trang dashboard với filter hiện tại (nếu có)
      const { filter } = req.query;
      res.redirect(`/editor/dashboard${filter ? `?filter=${filter}` : ""}`);
    } catch (err) {
      console.error("Lỗi khi từ chối bài viết:", err);
      res.status(500).send("Lỗi Server");
    }
  }

  async approveArticle(req, res) {
    try {
      const articleId = req.params.id;
      const { category, tags, publishDate } = req.body;

      // 1. Cập nhật bài viết: thay đổi trạng thái và ngày phát hành
      const article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).send("Article not found");
      }

      article.status = "published";
      article.Release_at = new Date(publishDate);
      article.category_id = category; // Giả sử bạn đã có category trong database
      await article.save();

      // 2. Xử lý tags:
      // Tách tags thành mảng bằng cách loại bỏ khoảng trắng thừa và chia theo dấu phẩy
      const tagNames = tags
        .split(",") // Tách chuỗi thành mảng bằng dấu phẩy
        .map(tag => removeDiacritics(tag.trim().toLowerCase())) // Loại bỏ khoảng trắng thừa
        .filter((tag) => tag.length > 0); // Loại bỏ các tag trống (nếu có)

      // Lặp qua từng tag để tạo hoặc tìm tag trong database
      const tagIds = [];
      for (const tagName of tagNames) {
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          // Nếu tag chưa tồn tại, tạo mới
          tag = await Tag.create({
            name: tagName,
            created_at: Date.now(),
            updated_at: Date.now(),
          });
        }
        tagIds.push(tag.id); // Lưu lại ID của tag
      }

      // 3. Liên kết từng tag với bài viết (ArticleTag)
      for (const tagId of tagIds) {
        await CategoryTag.create({
          article_id: articleId,
          tag_id: tagId,
        });
      }

      // 4. Quay lại trang quản lý bài viết
      res.redirect("/editor/dashboard");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  async reviewArticle(req, res) {
    const article = await Article.findById(req.params.id);
    console.log(article);
    res.render("editor/review_article", { article: mongooseToObject(article) });
  }
}
function removeDiacritics(str) {
  return str
    .normalize("NFD") // Chuẩn hóa chuỗi Unicode thành dạng decomposed
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/đ/g, "d") // Thay thế chữ "đ" thường
    .replace(/Đ/g, "D"); // Thay thế chữ "Đ" hoa
}


module.exports = new EditorController();
