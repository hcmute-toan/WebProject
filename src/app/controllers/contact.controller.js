mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const ContactForm = require("../models/contactFormModel");

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
  async contact_us_send(req, res) {
    const { name, email, subject, message} = req.body;
    const userId = req.session.userId;
    if(userId === null)
    {
      return res.redirect("/auth/register");
    }
    if ( !name || !email || !subject || !message) {
          return res.status(400).json({ message: " All input is required" });
        }
    const newContact = new ContactForm({
      name : name,
      email :email,
      subject:subject,
      message:message,
    });
    await newContact.save();
    res.redirect("/contact_us"); // Hoặc alert từ phía client
  }

}
module.exports = new ContactController();
