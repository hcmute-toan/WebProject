const auth = require("../models/userModel");
const sendOTP = require("../../services/sendOtp");
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
  async send_otp(req, res) {
   try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    const user = await auth.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Email not found in the database",
      });
    }
     const otp = await sendOTP(email); // Gửi OTP qua email
     req.session.otp = otp.otp; // Lưu OTP vào session
     req.session.email = email; // Lưu email vào session
     req.session.attempts = 0; // Đặt số lần thử về 0
     req.session.otpTime = Date.now(); // Lưu thời gian gửi OTP vào session
    // Chuyển hướng đến trang nhập OTP
    return res.redirect("/auth/otp-verification"); // Đường dẫn đến trang nhập OTP
  } catch (error) {
    console.error("Error in forgotPasswordEmailed:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while sending OTP",
    });
  }
  }
  change_password(req, res) {
    res.render("auth/change_password", { layout: "auth" });
  }
  async CheckOTP(req,res){
    try {
      const { otp } = req.body;

      // Kiểm tra OTP có được gửi trong body không
      if (!otp) {
        return res.status(400).json({
          status: "error",
          message: "OTP is required",
        });
      }

      // Lấy các giá trị từ session
      const sessionOtp = req.session.otp;
      let attempts = req.session.attempts || 0; // Nếu attempts không tồn tại, gán mặc định là 0
      const otpTime = req.session.otpTime;

      // Kiểm tra số lần thử
      if (attempts >= 5) {
        return res.status(403).json({
          status: "error",
          message: "Too many incorrect attempts. Please try again later.",
        });
      }

      // Kiểm tra xem OTP có hết hạn không (5 phút)
      const currentTime = Date.now();
      const otpExpiryTime = 5 * 60 * 1000; // 5 phút tính bằng mili giây
      if (!otpTime || currentTime - otpTime > otpExpiryTime) {
        return res.status(400).json({
          status: "error",
          message: "OTP has expired. Please request a new OTP.",
        });
      }

      // Kiểm tra OTP
      if (otp === String(sessionOtp)) {
        // Xóa OTP trong session sau khi gửi mật khẩu
        delete req.session.otp;
        delete req.session.otpTime; // Xóa thời gian gửi OTP

        // Chuyển hướng đến trang đổi mật khẩu
        return res.redirect("/auth/change_password");
      } else {
        // OTP sai, tăng số lần thử
        req.session.attempts = attempts + 1; // Tăng số lần thử
        return res.status(400).json({
          status: "error",
          message: `Incorrect OTP. You have ${
            5 - req.session.attempts
          } attempts left.`,
        });
      }
    } catch (error) {
      console.error("Error in sendGmail:", error);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while verifying OTP",
      });
    }
  }
  async changePassword(req,res){
    const {newPassword, confirmPassword} = req.body;
    const email = req.session.email;
    if(newPassword === confirmPassword)
    {
      // nếu đúng, cập nhật lại mật khẩu và chuyển về trang login
      return res.redirect("/auth/login");
    }
    else{
      return res.status(400).json({
        status: "error",
        message: "confirmPassword does not match newPassword .",
      });
    }
  }

}

module.exports = new AuthController();
