mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const { multipleMongooseToObject } = require("../../util/mongose");
const { mongooseToObject } = require("../../util/mongose");
const multer = require("multer");
const path = require("path");
class ContactController {
  async contact_us(req, res) {
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
      res.render("about_us/contact", {
        layout: "main",
        categoriesWithChildren: categoriesWithChildren,
      });
    } else {
      res.render("about_us/contact", {
        layout: "logined",
        profile: mongooseToObject(profile),
        categoriesWithChildren: categoriesWithChildren,
      });
    }
  }
}
module.exports = new ContactController();
