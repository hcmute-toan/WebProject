const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/administrator.controller");

// Administrator
router.get("/dashboard", adminController.dashboard);

/// manage user
router.get("/manage-users", adminController.manageUsers);
router.get("/:id/manage-show-users", adminController.manageShowUsers);
router.put("/:id/manage-update-users", adminController.manageUpdateUsers);

/// manage article
router.get("/:id/manage-edit-article", adminController.manageEditArticles);
router.get("/manage-articles", adminController.manageArticles);
router.put(
  "/:id/manage-updated-articles",
  adminController.manageUpdatedArticles
);
router.post("/manage-save-article", adminController.manageAddArticle);
router.get("/manage-add-article", adminController.manageShowAddArticles);
router.get("/:id/manage-detail-article", adminController.manageSeeArticle);
router.post("/:id/manageDeleteArticle", adminController.manageDeleteArticles);

///////////////
router.get("/manage-categories", adminController.manageCategories);
//////////////////tags
router.get("/manage-tags", adminController.manageTags);
router.get("/manage-add-tags", adminController.manageShowAddTags);
router.post("/manage-save-tags", adminController.manageSaveTags);
router.get("/:id/manage-Update-tags", adminController.manageShowUpdateTags);
router.put("/:id/manage-UpdateSave-tags", adminController.manageUpdateTags);
router.post("/:id/manageDeleteTags", adminController.manageDeleteTags);
///////////////////////////
router.put("/:id/acceptToSubscriber", adminController.acceptToSubscriber);
router.get("/extend-subscription", adminController.extendSubscription);
router.get("/manage-add-extend-subscription", adminController.manageShowAddPlans);
router.post("/manage-save-extend-subscription", adminController.manageSavePlans);
router.get("/:id/manage-Update-extend-subscription", adminController.manageShowUpdatePlans);
router.put("/:id/manage-UpdateSave-extend-subscription", adminController.manageUpdatePlans);
router.post("/:id/manage-Delete-extend-subscription", adminController.manageDeletePlans);

//////////////////////////////


///////////////////////////
router.get("/manageAddCategories", adminController.manageAddCategories);
router.post("/manageSaveCategories", adminController.manageSaveCategories);
router.put(
  "/:id/manageSaveUpdateCategories",
  adminController.manageSaveUpdateCategories
);
router.post("/:id/manageDeleteCategories", adminController.deleteCategory);

router.get("/:id/manageEditCategories", adminController.manageEditCategories);
//////////////////////
router.post("/:id/deleteContactForm", adminController.contact_us_delete);

module.exports = router;
