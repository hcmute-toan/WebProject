// Open modal when user is not logged in
document
  .getElementById("comment-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form submission

    const formData = new FormData(e.target);
    const content = formData.get("content").trim();

    if (!content) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      const response = await fetch(e.target.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.status === 401) {
        document.getElementById("login-modal").style.display = "flex";
      } else if (response.ok) {
        location.reload();
      } else {
        const { message } = await response.json();
        alert(message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  });

// Close modal functionality
const modal = document.getElementById("login-modal");
const closeModal = () => (modal.style.display = "none");

// Close modal on close button click
document.getElementById("close-modal").addEventListener("click", closeModal);

// Close modal on overlay click
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});
//////// ===============================================sort

///////////////////////////////////////////////loc
function timeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / (3600 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) {
    return "Vừa xong";
  } else if (minutes < 60) {
    return `${minutes} phút trước`;
  } else if (hours < 24) {
    return `${hours} giờ trước`;
  } else if (days < 30) {
    return `${days} ngày trước`;
  } else if (months < 12) {
    return `${months} tháng trước`;
  } else {
    return `${years} năm trước`;
  }
}

// Hàm cập nhật thời gian cho mỗi bình luận
function updateCommentTimes() {
  const commentTimes = document.querySelectorAll(".comment-time");
  commentTimes.forEach((timeElement) => {
    const commentDate = timeElement.getAttribute("data-time"); // Lấy thời gian bình luận từ data-time
    timeElement.textContent = timeAgo(commentDate); // Cập nhật thời gian
  });
}

// Hàm sắp xếp bình luận theo thời gian (Newest hoặc Oldest)
function sortComments(order) {
  const commentsContainer = document.getElementById("comment-list");
  const comments = Array.from(
    commentsContainer.getElementsByClassName("comment")
  );

  // Sắp xếp dựa trên thời gian
  comments.sort((a, b) => {
    const timeA = new Date(
      a.querySelector(".comment-time").getAttribute("data-time")
    );
    const timeB = new Date(
      b.querySelector(".comment-time").getAttribute("data-time")
    );

    if (order === "newest") {
      return timeB - timeA; // Sắp xếp từ mới nhất
    } else {
      return timeA - timeB; // Sắp xếp từ cũ nhất
    }
  });

  // Xóa các bình luận cũ và thêm lại theo thứ tự mới
  commentsContainer.innerHTML = "";
  comments.forEach((comment) => commentsContainer.appendChild(comment));
}

// Hàm xử lý khi người dùng chọn "Newest" hoặc "Oldest"
document.getElementById("sort-newest").addEventListener("click", () => {
  sortComments("newest"); // Sắp xếp bình luận mới nhất
});

document.getElementById("sort-oldest").addEventListener("click", () => {
  sortComments("oldest"); // Sắp xếp bình luận cũ nhất
});

// Cập nhật thời gian khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
  updateCommentTimes();
  // Đặt mặc định là sắp xếp theo bình luận mới nhất
  sortComments("newest");
});

// Open modal when user is not logged in

// Close modal functionality
// Hàm tính thời gian đã trôi qua kể từ thời điểm bình luận được đăng

// Hàm để cập nhật thời gian cho mỗi bình luận
function updateCommentTimes() {
  const commentTimes = document.querySelectorAll(".comment-time");
  commentTimes.forEach((timeElement) => {
    const commentDate = timeElement.getAttribute("data-time"); // Lấy thời gian bình luận từ data-time
    timeElement.textContent = timeAgo(commentDate); // Cập nhật thời gian
  });
}

// Cập nhật thời gian khi trang được tải
document.addEventListener("DOMContentLoaded", updateCommentTimes);
// Hàm tính thời gian đã trôi qua kể từ thời điểm bình luận được đăng=============================

// Hàm xử lý form thêm bình luận

/////////////
///////////////////code edit comment
document.addEventListener("DOMContentLoaded", function () {
  const editButtons = document.querySelectorAll(".edit-comment-btn");

  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const commentElement = this.closest(".comment");
      const commentContent = commentElement.querySelector(".comment-text");
      const commentTextarea = commentElement.querySelector(".edit-textarea");
      const saveComment = commentElement.querySelector(".save-edit-btn"); // Target the specific "Save" button

      // Toggle visibility of textarea and save button
      const isEditing = commentTextarea.style.display === "block";

      if (isEditing) {
        // If already editing, hide textarea and save button
        commentTextarea.style.display = "none";
        saveComment.style.display = "none";
        commentContent.style.display = "block"; // Show the original comment text again
      } else {
        // If not editing, show textarea and save button
        const currentContent = commentContent.textContent;
        commentTextarea.style.display = "block";
        commentTextarea.value = currentContent;
        saveComment.style.display = "block"; // Show the "Save" button
        commentContent.style.display = "none"; // Hide the original comment text
      }
    });
  });
});
/////////
/////////////////////////////////////////////==========================================
document.addEventListener("DOMContentLoaded", function () {
  const saveButtons = document.querySelectorAll(".save-edit-btn");

  saveButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const commentElement = this.closest(".comment");
      const form = commentElement.closest("form");
      const commentTextarea = commentElement.querySelector(".edit-textarea");

      // Lấy _id từ data-id của nút save
      const commentId = this.getAttribute("data-id");

      // Cập nhật action của form với _id
      form.action = `/article/${commentId}/updateComment?_method=PUT`;

      // Cập nhật nội dung bình luận trong textarea
      // Lưu dữ liệu vào textarea và gửi form
      // form.submit();
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const editButtons = document.querySelectorAll(".edit-comment-btn");
  const saveButtons = document.querySelectorAll(".save-edit-btn");

  // Khi nhấn "Edit", hiển thị textarea và nút Save
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const commentElement = this.closest(".comment");
      const textarea = commentElement.querySelector(".edit-textarea");
      const saveButton = commentElement.querySelector(".save-edit-btn");
      const commentText = commentElement.querySelector(".comment-text");

      // Hiển thị textarea và nút Save
      textarea.style.display = "block";
      saveButton.style.display = "block";

      // Ẩn nội dung bình luận
      commentText.style.display = "none";

      // Đặt giá trị trong textarea bằng nội dung ban đầu
      textarea.value = commentText.textContent.trim();
    });
  });

  // Khi nhấn nút "Save", lấy nội dung từ textarea và gửi form
  saveButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const commentElement = this.closest(".comment");
      const form = commentElement.closest("form");
      const textarea = commentElement.querySelector(".edit-textarea");

      // Lấy nội dung đã chỉnh sửa trong textarea
      const updatedContent = textarea.value.trim();

      // Cập nhật lại nội dung bình luận trong form (nếu cần thiết)
      const commentText = commentElement.querySelector(".comment-text");
      commentText.textContent = updatedContent;

      // Cập nhật giá trị cho trường "content" trong form (nếu cần)
      const contentInput = form.querySelector('input[name="content"]');
      if (contentInput) {
        contentInput.value = updatedContent;
      }

      // Submit form
      form.submit();
    });
  });
});
////////////////////////////
// Hàm tính thời gian đã trôi qua kể từ thời điểm bình luận được đăng
// Function to calculate how long ago a comment was posted
