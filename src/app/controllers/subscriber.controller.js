mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
const Article = require("../models/articleModel");
const { multipleMongooseToObject } = require("../../util/mongose");
const { mongooseToObject } = require("../../util/mongose");
const multer = require("multer");
const path = require("path");
class SubscriberController {
    async dashboard(req, res) {
        const articles = await Article.find({type : 'pre'}).populate("category_id", "name");
        res.render('subscriber/subscriber_dashboard', { layout: 'main', isSubscriber: true , articles : multipleMongooseToObject(articles)} );
    }

    async articleDetail(req, res,next) {
    const articles = await Article.find({}).populate("category_id", "name");

    }
}

module.exports = new SubscriberController();
