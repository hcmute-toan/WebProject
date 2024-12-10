const express = require('express');
const router = express.Router();
const subscriberController = require('../app/controllers/subscriber.controller');

// Subscriber
router.get('/dashboard', subscriberController.dashboard);
router.get('/premium-articles', subscriberController.premiumArticles);

module.exports = router;
