const express = require('express');
const router = express.Router();
const guestController = require('../app/controllers/guest.controller');

// Guest pages
router.get('/', guestController.index);
router.get('/logined', guestController.logined);
router.get('/articleDetail/:id', guestController.detailArticle);
router.get('/category', guestController.category);
router.get('/tag', guestController.tag);
router.get('/search', guestController.search);

module.exports = router;    
