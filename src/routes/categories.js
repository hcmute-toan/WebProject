const express = require('express');
const router = express.Router();
const categoryController = require('../app/controllers/CategoryController');
router.get('/:slug', categoryController.show);

module.exports = router;
