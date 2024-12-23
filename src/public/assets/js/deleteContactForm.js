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
      url: "/admin/" + tagId + "/deleteContactForm",
      success: function (response) {
        // Đóng modal và chuyển hướng về trang quản lý danh mục sau khi xóa thành công
        $("#deleteModal").modal("hide");
        window.location.href = "/admin/dashboard"; // Redirect về trang quản lý
      },
    });
  });
  