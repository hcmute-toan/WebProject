const express = require('express');
const router = express.Router();
const editorController = require('../app/controllers/editor.controller');

// Editor
router.get('/dashboard', editorController.dashboard);
router.get('/review-article', editorController.reviewArticle);

module.exports = router;
