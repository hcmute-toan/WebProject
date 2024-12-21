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
}
module.exports = new ContactController();
