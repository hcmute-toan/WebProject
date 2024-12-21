const mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const Tag = require("../models/tagModel");
const Plan = require("../models/subscriptionPlanModel");
const { multipleMongooseToObject } = require("../../util/mongose");
const { mongooseToObject } = require("../../util/mongose");
const { category } = require("./guest.controller");
const multer = require("multer");
const path = require("path");
const ObjectId = mongoose.Types.ObjectId;
class AdministratorController {
  // Trang dashboard của admin
  async dashboard(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    if (profile.role !== "administrator") {
      return res.render("errors/not_authorized", {
        layout: "error",
      });
    }
    res.render("administrator/admin_dashboard", {
      layout: "admin",
      profile: mongooseToObject(profile),
    });
  }

  // Quản lý bài viết
  async manageArticles(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const articles = await Article.find({})
      .populate("category_id", "name _id")
      .populate("author_id", "username image");
    const profile = await User.findById(req.session.userId);
    if (profile.role !== "administrator") {
      return res.render("errors/not_authorized", {
        layout: "error",
      });
    }
    res.render("administrator/manage_articles", {
      layout: "admin",
      profile: mongooseToObject(profile),
      articles: multipleMongooseToObject(articles),
    });
  }

  async manageAddArticle(req, res) {
    try {
      if (!req.session.userId) {
        return res.redirect("/auth/register");
      }
      const profile = await User.findById(req.session.userId);
      if (profile.role !== "administrator") {
        return res.render("errors/not_authorized", {
          layout: "error",
        });
      }
      // Lấy tất cả danh mục, bao gồm thông tin về parent_id
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
        limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Limit the file size to 5MB
      }).single("image"); // The field name in the form for the image

      // Handle image upload first using Multer
      upload(req, res, async (err) => {
        if (err) {
          // If there is an error during upload
          return res.status(400).json({ message: "Error uploading image" });
        }
        // Nhận dữ liệu từ payload
        const { title, summary, content } = req.body;
        const image = req.file ? req.file.filename : null; // Get the uploaded image filename

        // Construct the image URL (relative path)
        const imageUrl = image ? `/uploads/${image}` : null;

        // Log image URL for debugging
        console.log("Image URL:", imageUrl);

        // Kiểm tra dữ liệu đầu vào
        if (!title || !summary || !imageUrl || !content) {
          return res.status(400).json({ message: "All fields are required" });
        }

        // Tạo bài viết mới với dữ liệu từ form
        const newArticle = new Article({
          title,
          summary,
          image_url: imageUrl, // Save the image URL in the database
          content,
          author_id: profile._id,
        });

        // Lưu bài viết vào cơ sở dữ liệu
        await newArticle.save();

        // Sau khi xử lý xong, redirect về trang chủ hoặc gửi phản hồi
        res.redirect("/admin/manage-articles");
      });
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async manageSeeArticle(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    if (profile.role !== "administrator") {
      return res.render("errors/not_authorized", {
        layout: "error",
      });
    }
    const article = await Article.findById(req.params.id).populate(
      "author_id",
      "username"
    );
    res.render("administrator/manage_detail_article", {
      layout: "admin",
      profile: mongooseToObject(profile),
      article: mongooseToObject(article),
    });
  }

