document.addEventListener("DOMContentLoaded", function () {
  // Lấy tất cả các dòng có class "clickable-row"
  const rows = document.querySelectorAll(".clickable-row");

  rows.forEach((row) => {
    row.addEventListener("click", function (e) {
      // Kiểm tra xem người dùng có click vào cột hành động (cột cuối) không
      const target = e.target;
      if (!target.closest("td:last-child")) {
        // Nếu không phải cột cuối
        const articleId = row.getAttribute("data-id");
        window.location.href = `/editor/review-article/${articleId}`; // Chuyển hướng đến trang chi tiết
      }
    });
  });
});

// Lắng nghe sự kiện khi nút Approve được nhấn
document.querySelectorAll(".btn-approve").forEach((button) => {
  button.addEventListener("click", function () {
    // Lấy giá trị data-id của bài viết từ nút Approve
    const articleId = this.getAttribute("data-id");

    // Cập nhật action của form trong modal
    const form = document.getElementById("approveForm");
    form.action = `/editor/approve-article/${articleId}`;
  });
});
