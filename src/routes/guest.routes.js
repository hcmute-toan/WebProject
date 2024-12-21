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
router.get('/contact_us', guestController.contact_us);
router.post('/vip_register', guestController.vip_register);
router.get('/search/tag/:id', guestController.tag);
router.get('/search/category/:id', guestController.category);
router.get('/vip_registration', guestController.vip_registration);

module.exports = router;    
