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

  reset_password(req, res) {
    res.render("auth/reset_password", { layout: "auth" });
  }
  change_password(req, res) {
    res.render("auth/change_password", { layout: "auth" });
  }
}

module.exports = new AuthController();
