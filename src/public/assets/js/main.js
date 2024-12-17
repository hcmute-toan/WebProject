// const $ = document.querySelector.bind(document);
// const $$ = document.querySelectorAll.bind(document);

// /**
//  * Hàm tải template
//  *
//  * Cách dùng:
//  * <div id="parent"></div>
//  * <script>
//  *  load("#parent", "./path-to-template.html");
//  * </script>
//  */
// // function load(selector, path) {
// //   const cached = localStorage.getItem(path);
// //   if (cached) {
// //     $(selector).innerHTML = cached;
// //   }

// //   fetch(path)
// //     .then((res) => res.text())
// //     .then((html) => {
// //       if (html !== cached) {
// //         $(selector).innerHTML = html;
// //         localStorage.setItem(path, html);
// //       }
// //     })
// //     .finally(() => {
// //       window.dispatchEvent(new Event("template-loaded"));
// //     });
// // }

// /**
//  * Hàm kiểm tra một phần tử
//  * có bị ẩn bởi display: none không
//  */
// function isHidden(element) {
//   if (!element) return true;

//   if (window.getComputedStyle(element).display === "none") {
//     return true;
//   }

//   let parent = element.parentElement;
//   while (parent) {
//     if (window.getComputedStyle(parent).display === "none") {
//       return true;
//     }
//     parent = parent.parentElement;
//   }

//   return false;
// }

// /**
//  * Hàm buộc một hành động phải đợi
//  * sau một khoảng thời gian mới được thực thi
//  */
// function debounce(func, timeout = 300) {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       func.apply(this, args);
//     }, timeout);
//   };
// }

// /**
//  * Hàm tính toán vị trí arrow cho dropdown
//  *
//  * Cách dùng:
//  * 1. Thêm class "js-dropdown-list" vào thẻ ul cấp 1
//  * 2. CSS "left" cho arrow qua biến "--arrow-left-pos"
//  */
// const calArrowPos = debounce(() => {
//   if (isHidden($(".js-dropdown-list"))) return;

//   const items = $$(".js-dropdown-list > li");

//   items.forEach((item) => {
//     const arrowPos = item.offsetLeft + item.offsetWidth / 2;
//     item.style.setProperty("--arrow-left-pos", `${arrowPos}px`);
//   });
// });

// // Tính toán lại vị trí arrow khi resize trình duyệt
// window.addEventListener("resize", calArrowPos);

// // Tính toán lại vị trí arrow sau khi tải template
// window.addEventListener("template-loaded", calArrowPos);

// /**
//  * Giữ active menu khi hover
//  *
//  * Cách dùng:
//  * 1. Thêm class "js-menu-list" vào thẻ ul menu chính
//  * 2. Thêm class "js-dropdown" vào class "dropdown" hiện tại
//  *  nếu muốn reset lại item active khi ẩn menu
//  */
// window.addEventListener("template-loaded", handleActiveMenu);

// function handleActiveMenu() {
//   const dropdowns = $$(".js-dropdown");
//   const menus = $$(".js-menu-list");
//   const activeClass = "menu-column__item--active";

//   const removeActive = (menu) => {
//     menu.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
//   };

//   const init = () => {
//     menus.forEach((menu) => {
//       const items = menu.children;
//       if (!items.length) return;

//       removeActive(menu);
//       if (window.innerWidth > 991) items[0].classList.add(activeClass);

//       Array.from(items).forEach((item) => {
//         item.onmouseenter = () => {
//           if (window.innerWidth <= 991) return;
//           removeActive(menu);
//           item.classList.add(activeClass);
//         };
//         item.onclick = () => {
//           if (window.innerWidth > 991) return;
//           removeActive(menu);
//           item.classList.add(activeClass);
//           item.scrollIntoView();
//         };
//       });
//     });
//   };

//   init();

//   dropdowns.forEach((dropdown) => {
//     dropdown.onmouseleave = () => init();
//   });
// }

