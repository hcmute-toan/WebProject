const express = require('express');
const router = express.Router();
const writerController = require('../app/controllers/writer.controller');

// Writer
router.get('/dashboard', writerController.dashboard);
router.get('/edit-article', writerController.editArticle);
router.get('/write-article', writerController.writeArticle);

module.exports = router;
