const express = require("express");
const router = express.Router();
const profileController = require("../app/controllers/profile.controller");

// Guest pages
router.get("/", profileController.index);
router.get("/edit", profileController.edit);
router.put("/edit-profile", profileController.editProfile);

module.exports = router;