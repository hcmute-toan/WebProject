-- Chèn dữ liệu vào bảng chuyên mục
INSERT INTO categories (name) VALUES
('Kinh Doanh'),
('Giải Trí'),
('Thể Thao'),
('Công Nghệ');

-- Chèn dữ liệu vào bảng người dùng
INSERT INTO users (username, email, password) VALUES
('admin', 'admin@example.com', 'hashed_password_1'),
('user1', 'user1@example.com', 'hashed_password_2'),
('user2', 'user2@example.com', 'hashed_password_3');

-- Chèn dữ liệu vào bảng bài viết
INSERT INTO posts (title, content, category_id, user_id) VALUES
('Bài viết 1', 'Nội dung của bài viết 1...', 1, 1),
('Bài viết 2', 'Nội dung của bài viết 2...', 2, 2),
('Bài viết 3', 'Nội dung của bài viết 3...', 3, 3);

-- Chèn dữ liệu vào bảng bình luận
INSERT INTO comments (post_id, user_id, content) VALUES
(1, 2, 'Bình luận của user1 cho bài viết 1...'),
(1, 3, 'Bình luận của user2 cho bài viết 1...'),
(2, 1, 'Bình luận của admin cho bài viết 2...');
