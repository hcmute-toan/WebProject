const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/auth.controller');

// Authentication
router.get('/login', authController.login);
router.get('/register', authController.register);
router.get('/otp-verification', authController.otpVerification);

module.exports = router;
