$("#deleteModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget); // Nút đã kích hoạt modal
  var tagId = button.data("id"); // Lấy ID từ thuộc tính data-id của nút

  // Lưu ID vào button "Delete"
  var confirmDeleteButton = $("#confirmDeleteBtn");
  confirmDeleteButton.data("id", tagId); // Lưu ID vào button xóa
});

// Xử lý sự kiện khi người dùng nhấn "Delete" trong modal
$("#confirmDeleteBtn").click(function () {
  var tagId = $(this).data("id"); // Lấy ID của danh mục

  // Gửi yêu cầu xóa bằng Ajax
  $.ajax({
    type: "POST",
    url: "/admin/" + tagId + "/manageDeleteTags",
    success: function (response) {
      // Đóng modal và chuyển hướng về trang quản lý danh mục sau khi xóa thành công
      $("#deleteModal").modal("hide");
      window.location.href = "/admin/manage-tags"; // Redirect về trang quản lý
    },
  });
});
///////////search
document
  .getElementById("tagSearchButton")
  .addEventListener("click", function () {
    const searchTerm = document
      .getElementById("tagSearch")
      .value.toLowerCase()
      .trim();
    const tagRows = document.querySelectorAll("tbody tr");

    tagRows.forEach((row) => {
      const tagName = row.cells[1]?.textContent.toLowerCase() || "";

      // Check if the tag name contains the search term
      if (tagName.includes(searchTerm)) {
        row.style.display = ""; // Show row
      } else {
        row.style.display = "none"; // Hide row
      }
    });
  });
