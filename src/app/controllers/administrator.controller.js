const mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const { multipleMongooseToObject } = require("../../util/mongose");
const { mongooseToObject } = require("../../util/mongose");
const { category } = require("./guest.controller");
class AdministratorController {
  // Trang dashboard của admin
  async dashboard(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    if (profile.role !== "administrator") {
      return res.render("errors/not_authorized", { layout: "error" });
    }
    res.render("administrator/admin_dashboard", { layout: "admin" });
  }

  // Quản lý bài viết
  manageArticles(req, res) {
    res.render("administrator/manage_articles", { layout: "admin" });
  }

  // Quản lý người dùng
  manageUsers(req, res) {
    res.render("administrator/manage_users", { layout: "admin" });
  }

  // Quản lý danh mục

  async manageCategories(req, res) {
    try {
      // Fetch categories and populate parent_id with the parent category's data
      const categories = await Category.find({}).populate("parent_id", "name");

      res.render("administrator/manage_categories", {
        layout: "admin",
        category: multipleMongooseToObject(categories), // Use your utility to convert to an object
      });
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      res.status(500).send("Internal server error");
    }
  }
  async manageAddCategories(req, res) {
    try {
      // Lấy tất cả danh mục, bao gồm thông tin về parent_id
      const categoryParent = await Category.find({}).populate(
        "parent_id",
        "name"
      );
      const category = categoryParent.filter((item) => item.parent_id === null);
      res.render("administrator/manage_add_categories", {
        layout: "admin",
        category: multipleMongooseToObject(category), // Chuyển đổi dữ liệu Mongoose
      });
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async manageSaveCategories(req, res) {
    try {
      // Nhận dữ liệu từ payload
      const { name, parent_id } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }

      // Tạo danh mục mới
      const newCategory = new Category({
        name,
        parent_id: parent_id || null, // Gán `null` nếu không có danh mục cha
      });

      // Lưu vào cơ sở dữ liệu
      await newCategory.save();

      // Chuyển hướng hoặc phản hồi JSON thành công
      res.redirect("/admin/manage-categories");
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
  async manageSaveUpdateCategories(req, res) {
    try {
      const { name, parent_id } = req.body;

      // Xử lý parent_id: nếu null hoặc undefined, gán giá trị null
      const validParentId = parent_id || null;

      // Cập nhật category với giá trị parent_id (có thể là null)
      await Category.updateOne(
        { _id: req.params.id },
        { name, parent_id: validParentId }
      );
      res.redirect("/admin/manage-categories");
    } catch (error) {
      res.status(500).send("An error occurred while updating the category.");
    }
  }

  // Quản lý thẻ
  async deleteCategory(req, res) {
    try {
      // Lấy id từ req.params
      const { id } = req.params; // Correct way to get the ID from params

      // Kiểm tra nếu id không được cung cấp
      if (!id) {
        return res.status(400).send("Category ID is required.");
      }

      // Thực hiện xóa danh mục từ cơ sở dữ liệu
      const deletedCategory = await Category.findByIdAndDelete(id);

      // Kiểm tra xem có danh mục nào bị xóa không
      if (!deletedCategory) {
        return res.status(404).send("Category not found.");
      }

      // Trả về thành công
      res.send({ success: true });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).send("An error occurred while deleting the category.");
    }
  }
  manageTags(req, res) {
    res.render("administrator/manage_tags", { layout: "admin" });
  }

  // Gia hạn subscription
  extendSubscription(req, res) {
    res.render("administrator/extend_subscription", { layout: "admin" });
  }
  async manageEditCategories(req, res) {
    try {
      const categories = await Category.find({}).populate("parent_id", "name");
      const categoriesParent = categories.filter(
        (item) =>
          item.parent_id === null && item._id.toString() !== req.params.id
      );
      Category.findById(req.params.id)
        .populate("parent_id", "name")
        .then((category) =>
          res.render("administrator/manageEditCategories", {
            layout: "admin",
            category: mongooseToObject(category),
            categoriesParent: multipleMongooseToObject(categoriesParent),
          })
        );
    } catch (error) {
      console.error(
        "Error fetching category or parent categories:",
        error.message
      );
      res.status(500).send("Internal server error");
    }
  }
}

module.exports = new AdministratorController();
