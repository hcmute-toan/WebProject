// config/db.js
const mysql = require("mysql2/promise"); // Sử dụng mysql2/promise
require("dotenv").config();

// Tạo một kết nối pool để quản lý các kết nối
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Xuất ra db
module.exports = db;
