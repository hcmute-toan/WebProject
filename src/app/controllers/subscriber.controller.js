mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const { multipleMongooseToObject } = require("../../util/mongose");
const { mongooseToObject } = require("../../util/mongose");
const multer = require("multer");
const path = require("path");
class SubscriberController {
  async dashboard(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    if (profile.role !== "subscriber") {
        return res.render("errors/not_authorized",{ layout: "error" });
    }
    const articles = await Article.find({ type: "pre" }).populate(
      "category_id",
      "name"
    );
    res.render("subscriber/subscriber_dashboard", {
      layout: "main",
      isSubscriber: true,
      articles: multipleMongooseToObject(articles),
    });
  }

  async articleDetail(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    if (profile.role !== "subscriber") {
        return res.render("errors/not_authorized",{ layout: "error" });
    }
    const article = await Article.findById(req.params.id);
    const articles = await Article.find({}).populate("category_id", "name");
    res.render("subscriber/articleDetail", {
      article: mongooseToObject(article),
      articles: multipleMongooseToObject(articles),
    });
  }
}

module.exports = new SubscriberController();
