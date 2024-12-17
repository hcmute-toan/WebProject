const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/auth.controller');

// Authentication
router.get('/login', authController.login);
router.get('/register', authController.register);
router.get('/otp-verification', authController.otpVerification);
router.get('/reset_password', authController.reset_password);
router.get('/change_password', authController.change_password);
module.exports = router;
