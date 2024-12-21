const express = require("express");
const path = require("path");
const morgan = require("morgan");
const { engine } = require("express-handlebars"); // Use destructuring here
const app = express();
const port = 3000;
const route = require("./routes");
const db = require("./config/db");
const moment = require("moment");
var methodOverride = require("method-override");
const multer = require("multer");
const session = require("express-session");
const passport = require('passport');


// Đăng ký helper 'eq' để so sánh hai giá trị
const handlebars = require("handlebars");
handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});
handlebars.registerHelper('or', function (arg1, arg2) {
  return arg1 || arg2;
});
handlebars.registerHelper("formatDate", function (date) {
  return moment(date).format("DD/MM/YYYY"); // Định dạng theo kiểu 'DD/MM/YYYY'
});
handlebars.registerHelper("increment", function (index) {
  return index + 1; // Tăng chỉ số lên 1
});
app.use("/uploads", express.static("uploads"));
// Connect to db
db.connect();
// Static file
app.use(express.static(path.join(__dirname, "public")));
// HTTP logger
app.use(morgan("combined"));
// Template engine
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "resources", "views", "layouts"),
    partialsDir: path.join(__dirname, "resources", "views", "partials"),
    allowProtoPropertiesByDefault: true,
  })
); // Use 'engine' instead of 'exphbs'
////// multer

// Serve static files (like images) from the 'uploads' folder
/////////
app.set("view engine", "hbs");
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key", // Chìa khóa bí mật dùng để ký cookie session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Nếu bạn dùng HTTPS, hãy đổi secure: true
  })
);
// Cấu hình passport
app.use(passport.initialize());
app.use(passport.session());
// Set the views directory
app.set("views", path.join(__dirname, "resources", "views")); // Use commas instead of backslashes
//Route init
route(app);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
