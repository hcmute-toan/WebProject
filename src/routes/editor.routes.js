const express = require("express");
const router = express.Router();
const editorController = require("../app/controllers/editor.controller");

// Editor
router.get("/dashboard", editorController.dashboard);
router.get("/review-article/:id", editorController.reviewArticle);
router.post("/reject-article/:id", editorController.rejectArticle);
router.post("/approve-article/:id", editorController.approveArticle);
module.exports = router;
