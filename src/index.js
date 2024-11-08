const express = require("express");
const path = require("path");
const morgan = require("morgan");
const { engine } = require("express-handlebars"); // Use destructuring here
const app = express();
const port = 3000;
const route = require("./routes");
const db = require("./config/db");
// Connect to db
db.connect();
// Static file
app.use(express.static(path.join(__dirname, "public")));
// HTTP logger
app.use(morgan("combined"));
// Template engine
app.engine("hbs", engine({ extname: ".hbs" })); // Use 'engine' instead of 'exphbs'
app.set("view engine", "hbs");
// Set the views directory
app.set("views", path.join(__dirname, "resources", "views")); // Use commas instead of backslashes
//Route init
route(app);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