// /**
//  * JS toggle
//  *
//  * Cách dùng:
//  * <button class="js-toggle" toggle-target="#box">Click</button>
//  * <div id="box">Content show/hide</div>
//  */
// window.addEventListener("template-loaded", initJsToggle);

// function initJsToggle() {
//   $$(".js-toggle").forEach((button) => {
//     const target = button.getAttribute("toggle-target");
//     if (!target) {
//       document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
//     }
//     button.onclick = (e) => {
//       e.preventDefault();

//       if (!$(target)) {
//         return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
//       }
//       const isHidden = $(target).classList.contains("hide");

//       requestAnimationFrame(() => {
//         $(target).classList.toggle("hide", !isHidden);
//         $(target).classList.toggle("show", isHidden);
//       });
//     };
//     document.onclick = function (e) {
//       if (!e.target.closest(target)) {
//         const isHidden = $(target).classList.contains("hide");
//         if (!isHidden) {
//           button.click();
//         }
//       }
//     };
//   });
// }

// window.addEventListener("template-loaded", () => {
//   const links = $$(".js-dropdown-list > li > a");

//   links.forEach((link) => {
//     link.onclick = () => {
//       if (window.innerWidth > 991) return;
//       const item = link.closest("li");
//       item.classList.toggle("navbar__item--active");
//     };
//   });
// });

// window.addEventListener("template-loaded", () => {
//   const tabsSelector = "prod-tab__item";
//   const contentsSelector = "prod-tab__content";

//   const tabActive = `${tabsSelector}--current`;
//   const contentActive = `${contentsSelector}--current`;

//   const tabContainers = $$(".js-tabs");
//   tabContainers.forEach((tabContainer) => {
//     const tabs = tabContainer.querySelectorAll(`.${tabsSelector}`);
//     const contents = tabContainer.querySelectorAll(`.${contentsSelector}`);
//     tabs.forEach((tab, index) => {
//       tab.onclick = () => {
//         tabContainer
//           .querySelector(`.${tabActive}`)
//           ?.classList.remove(tabActive);
//         tabContainer
//           .querySelector(`.${contentActive}`)
//           ?.classList.remove(contentActive);
//         tab.classList.add(tabActive);
//         contents[index].classList.add(contentActive);
//       };
//     });
//   });
// });

// window.addEventListener("template-loaded", () => {
//   const switchBtn = document.querySelector("#switch-theme-btn");
//   if (switchBtn) {
//     switchBtn.onclick = function () {
//       const isDark = localStorage.dark === "true";
//       document.querySelector("html").classList.toggle("dark", !isDark);
//       localStorage.setItem("dark", !isDark);
//       switchBtn.querySelector("span").textContent = isDark
//         ? "Dark mode"
//         : "Light mode";
//     };
//     const isDark = localStorage.dark === "true";
//     switchBtn.querySelector("span").textContent = isDark
//       ? "Light mode"
//       : "Dark mode";
//   }
// });

// const isDark = localStorage.dark === "true";
// document.querySelector("html").classList.toggle("dark", isDark);

// navbar toanvan
// Lấy các nút và danh sách các danh mục
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

// Bắt đầu quá trình gõ
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
    list.style.top = top - 20;
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

// const headings = document.querySelectorAll(".nav-header__category-item-name");
// headings.forEach(function (heading) {
//   heading.addEventListener("click", function (e) {
//     const parent = heading.parentElement;
//     const list = parent.querySelector("#nav-item");
//     list.style.display = "block";
//     // Ngừng sự kiện click mặc định (tránh bị bắt bởi sự kiện click bên ngoài)
//     e.stopPropagation();

//     // Lấy vị trí của phần tử heading trong cửa sổ trình duyệt
//     const rect = heading.getBoundingClientRect();

//     // Vị trí của heading
//     const top = rect.top;
//     const left = rect.left;

