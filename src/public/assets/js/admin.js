$("#deleteModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget); // Nút đã kích hoạt modal
    var categoryId = button.data("id"); // Lấy ID từ thuộc tính data-id của nút
  
    // Lưu ID vào button "Delete"
    var confirmDeleteButton = $("#confirmDeleteBtn");
    confirmDeleteButton.data("id", categoryId); // Lưu ID vào button xóa
  });
  
  // Xử lý sự kiện khi người dùng nhấn "Delete" trong modal
  $("#confirmDeleteBtn").click(function () {
    var categoryId = $(this).data("id"); // Lấy ID của danh mục
  
    // Gửi yêu cầu xóa bằng Ajax
    $.ajax({
      type: "POST",
      url: "/admin/" + categoryId + "/manageDeleteCategories",
      success: function (response) {
        // Đóng modal và chuyển hướng về trang quản lý danh mục sau khi xóa thành công
        $("#deleteModal").modal("hide");
        window.location.href = "/admin/manage-categories"; // Redirect về trang quản lý
      },
      error: function (xhr, status, error) {
        alert("An error occurred while deleting the category.");
        $("#deleteModal").modal("hide");
      },
    });
  });
      