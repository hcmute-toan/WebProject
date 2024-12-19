const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/administrator.controller");

// Administrator
router.get("/dashboard", adminController.dashboard);
router.get("/manage-articles", adminController.manageArticles);
router.get("/manage-users", adminController.manageUsers);
router.get("/manage-categories", adminController.manageCategories);
router.get("/manage-tags", adminController.manageTags);
router.get("/extend-subscription", adminController.extendSubscription);
router.get("/manageAddCategories", adminController.manageAddCategories);
router.post("/manageSaveCategories", adminController.manageSaveCategories);
router.put(
  "/:id/manageSaveUpdateCategories",
  adminController.manageSaveUpdateCategories
);
router.post("/:id/manageDeleteCategories", adminController.deleteCategory);
router.get("/:id/manageEditCategories", adminController.manageEditCategories);

module.exports = router;
