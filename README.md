# Dự Án Báo Điện Tử

## Giới Thiệu

Dự án này là một ứng dụng web Báo Điện Tử, được xây dựng với mục tiêu cung cấp cho độc giả một nền tảng để tiếp cận các bài viết và thông tin mới nhất. Hệ thống bao gồm nhiều phân hệ với các chức năng dành riêng cho từng loại người dùng, bao gồm độc giả, phóng viên, biên tập viên và quản trị viên.

## Cách Cài Đặt

1. **Clone repo về máy:**
   ```bash
   git clone https://github.com/hcmute-toan/WebProject.git
   ```
2. **Cài đặt các gói cần thiết:**

   ```bash
   npm install
   ```

3. **Khởi động ứng dụng:**
   ```bash
   npm start
   ```

## Phân Hệ và Chức Năng

### 1. Phân hệ độc giả vãng lai - Guest

- **Hệ thống Menu**: Hiển thị danh sách chuyên mục với 2 cấp chuyên mục (ví dụ: Kinh Doanh ➠ Nông Sản, Kinh Doanh ➠ Hải Sản).
- **Trang chủ**: Hiển thị:
  - 3-4 bài viết nổi bật nhất trong tuần qua.
  - 10 bài viết được xem nhiều nhất và 10 bài viết mới nhất (mọi chuyên mục).
  - Top 10 chuyên mục, mỗi chuyên mục 1 bài mới nhất.
- **Xem danh sách bài viết**: Theo chuyên mục, theo nhãn tag, có phân trang.
- **Tìm kiếm bài viết**: Sử dụng kỹ thuật Full-text search.

### 2. Phân hệ độc giả - Subscriber

- Độc giả đã đăng ký tài khoản sẽ được phép xem và download ấn bản (.pdf) một số bài viết premium.
- Tài khoản có thời hạn 7 ngày và cần gia hạn khi hết hạn.

### 3. Phân hệ phóng viên - Writer

- **Đăng bài viết**: Sử dụng trình soạn thảo WYSIWYG (tinymce, ckeditor, quilljs, summernote).
- **Xem danh sách bài viết**: Bài viết đã được duyệt, chờ xuất bản, bị từ chối và chưa được duyệt.

### 4. Phân hệ biên tập viên - Editor

- Xem và duyệt các bài viết draft của phóng viên.
- Có khả năng từ chối bài viết với lý do cụ thể và duyệt bài viết với các thông tin cần thiết.

### 5. Phân hệ quản trị viên - Administrator

- Quản lý chuyên mục, nhãn tag, bài viết, và danh sách người dùng.
- Có khả năng cập nhật trạng thái bài viết từ draft sang xuất bản.

## Tính Năng Chung

- **Đăng nhập**: Hỗ trợ cài đặt tự động hoặc sử dụng passport.js cho đăng nhập.
- **Cập nhật thông tin cá nhân**: Bao gồm họ tên, bút danh, email, ngày tháng năm sinh và đổi mật khẩu.
- **Quên mật khẩu**: Yêu cầu xác nhận bằng email OTP.

## Yêu Cầu Kỹ Thuật

- **Web App MVC**
- **Technical Stack**:
  - Framework: Express.js
  - View Engine: Handlebars/EJS
  - DB: MySQL/Postgres/MongoDB

## Dữ Liệu

- Cần có ít nhất 20 bài viết thuộc 4-5 chuyên mục, mỗi bài viết đều có đánh nhãn hợp lý, nội dung và hình ảnh đầy đủ.

## Quản Lý Mã Nguồn

- Sinh viên cần upload mã nguồn lên GitHub từ lúc bắt đầu thực hiện đồ án. Lịch sử commit/push gần như không có sẽ bị đánh giá là 0 điểm.

## Liên Hệ

Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email:

> 22110079@student.hcmute.edu.vn
> 22110083@student.hcmute.edu.vn
> 22110086@student.hcmute.edu.vn

## Tài Nguyên Tham Khảo

- [Passport.js](http://www.passportjs.org)
- [TinyMCE](http://tiny.cloud)
- [CKEditor](https://ckeditor.com)
- [QuillJS](https://quilljs.com)
- [Summernote](https://summernote.org)
