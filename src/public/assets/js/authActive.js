// Login, signup
const authcontainer = document.getElementById("Authcontainer");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  authcontainer.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  authcontainer.classList.remove("active");
});

// $(document).ready(function () {
//   // Xử lý sự kiện khi nhấn "Retrieve Password"
//   $(".retrieve_password").click(function (event) {
//     event.preventDefault(); // Ngăn chặn hành vi mặc định (chuyển trang)

//     // Lấy giá trị email/phone từ input
//     const emailOrPhone = $("#rsp_email").val();

//     if (!emailOrPhone) {
//       alert("Error: Email or phone number is required.");
//       return;
//     }

//     // Gửi yêu cầu qua Ajax
//     $.ajax({
//       type: "POST",
//       url: "/auth/reset-password",
//       data: { email: emailOrPhone },
//       success: function (response) {
//         alert("OTP has been sent to your email or phone.");
//       },
//       error: function (xhr, status, error) {
//         const errorMessage =
//           xhr.responseJSON && xhr.responseJSON.message
//             ? xhr.responseJSON.message
//             : "An error occurred while retrieving the password.";
//         alert(`Error: ${errorMessage}`);
//       },
//     });
//   });

//   // Xử lý sự kiện khi nhấn "Change Password"
//   $(".change_password_btn").click(function (event) {
//     event.preventDefault(); // Ngăn chặn hành vi mặc định (chuyển trang)

//     // Lấy giá trị mật khẩu từ input
//     const newPassword = $("#cp").val();
//     const confirmPassword = $("#re-cp").val();

//     if (!newPassword || !confirmPassword) {
//       alert("Error: Both password fields are required.");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       alert("Error: New password and confirm password do not match.");
//       return;
//     }

//     // Gửi yêu cầu qua Ajax
//     $.ajax({
//       type: "POST",
//       url: "/auth/change-password",
//       data: { newPassword, confirmPassword },
//       success: function (response) {
//         alert("Password changed successfully.");
//       },
//       error: function (xhr, status, error) {
//         const errorMessage =
//           xhr.responseJSON && xhr.responseJSON.message
//             ? xhr.responseJSON.message
//             : "An error occurred while changing the password.";
//         alert(`Error: ${errorMessage}`);
//       },
//     });
//   });
// });
