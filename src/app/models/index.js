// index.js
const Article = require("./articleModel");
const ArticleTag = require("./articleTagModel");
const Category = require("./categoryModel");
const Comment = require("./commentModel");
const Subscription = require("./subscriptionModel");
const Tag = require("./tagModel");
const User = require("./userModel");

// Đóng gói tất cả các model vào một đối tượng
const models = {
  Article,
  ArticleTag,
  Category,
  Comment,
  Subscription,
  Tag,
  User,
};

// Xuất ra để sử dụng ở nơi khác
module.exports = models;
