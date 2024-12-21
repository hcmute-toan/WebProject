const mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const { multipleMongooseToObject } = require("../../util/mongose");
const { mongooseToObject } = require("../../util/mongose");
const multer = require("multer");
const path = require("path");
class WriterController {
  //// multer

  /////
  async dashboard(req, res) {
    try {
      if (!req.session.userId) {
        return res.redirect("/auth/register");
      }
      const profile = await User.findById(req.session.userId);
      if (profile.role !== "writer") {
        return res.render("errors/not_authorized", { layout: "error" });
      }
      const articles = await Article.find({ author_id: req.session.userId })
        .populate("category_id")
        .lean();
      // console.log(articles);
      res.render("writer/writer_dashboard", {
        layout: "dashboard",
        articles: articles,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error!!!");
    }
  }

  async editArticle(req, res) {
    try {
      // Fetch categories with parent_id populated
      const categories = await Category.find({}).populate("parent_id", "name");

      // Fetch the article by ID and populate its category
      const article = await Article.findById(req.params.id).populate(
        "category_id",
        "name"
      );

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Filter categories to exclude the current category of the article
      const filteredCategories = categories.filter(
        (item) => item._id.toString() !== article.category_id?._id.toString()
      );

      // Render the edit article page
      res.render("writer/edit_article", {
        layout: "dashboard",
        article: mongooseToObject(article), // Convert Mongoose document to plain object
        category: multipleMongooseToObject(filteredCategories), // Transform categories list
      });
    } catch (error) {
      console.error("Error in editArticle:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async writeArticle(req, res) {
    const categories = await Category.find({});
    res.render("writer/write_article", {
      layout: "dashboard",
      categories: multipleMongooseToObject(categories),
    });
  }
  async viewArticle(req, res) {
    const article = await Article.findById(req.params.id).populate("author_id");
        res.render("writer/view_article", {layout:"error", article: mongooseToObject(article) });
  }

  async updateArticle(req, res) {
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
      const { title, summary, content } = req.body;
      const image = req.file ? req.file.filename : null; // Get the uploaded image filename

      // Construct the image URL (relative path)
      const imageUrl = image ? `/uploads/${image}` : null;
      // Kiểm tra dữ liệu đầu vào
      if (!title || !summary || !imageUrl || !content) {
        return res.status(400).json({ message: "All fields are required" });
      }

      await Article.updateOne(
        { _id: req.params.id },
        {
          title,
          summary,
          image_url: imageUrl,
          content,
          status: "draft",
        }
      );
      res.redirect("/writer/dashboard");
    });
  }
  catch(error) {
    res.status(500).send("An error occurred while updating the category.");
  }

  async createArticle(req, res) {
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

    try {
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
          author_id: req.session.userId,
        });
        // Lưu bài viết vào cơ sở dữ liệu
        await newArticle.save();

        // Sau khi xử lý xong, redirect về trang chủ hoặc gửi phản hồi
        res.redirect("/writer/dashboard");
      });
    } catch (error) {
      console.error("Error during article creation:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async deleteArticle(req, res) {
    try {
      // Lấy id từ req.params
      const { id } = req.params; // Correct way to get the ID from params

      // Kiểm tra nếu id không được cung cấp
      if (!id) {
        return res.status(400).send("Article ID is required.");
      }

      // Thực hiện xóa danh mục từ cơ sở dữ liệu
      const deletedArticle = await Article.findByIdAndDelete(id);

      // Kiểm tra xem có danh mục nào bị xóa không
      if (!deletedArticle) {
        return res.status(404).send("Category not found.");
      }
      // Trả về thành công
      res.send({ success: true });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).send("An error occurred while deleting the category.");
    }
  }
}

module.exports = new WriterController();
