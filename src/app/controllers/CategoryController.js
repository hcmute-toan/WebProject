const Category = require("../models/CategoryModel");
const { multipleMongooseToObject } = require("../../util/mongose");
class CategoryController {
  //[GET] /category/:slug
  show(req, res) {
    res.send("Category Detail");
  }
}
module.exports = new CategoryController();