//     // In ra kết quả
//     console.log(
//       "Vị trí của heading - Top: " + top + "px, Left: " + left + "px"
//     );

//     // Nếu muốn tính vị trí trong mốc toạ độ của toàn bộ trang
//     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//     const scrollLeft =
//       window.pageXOffset || document.documentElement.scrollLeft;

//     const absoluteTop = top + scrollTop;
//     const absoluteLeft = left + scrollLeft;

//     console.log(
//       "Vị trí tuyệt đối của heading trong trang - Top: " +
//         absoluteTop +
//         "px, Left: " +
//         absoluteLeft +
//         "px"
//     );
//   });
// });

// const headings = document.querySelectorAll(".nav-header__category-item-name");

// headings.forEach(function (heading) {
//   heading.addEventListener("click", function (e) {
//     // Ngừng sự kiện click mặc định (tránh bị bắt bởi sự kiện click bên ngoài)
//     e.stopPropagation();

//     const parent = heading.parentElement;
//     const list = parent.querySelector("#nav-item");

//     // Ẩn tất cả các list khác trước khi hiển thị list tương ứng
//     document.querySelectorAll("#nav-item").forEach(function (otherList) {
//       if (otherList !== list) {
//         otherList.style.display = "none";
//       }
//     });

//     // Toggle hiển thị của list
//     if (list.style.display === "block") {
//       list.style.display = "none"; // Nếu đã hiển thị, ẩn đi
//     } else {
//       list.style.display = "block"; // Nếu chưa hiển thị, hiển thị
//     }

//     // Lấy vị trí của phần tử heading trong cửa sổ trình duyệt
//     const rect = heading.getBoundingClientRect();

//     // Vị trí của heading
//     const top = rect.top;
//     const left = rect.left;

//     // In ra kết quả
//     console.log(
//       "Vị trí của heading - Top: " + top + "px, Left: " + left + "px"
//     );

//     // Nếu muốn tính vị trí trong mốc toạ độ của toàn bộ trang
//     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//     const scrollLeft =
//       window.pageXOffset || document.documentElement.scrollLeft;

//     const absoluteTop = top + scrollTop;
//     const absoluteLeft = left + scrollLeft;

//     console.log(
//       "Vị trí tuyệt đối của heading trong trang - Top: " +
//         absoluteTop +
//         "px, Left: " +
//         absoluteLeft +
//         "px"
//     );
//   });
// });

// // Lắng nghe sự kiện click bên ngoài để ẩn các list khi nhấp ra ngoài
// document.addEventListener("click", function () {
//   document.querySelectorAll("#nav-item").forEach(function (list) {
//     list.style.display = "none";
//   });
// });

//Lấy tất cả các phần tử có lớp .nav-header__category-item-name
// const headings = document.querySelectorAll(".nav-header__category-item-name");

// headings.forEach(function (heading) {
//   heading.addEventListener("click", function (e) {
//     // Ngừng sự kiện click mặc định (tránh bị bắt bởi sự kiện click bên ngoài)
//     e.stopPropagation();

//     // Lấy vị trí của phần tử heading trong cửa sổ trình duyệt
//     const rect = heading.getBoundingClientRect();

//     // Vị trí của heading
//     const top = rect.top;
//     const left = rect.left;

//     // In ra kết quả
//     console.log(
//       "Vị trí của heading - Top: " + top + "px, Left: " + left + "px"
//     );

//     // Nếu muốn tính vị trí trong mốc toạ độ của toàn bộ trang
//     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//     const scrollLeft =
//       window.pageXOffset || document.documentElement.scrollLeft;

//     const absoluteTop = top + scrollTop;
//     const absoluteLeft = left + scrollLeft;

//     console.log(
//       "Vị trí tuyệt đối của heading trong trang - Top: " +
//         absoluteTop +
//         "px, Left: " +
//         absoluteLeft +
//         "px"
//     );
//   });
// });
