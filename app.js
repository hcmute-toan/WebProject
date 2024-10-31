// app.js
const express = require("express");
const app = express();
const indexRoutes = require("./routes/index");
const path = require("path");
const fs = require("fs");
const db = require("./config/db");

// Hàm để thực thi SQL file
const executeSQLFile = async (filePath) => {
  const sql = fs.readFileSync(filePath, "utf-8");
  await db.query(sql);
};

// Khởi động ứng dụng
const initializeApp = async () => {
  try {
    // Thực hiện các file SQL
    await executeSQLFile("./data/schema.sql"); // Thay đổi đường dẫn nếu cần
    await executeSQLFile("./data/seed.sql"); // Thay đổi đường dẫn nếu cần
    console.log("Database initialized.");

    // Thiết lập view engine
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));

    // Cấu hình để phục vụ các file tĩnh trong thư mục "public"
    app.use(express.static(path.join(__dirname, "public")));

    // Middleware xử lý JSON
    app.use(express.json());

    // Kết nối các routes
    app.use("/", indexRoutes);

    // Khởi động server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing application:", error);
  }
};

initializeApp();
