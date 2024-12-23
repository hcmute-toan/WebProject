const auth = require("../models/userModel");
const sendOTP = require("../../services/sendOtp");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const passport = require("../../config/passport/passport");
class AuthController {
  // Đăng nhập
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Please enter email and password" });
      }

      const user = await User.findOne({ email: email, authMethod: "local" });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect" });
      }
      req.session.userId = user._id;
      req.session.role = user.role;
      ////////////////
      res.redirect("/logined");
    } catch (error) {
      console.error("Error during login:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Đăng ký
  showRegister(req, res) {
    res.render("auth/authActive", { layout: "auth" });
  }
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Cannot log out');
      }
      // Chuyển hướng người dùng về trang login hoặc trang chủ sau khi đăng xuất
      res.redirect('/auth/register');
    });
  }
  async registed(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check for existing user
      const existingUser = await User.findOne({
        email: email,
        authMethod: "local",
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create and save new user
      const newUser = new User({
        username,
        email,
        password,
        authMethod: "local", // Will be hashed in the schema's pre-save hook
      });

      await newUser.save();
      res.redirect("/auth/register");
    } catch (error) {
      console.error("Error during registration:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
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

      const user = await auth.findOne({ email: email, authMethod: "local" });
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
  async CheckOTP(req, res) {
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
  async changePassword(req, res) {
    const { newPassword, confirmPassword } = req.body;
    const email = req.session.email;
    if (newPassword === confirmPassword) {
      let hashedPassword = null;
      if (newPassword) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(newPassword, salt);
      }
      await User.updateOne(
        { email: req.session.email, authMethod: "local" },
        {
          password: hashedPassword,
        }
      );
      // nếu đúng, cập nhật lại mật khẩu và chuyển về trang login
      return res.redirect("/auth/register");
    } else {
      return res.status(400).json({
        status: "error",
        message: "confirmPassword does not match newPassword .",
      });
    }
  }
  // Route bắt đầu Google Sign-In
  googleLogin(req, res, next) {
    console.log("Authenticating with Google...");
    passport.authenticate("google", {
      scope: ["profile", "email"], // yêu cầu quyền truy cập thông tin profile và email
    })(req, res, next); // Xử lý xác thực Google
  }

  // Route callback sau khi đăng nhập Google thành công
  googleCallback(req, res, next) {
    passport.authenticate(
      "google",
      { failureRedirect: "/auth/register" },
      (err, user) => {
        if (err) {
          console.error("Google authentication error:", err); // Log lỗi nếu có
          return res
            .status(500)
            .json({ message: "Failed to authenticate with Google" });
        }

        if (!user) {
          console.error("No user found during Google authentication"); // Log khi không có user
          return res
            .status(400)
            .json({ message: "Failed to authenticate with Google" });
        }

        // Sau khi xác thực thành công, đăng nhập người dùng
        req.logIn(user, (err) => {
          if (err) {
            console.error("Login error:", err); // Log lỗi nếu có
            return res.status(500).json({ message: "Login failed" });
          }
          req.session.userId = user._id;
          req.session.role = user.role;
          // Chuyển hướng người dùng đến trang sau khi đăng nhập thành công
          res.redirect("/logined");
        });
      }
    )(req, res, next); // Đảm bảo tiếp tục quá trình xác thực
  }
  
}

module.exports = new AuthController();
