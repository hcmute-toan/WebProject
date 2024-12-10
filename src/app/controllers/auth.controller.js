class AuthController {
  // Đăng nhập
  login(req, res) {
    res.render("auth/authActive", { layout: "auth" });
  }

  // Đăng ký
  register(req, res) {
    res.render("auth/authActive", { layout: "auth" });
  }

  // Xác minh OTP
  otpVerification(req, res) {
    res.render("auth/otp_verification", { layout: "auth" });
  }
}

module.exports = new AuthController();
