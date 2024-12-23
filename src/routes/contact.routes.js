const express = require("express");
const router = express.Router();
const contactController = require("../app/controllers/contact.controller");

router.get('/', contactController.contact_us);
router.post('/send', contactController.contact_us_send);

module.exports = router; 