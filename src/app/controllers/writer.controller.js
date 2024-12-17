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

  editArticle(req, res) {
    res.render("writer/edit_article", { layout: "dashboard" });
  }

  writeArticle(req, res) {
    res.render("writer/write_article", { layout: "dashboard" });
  }
  viewArticle(req, res) {
    res.render("writer/view_article", { layout: "dashboard" });
  }
}

module.exports = new WriterController();
