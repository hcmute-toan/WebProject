const nodemailer = require("nodemailer");

// Hàm tạo mã OTP ngẫu nhiên
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // Tạo mã OTP 6 chữ số
}

// Hàm gửi email
async function sendOTP(email) {
  const otp = generateOTP(); // Tạo mã OTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vancongtoan09102004@gmail.com", // Email gửi
      pass: "kbtukgswsypoidec", // Mật khẩu ứng dụng của Gmail
    },
  });

  const mailOptions = {
    from: '"RISES" <vancongtoan09102004@gmail.com>', // Email người gửi
    to: email, // Email người nhận
    subject: "YOUR OTP",
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
  <h2 style="color: #4CAF50;">Your OTP Code</h2>
  <p>Hello, ${email}</p>
  <p>Your OTP code is:</p>
  <div style="font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0;">${otp}</div>
  <p>Please use this code to verify your identity. This code is valid for 5 minutes.</p>
  <p style="font-size: 14px; color: #888;">If you didn’t request this code, please ignore this email.</p>
  <hr style="border: 0; height: 1px; background: #ddd;">
  <footer style="text-align: center; font-size: 12px; color: #aaa;">
    <p>&copy; 2024 Your Company</p>
  </footer>
</div>
`,
  };

  try {
    await transporter.sendMail(mailOptions); // Gửi email
    return {
      status: "success",
      message: "Email đã được gửi thành công",
      otp, // Trả về mã OTP để lưu hoặc xử lý
    };
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    return {
      status: "error",
      message: "Không thể gửi email",
    };
  }
}

module.exports = sendOTP;
