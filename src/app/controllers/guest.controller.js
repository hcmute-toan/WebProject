const mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Article = require("../models/articleModel");
const { multipleMongooseToObject } = require("../../util/mongose");
const { mongooseToObject } = require("../../util/mongose");
const multer = require("multer");
const path = require("path");
class GuestController {
    // Trang chủ dành cho guest
    async index(req, res) {
        const articles = await Article.find({}).populate("category_id", "name");
        res.render('guest/index', { layout: 'main', isSubscriber: false , articles : multipleMongooseToObject(articles)} );
    }   
    async logined(req, res) {
        const articles = await Article.find({}).populate("category_id", "name");
        res.render('guest/index', { layout: 'logined', isSubscriber: false , articles : multipleMongooseToObject(articles)} );
    }
   async detailArticle(req, res,next) {
        // Article.findById({_id : req.params.id})
        //     .then(( article ) =>
        //         res.render('guest/article'),{article : mongooseToObject(article)}
        //     )
        //     .catch(next);
        const article = await Article.findById(req.params.id);
        res.render('guest/article',{content : article.content})
    }
    // Trang danh mục
    category(req, res) {
        res.render('guest/category', { layout: 'main', isSubscriber: false });
    }

    // Trang tag
    tag(req, res) {
        res.render('guest/tag', { layout: 'main', isSubscriber: false });
    }

    // Trang tìm kiếm
    search(req, res) {
        res.render('guest/search', { layout: 'main', isSubscriber: false });
    }
}

// Xuất một thể hiện của GuestController
module.exports = new GuestController();
