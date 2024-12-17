const express = require('express');
const router = express.Router();
const guestController = require('../app/controllers/guest.controller');

// Guest pages
router.get('/', guestController.index);
router.get('/article', guestController.article);
router.get('/category', guestController.category);
router.get('/tag', guestController.tag);
router.get('/search', guestController.search);

module.exports = router;
