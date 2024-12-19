const imageInput = document.getElementById("image");
const newImagePreview = document.getElementById("new-image-preview");
const currentImage = document.getElementById("current-image");

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file) {
    // Tạo URL tạm thời để hiển thị ảnh mới
    const imageURL = URL.createObjectURL(file);

    // Cập nhật ảnh xem trước
    newImagePreview.src = imageURL;
    newImagePreview.style.display = "block";

    // Ẩn ảnh hiện tại
    currentImage.style.display = "none";
  } else {
    // Hiển thị lại ảnh cũ nếu không có ảnh mới được chọn
    newImagePreview.style.display = "none";
    currentImage.style.display = "block";
  }
});
/////////////
