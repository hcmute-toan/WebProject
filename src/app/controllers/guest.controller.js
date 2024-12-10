class GuestController {
    // Trang chủ dành cho guest
    index(req, res) {
        res.render('guest/index', { layout: 'main', isSubscriber: false });
    }

    // Chi tiết bài viết
    article(req, res) {
        res.render('guest/article', { layout: 'main', isSubscriber: false });
    }

    // Trang danh mục
    category(req, res) {
        res.render('guest/category', { layout: 'main', isSubscriber: false });
    }

    // Trang tag
    tag(req, res) {
        res.render('guest/tag', { layout: 'main', isSubscriber: false });
    }

    // Trang tìm kiếm
    search(req, res) {
        res.render('guest/search', { layout: 'main', isSubscriber: false });
    }
}

// Xuất một thể hiện của GuestController
module.exports = new GuestController();