  async manageEditArticles(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const article = await Article.findById(req.params.id).populate(
      "category_id",
      "name"
    );
    const profile = await User.findById(req.session.userId);
    const categories = await Category.find({});
    if (profile.role !== "administrator") {
      return res.render("errors/not_authorized", {
        layout: "error",
      });
    }
    res.render("administrator/manage_edit_articles", {
      layout: "admin",
      profile: mongooseToObject(profile),
      article: mongooseToObject(article),
      categories: multipleMongooseToObject(categories),
    });
  }
  async manageUpdatedArticles(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    if (profile.role !== "administrator") {
      return res.render("errors/not_authorized", {
        layout: "error",
      });
    }
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
      limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Limit the file size to 5MB
    }).single("image"); // The field name in the form for the image

    // Cập nhật category với giá trị parent_id (có thể là null)

    upload(req, res, async (err) => {
      if (err) {
        // If there is an error during upload
        return res.status(400).json({ message: "Error uploading image" });
      }

      // Nhận dữ liệu từ payload
      const { title, summary, category_id, status, content } = req.body;
      const image = req.file ? req.file.filename : null; // Get the uploaded image filename

      // Construct the image URL (relative path)
      const imageUrl = image ? `/uploads/${image}` : null;
      // Kiểm tra dữ liệu đầu vào
      if (!mongoose.Types.ObjectId.isValid(category_id)) {
        return res.status(400).send("Invalid ObjectId format");
      }

      // Use the validated ObjectId
      const validObjectId = new mongoose.Types.ObjectId(category_id);
      await Article.updateOne(
        { _id: req.params.id },
        {
          title,
          summary,
          category_id: validObjectId,
          status,
          image_url: imageUrl,
          content,
        }
      );
      res.redirect("/admin/manage-articles");
    });
  }
  async manageShowAddArticles(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    if (profile.role !== "administrator") {
      return res.render("errors/not_authorized", {
        layout: "error",
      });
    }
    res.render("administrator/manage_add_article", {
      layout: "admin",
      profile: mongooseToObject(profile),
    });
  }
  async manageDeleteArticles(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send("Article ID is required.");
      }
      const deletedArticle = await Article.findByIdAndDelete(id);
      if (!deletedArticle) {
        return res.status(404).send("Article not found.");
      }
      res.send({ success: true });
    } catch (error) {
      console.error("Error deleting Article:", error);
      res.status(500).send("An error occurred while deleting the Article.");
    }
  }
  ///////////////////////=========
  // Quản lý người dùng
  async manageUsers(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    if (profile.role !== "administrator") {
      return res.render("errors/not_authorized", {
        layout: "error",
      });
    }
    const user = await User.find({});
    res.render("administrator/manage_users", {
      layout: "admin",
      user: multipleMongooseToObject(user),
      profile: mongooseToObject(profile),
    });
  }
  async manageShowUsers(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    if (profile.role !== "administrator") {
      return res.render("errors/not_authorized", {
        layout: "error",
      });
    }
    const user = await User.findById(req.params.id);
    res.render("administrator/manage_edit_user", {
      layout: "admin",
      user: mongooseToObject(user),
      profile: mongooseToObject(profile),
    });
  }
  async manageUpdateUsers(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    if (profile.role !== "administrator") {
      return res.render("errors/not_authorized", {
        layout: "error",
      });
    }
    const { role } = req.body;

    await User.updateOne(
      { _id: req.params.id },
      {
        role,
      }
    );
    res.redirect("/admin/manage-users");
  }

  // Quản lý danh mục===================================

  async manageCategories(req, res) {
    try {
      if (!req.session.userId) {
        return res.redirect("/auth/register");
      }
      const profile = await User.findById(req.session.userId);
      if (profile.role !== "administrator") {
        return res.render("errors/not_authorized", {
          layout: "error",
        });
      }
      // Fetch categories and populate parent_id with the parent category's data
      const categories = await Category.find({}).populate("parent_id", "name");

      res.render("administrator/manage_categories", {
        layout: "admin",
        category: multipleMongooseToObject(categories), // Use your utility to convert to an object
        profile: mongooseToObject(profile),
      });
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      res.status(500).send("Internal server error");
    }
  }
  async manageAddCategories(req, res) {
    try {
      if (!req.session.userId) {
        return res.redirect("/auth/register");
      }
      const profile = await User.findById(req.session.userId);
      if (profile.role !== "administrator") {
        return res.render("errors/not_authorized", {
          layout: "error",
        });
      }
      // Lấy tất cả danh mục, bao gồm thông tin về parent_id
      const categoryParent = await Category.find({}).populate(
        "parent_id",
        "name"
      );
      const category = categoryParent.filter((item) => item.parent_id === null);
      res.render("administrator/manage_add_categories", {
        layout: "admin",
        category: multipleMongooseToObject(category), // Chuyển đổi dữ liệu Mongoose
        profile: mongooseToObject(profile),
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
  // Quản lý thẻ =============tags

  async manageTags(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    const tags = await Tag.find({});

    if (profile.role !== "administrator") {
      return res.render("errors/not_authorized", {
        layout: "error",
      });
    }
    res.render("administrator/manage_tags", {
      layout: "admin",
      profile: mongooseToObject(profile),
      tags: multipleMongooseToObject(tags),
    });
  }
  async manageShowAddTags(req, res) {
    try {
      if (!req.session.userId) {
        return res.redirect("/auth/register");
      }
      const profile = await User.findById(req.session.userId);
      if (profile.role !== "administrator") {
        return res.render("errors/not_authorized", {
          layout: "error",
        });
      }
      // Lấy tất cả danh mục, bao gồm thông tin về parent_id
      res.render("administrator/manage_add_tags", {
        layout: "admin",
        profile: mongooseToObject(profile),
      });
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async manageSaveTags(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }

      const newTags = new Tag({
        name,
      });
      await newTags.save();
      res.redirect("/admin/manage-tags");
    } catch (error) {
      console.error("Error creating category:", error.message);

      // Kiểm tra lỗi nếu tên danh mục đã tồn tại
      if (error.code === 11000) {
        return res.status(400).json({ message: "Tags name already exists" });
      }

      res.status(500).json({ message: "Internal server error" });
    }
  }
  async manageShowUpdateTags(req, res) {
    try {
      if (!req.session.userId) {
        return res.redirect("/auth/register");
      }
      const profile = await User.findById(req.session.userId);
      if (profile.role !== "administrator") {
        return res.render("errors/not_authorized", {
          layout: "error",
        });
      }
      const tag = await Tag.findById(req.params.id);
      // Lấy tất cả danh mục, bao gồm thông tin về parent_id
      res.render("administrator/manage_Update_tags", {
        layout: "admin",
        profile: mongooseToObject(profile),
        tag: mongooseToObject(tag),
      });
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async manageUpdateTags(req, res) {
    try {
      const { name } = req.body;
      await Tag.updateOne({ _id: req.params.id }, { name });
      res.redirect("/admin/manage-tags");
    } catch (error) {
      res.status(500).send("An error occurred while updating the category.");
    }
  }
  async manageDeleteTags(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send("Tag ID is required.");
      }
      const deletedTag = await Tag.findByIdAndDelete(id);
      // Kiểm tra xem có danh mục nào bị xóa không
      if (!deletedTag) {
        return res.status(404).send("Tag not found.");
      }

      // Trả về thành công
      res.send({ success: true });
    } catch (error) {
      console.error("Error deleting Tag:", error);
      res.status(500).send("An error occurred while deleting the Tag.");
    }
  }
  // Gia hạn subscription
  async extendSubscription(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/register");
    }
    const profile = await User.findById(req.session.userId);
    const plans = await Plan.find({});
    if (profile.role !== "administrator") {
      return res.render("errors/not_authorized", {
        layout: "error",
      });
    }
    res.render("administrator/extend_subscription", {
      layout: "admin",
      profile: mongooseToObject(profile),
      plans: multipleMongooseToObject(plans),
    });
  }
  async manageShowAddPlans(req, res) {
    try {
      if (!req.session.userId) {
        return res.redirect("/auth/register");
      }
      const profile = await User.findById(req.session.userId);
      if (profile.role !== "administrator") {
        return res.render("errors/not_authorized", {
          layout: "error",
        });
      }
      // Lấy tất cả danh mục, bao gồm thông tin về parent_id
      res.render("administrator/manage_add_plan", {
        layout: "admin",
        profile: mongooseToObject(profile),
      });
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async manageSavePlans(req, res) {
    try {
      const {name ,duration,originalPrice,discountedPrice,dailyCost,discountPercent,description} = req.body;
      if (!name ||!duration ||!originalPrice ||!discountedPrice ||!dailyCost ||!discountPercent ||!description) {
        return res.status(400).json({ message: "Plan is required" });
      }

      const newPlans = new Plan({
        name,
        duration,
        originalPrice,
        discountedPrice,
        dailyCost,
        discountPercent,
        description,
      });
      await newPlans.save();
      res.redirect("/admin/extend-subscription");
    } catch (error) {
      console.error("Error creating category:", error.message);

      // Kiểm tra lỗi nếu tên danh mục đã tồn tại
      if (error.code === 11000) {
        return res.status(400).json({ message: "Plan already exists" });
      }

      res.status(500).json({ message: "Internal server error" });
    }
  }
  async manageShowUpdatePlans(req, res) {
    try {
      if (!req.session.userId) {
        return res.redirect("/auth/register");
      }
      const profile = await User.findById(req.session.userId);
      if (profile.role !== "administrator") {
        return res.render("errors/not_authorized", {
          layout: "error",
        });
      }
      const plan = await Plan.findById(req.params.id);
      // Lấy tất cả danh mục, bao gồm thông tin về parent_id
      res.render("administrator/manage_update_plan", {
        layout: "admin",
        profile: mongooseToObject(profile),
        plan: mongooseToObject(plan),
      });
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async manageUpdatePlans(req, res) {
    try {
      const { name } = req.body;
      await Plan.updateOne({ _id: req.params.id }, { name ,duration,originalPrice,discountedPrice,dailyCost,discountPercent,description });
      res.redirect("/admin/extend-subscription");
    } catch (error) {
      res.status(500).send("An error occurred while updating the plan.");
    }
  }
  async manageDeletePlans(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send("Plan ID is required.");
      }
      const deletedPlan = await Plan.findByIdAndDelete(id);
      // Kiểm tra xem có danh mục nào bị xóa không
      if (!deletedPlan) {
        return res.status(404).send("Plan not found.");
      }

      // Trả về thành công
      res.send({ success: true });
    } catch (error) {
      console.error("Error deleting Plan:", error);
      res.status(500).send("An error occurred while deleting the Plan.");
    }
  }
  async manageEditCategories(req, res) {
    try {
      if (!req.session.userId) {
        return res.redirect("/auth/register");
      }
      const profile = await User.findById(req.session.userId);
      if (profile.role !== "administrator") {
        return res.render("errors/not_authorized", {
          layout: "error",
        });
      }
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
            profile: mongooseToObject(profile),
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