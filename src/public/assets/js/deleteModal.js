$("#deleteModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget); // Nút đã kích hoạt modal
  var articleId = button.data("id"); // Lấy ID từ thuộc tính data-id của nút

  // Lưu ID vào button "Delete"
  var confirmDeleteButton = $("#confirmDeleteBtn");
  confirmDeleteButton.data("id", articleId); // Lưu ID vào button xóa
});

// Xử lý sự kiện khi người dùng nhấn "Delete" trong modal
$("#confirmDeleteBtn").click(function () {
  var articleId = $(this).data("id"); // Lấy ID của danh mục

  // Gửi yêu cầu xóa bằng Ajax
  $.ajax({
    type: "POST",
    url: "/admin/" + articleId + "/manageDeleteArticle",
    success: function (response) {
      // Đóng modal và chuyển hướng về trang quản lý danh mục sau khi xóa thành công
      $("#deleteModal").modal("hide");
      window.location.href = "/admin/manage-articles"; // Redirect về trang quản lý
    },
  });
});
////////////
document
  .getElementById("categorySearchButton")
  .addEventListener("click", function () {
    const searchTerm = document
      .getElementById("categorySearch")
      .value.toLowerCase()
      .trim();
    const categoryRows = document.querySelectorAll("tbody tr");

    categoryRows.forEach((row) => {
      const parentCategory = row.cells[1]?.textContent.toLowerCase() || "";
      const name = row.cells[2]?.textContent.toLowerCase() || "";

      // Check if the parent category or category name contains the search term
      if (parentCategory.includes(searchTerm) || name.includes(searchTerm)) {
        row.style.display = ""; // Show row
      } else {
        row.style.display = "none"; // Hide row
      }
    });
  });
