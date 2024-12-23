const express = require("express");
const router = express.Router();
const writerController = require("../app/controllers/writer.controller");

// Writer
router.get("/dashboard", writerController.dashboard);
router.get("/:id/edit-article", writerController.editArticle);
router.get("/write-article", writerController.writeArticle);
router.post("/create-article", writerController.createArticle);
router.get("/view-article/:id", writerController.viewArticle);
router.put("/:id/update-article", writerController.updateArticle);
router.post("/:id/deleteArticle", writerController.deleteArticle);

module.exports = router;
