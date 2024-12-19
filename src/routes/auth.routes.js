const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/auth.controller");

// Authentication
router.post("/login_check", authController.login);
router.post("/registed", authController.registed);
router.get("/register", authController.showRegister);
router.get("/reset_password", authController.reset_password);
router.post("/otp-verification", authController.send_otp);
router.get("/otp-verification", authController.otpVerification);
router.get("/change_password", authController.change_password);
router.post("/change_password", authController.CheckOTP);
router.post("/login", authController.changePassword);

module.exports = router;
