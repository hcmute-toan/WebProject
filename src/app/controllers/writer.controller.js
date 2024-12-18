const Article = require("../models/articleModel");
const mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
class WriterController {
  async dashboard(req, res) {
    try {
      const articles = await Article.find({}).populate("category_id").lean();
      console.log(articles);
      res.render("writer/writer_dashboard", {
        layout: "dashboard",
        articles: articles,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi Server");
    }
  }

  async editArticle(req, res) {
    try {
      const articleId = req.params.id; // Lấy ID từ URL
      const article = await Article.findById(articleId).lean(); // Tìm bài viết theo ID

      if (!article) {
        return res.status(404).send("Article not found"); // Nếu không tìm thấy bài viết
      }

      // Render form edit với dữ liệu bài viết
      res.render("writer/edit_article", {
        layout: "dashboard", // layout cho form
        article, // Truyền dữ liệu bài viết vào view
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  async updateArticle(req, res) {
    try {
      console.log("hehehehe");
      console.log(req.body); 
      const { title, summary, content, category_id } = req.body;
      const articleId = req.params.id;

      if (!title || !summary || !content) {
        return res
          .status(400)
          .send("Missing required fields: title, summary, or content");
      }

      const article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).send("Article not found");
      }

      article.title = title;
      article.summary = summary;
      article.content = content;
      article.category_id = category_id || article.category_id;
      article.status ="draft";

      if (req.file) {
        article.image_url = req.file.path;
      }

      await article.save();
      res.redirect("/writer/dashboard");
    } catch (error) {
      console.error("Error details:", error);
      res.status(500).send("Error updating article: " + error.message);
    }
  }

  writeArticle(req, res) {
    res.render("writer/write_article", { layout: "dashboard" });
  }

  viewArticle(req, res) {
    res.render("writer/view_article", { layout: "dashboard" });
  }
}

module.exports = new WriterController();
