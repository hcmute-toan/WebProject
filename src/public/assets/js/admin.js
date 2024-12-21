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
  });
});
/////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector(".admin__table tbody");

  // Hàm sắp xếp
  const sortTable = (key, order) => {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    rows.sort((a, b) => {
      const aValue = a.querySelector(`td:nth-child(${key})`).textContent.trim();
      const bValue = b.querySelector(`td:nth-child(${key})`).textContent.trim();

      if (!isNaN(aValue) && !isNaN(bValue)) {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    // Cập nhật lại thứ tự trong tbody
    rows.forEach((row) => tableBody.appendChild(row));
  };

  // Gán sự kiện cho các nút sắp xếp
  document.querySelectorAll(".sort-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const key =
        Array.from(button.parentElement.parentElement.children).indexOf(
          button.parentElement
        ) + 1;
      const order = button.getAttribute("data-order");
      sortTable(key, order);
    });
  });
});
////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector(".admin__table tbody");

  // Hàm sắp xếp
  const sortTable = (key, order) => {
    const rows = Array.from(tableBody.querySelectorAll("tr"));

    rows.sort((a, b) => {
      const getValue = (row, key) => {
        switch (key) {
          case "id":
            return parseInt(
              row.querySelector("td:nth-child(1)").textContent.trim(),
              10
            );
          case "parent":
            return row.querySelector("td:nth-child(2)").textContent.trim();
          case "name":
            return row.querySelector("td:nth-child(3)").textContent.trim();
          default:
            return "";
        }
      };

      const aValue = getValue(a, key);
      const bValue = getValue(b, key);

      if (!isNaN(aValue) && !isNaN(bValue)) {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    // Cập nhật lại thứ tự trong tbody
    rows.forEach((row) => tableBody.appendChild(row));
  };

  // Gán sự kiện cho các nút sắp xếp
  document.querySelectorAll(".sort-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-sort");
      const order = button.getAttribute("data-order");
      sortTable(key, order);
    });
  });
});
//////////////
