const Category = require('../models/CategoryModel');
const { multipleMongooseToObject } = require('../../util/mongose');
class SiteController {
    // [GET] /
    index(req, res, next) {
        Category.find({})
            .then((categories) => {
                res.render('home', {
                    categories: multipleMongooseToObject(categories),
                });
            })
            .catch(next); //=> {
        //   console.error(error);
        //   res.status(500).send("Server Error");
        // });
    }
    //[GET] /search
    search(req, res) {
        res.render('search');
    }
}
module.exports = new SiteController();
