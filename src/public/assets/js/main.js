//  */
window.addEventListener("template-loaded", initJsToggle);

function initJsToggle() {
  $$(".js-toggle").forEach((button) => {
    const target = button.getAttribute("toggle-target");
    if (!target) {
      document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
    }
    button.onclick = (e) => {
      e.preventDefault();

      if (!$(target)) {
        return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
      }
      const isHidden = $(target).classList.contains("hide");

      requestAnimationFrame(() => {
        $(target).classList.toggle("hide", !isHidden);
        $(target).classList.toggle("show", isHidden);
      });
    };
    document.onclick = function (e) {
      if (!e.target.closest(target)) {
        const isHidden = $(target).classList.contains("hide");
        if (!isHidden) {
          button.click();
        }
      }
    };
  });
}

function submitSearchForm() {
  const searchInput = document.querySelector(".search__input");

  // Kiểm tra nếu ô input không rỗng
  if (searchInput.value.trim() !== "") {
    document.getElementById("searchForm").submit(); // Gửi form
  } else {
    alert("Please enter a search term."); // Hiển thị thông báo nếu ô input trống
  }
}

const prevButton = document.querySelector(".nav-previous");
const nextButton = document.querySelector(".nav-next");
const categoryList = document.querySelector(".nav-header__category-list");

// Hàm cuộn danh sách sang trái theo chiều rộng của một mục
const moveLeft = () => {
  categoryList.scrollBy({
    left: -categoryList.querySelector(".nav-header__category-item").offsetWidth,
    behavior: "smooth",
  });
};

// Hàm cuộn danh sách sang  phải theo chiều rộng của một mục
const moveRight = () => {
  categoryList.scrollBy({
    left: categoryList.querySelector(".nav-header__category-item").offsetWidth,
    behavior: "smooth",
  });
};

// Thêm các sự kiện lắng nghe cho các nút
prevButton.addEventListener("click", moveLeft);
nextButton.addEventListener("click", moveRight);
//typetext
const textElement = document.getElementById("typewriter-text");
const text = textElement.textContent; // Lấy nội dung văn bản
textElement.textContent = ""; // Xóa nội dung ban đầu

let index = 0;
let typingComplete = false; // Biến để theo dõi trạng thái gõ chữ

// Hàm gõ chữ
function type() {
  if (index < text.length) {
    textElement.textContent += text.charAt(index); // Thêm ký tự vào văn bản
    index++;

    // Nếu chiều dài văn bản vượt quá chiều rộng phần tử cha
    if (textElement.scrollWidth > textElement.clientWidth) {
      // Loại bỏ ký tự đầu tiên để tạo không gian
      textElement.textContent = textElement.textContent.slice(1);
    }

    setTimeout(type, 50); // Thay đổi tốc độ gõ ở đây
  } else {
    typingComplete = true; // Đánh dấu là đã gõ xong
    setTimeout(() => {
      index = 0; // Đặt lại chỉ số
      textElement.textContent = ""; // Xóa văn bản
      typingComplete = false; // Đặt lại trạng thái gõ chữ
      type(); // Bắt đầu lại quá trình gõ
    }, 1000); // Thời gian nghỉ trước khi bắt đầu lại
  }
}

type();

//dropdown
const headings = document.querySelectorAll(".nav-header__category-item-name");
let currentList = null; // Biến để theo dõi danh sách hiện tại

headings.forEach(function (heading) {
  const parent = heading.parentElement;
  const list = parent.querySelector(".nav-item");

  heading.addEventListener("click", function (e) {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài

    // Lấy vị trí của phần tử heading
    const rect = heading.getBoundingClientRect();
    const top = rect.top + window.scrollY; // Vị trí top trong tran
    const left = rect.left + window.scrollX; // Vị trí left trong trang
    list.style.top = top - 40;
    list.style.left = left - 154;
    // In ra vị trí

    // Nếu danh sách hiện tại không phải là danh sách đang được click, ẩn danh sách hiện tại
    if (currentList && currentList !== list) {
      currentList.style.display = "none"; // Ẩn danh sách hiện tại
    }

    // Hiển thị danh sách mới
    if (list.style.display === "block") {
      list.style.display = "none"; // Nếu danh sách đã hiển thị, ẩn đi
      currentList = null; // Đặt currentList về null
    } else {
      list.style.display = "block"; // Nếu chưa hiển thị, hiển thị
      currentList = list; // Cập nhật currentList
    }
  });
});

// Thêm sự kiện click cho toàn bộ tài liệu để ẩn danh sách khi click ra ngoài
document.addEventListener("click", function () {
  if (currentList) {
    currentList.style.display = "none"; // Ẩn danh sách hiện tại
    currentList = null; // Đặt currentList về null
  }
});

const toggleNavButton = document.getElementById("toggle-nav");
const overlay = document.getElementById("new-navbar-overlay");
const closeBtn = document.getElementById("close-overlay");

// Add event listener to the toggle button
toggleNavButton.addEventListener("click", () => {
  overlay.classList.toggle("show"); // Toggle the "show" class to slide the overlay in
});

// Add event listener to the close button
closeBtn.addEventListener("click", () => {
  overlay.classList.remove("show"); // Remove the "show" class to slide the overlay out
});
const categoryItems = document.querySelectorAll(
  ".new-nav-header__category-item"
);

// Add click event to each category item
categoryItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Toggle the 'open' class to show/hide child items
    item.classList.toggle("open");
  });
});
