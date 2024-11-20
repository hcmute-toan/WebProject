class AuthController {
  // [GET] /news
  index(req, res) {
    res.render("authActive", {
      layout: "auth", // Sử dụng layout auth.hbs
      title: "Login Page", // Dữ liệu truyền vào view
    });
  }
}
module.exports = new AuthController();
