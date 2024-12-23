const mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const { multipleMongooseToObject } = require("../../util/mongose");
const { mongooseToObject } = require("../../util/mongose");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
class ProfileController {
  // Trang chủ dành cho guest
  async index(req, res) {
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
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);

    res.render("profile/index", {
      layout: "logined",
      profile: mongooseToObject(profile),
      isSubscriber: false,
      categoriesWithChildren: categoriesWithChildren,
    });
  }
  async headerLogined(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);

    res.render("partials/header_logined", {
      layout: "logined",
      profile: mongooseToObject(profile),
      isSubscriber: false,
    });
  }
  async edit(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);

    // Render trang chỉnh sửa hồ sơ
    res.render("profile/edit-profile", {
      layout: "logined",
      profile: mongooseToObject(profile),
      isSubscriber: false,
    });
  }

  async editProfile(req, res) {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/"); // Folder where images will be stored
      },
      filename: (req, file, cb) => {
        // Save the file with a unique name (timestamp + file extension)
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });

    // Initialize the Multer upload middleware
    const upload = multer({
      storage: storage,
      limits: { fileSize: 5 * 1024 * 1024 },
    }).single("image");

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading image" });
      }

      const { name, email, password, newPassword } = req.body;
      const image = req.file ? req.file.filename : null; // Get the uploaded image filename
      const user = await User.findOne({ _id: req.session.userId });
      const imageUrl = image ? `/uploads/${image}` : user.image;
      //   if (!name || !email || !password || !newPassword) {
      //     return res.status(400).json({ message: "All fields are required" });
      //   }
      
      if (user.authMethod === "local") {
        const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Password is incorrect" });
      }
        let hashedPassword = null;
        if (newPassword) {
          const salt = await bcrypt.genSalt(10);
          hashedPassword = await bcrypt.hash(newPassword, salt);
        }
        await User.updateOne(
          { _id: req.session.userId },
          {
            username: name,
            email,
            password: hashedPassword,
            image: imageUrl,
            authMethod: "local",
          }
        );
        res.redirect("/profile");
      } else {
        await User.updateOne(
          { _id: req.session.userId },
          {
            username: name,
            image: imageUrl,
          }
        );
        res.redirect("/profile");
      }
    });
  }
}

// Xuất một thể hiện của GuestController
module.exports = new ProfileController();
