class AdministratorController {
    // Trang dashboard của admin
    dashboard(req, res) {
        res.render('administrator/admin_dashboard', { layout: 'admin' });
    }

    // Quản lý bài viết
    manageArticles(req, res) {
        res.render('administrator/manage_articles', { layout: 'admin' });
    }

    // Quản lý người dùng
    manageUsers(req, res) {
        res.render('administrator/manage_users', { layout: 'admin' });
    }

    // Quản lý danh mục
    manageCategories(req, res) {
        res.render('administrator/manage_categories', { layout: 'admin' });
    }

    // Quản lý thẻ
    manageTags(req, res) {
        res.render('administrator/manage_tags', { layout: 'admin' });
    }

    // Gia hạn subscription
    extendSubscription(req, res) {
        res.render('administrator/extend_subscription', { layout: 'admin' });
    }
}

module.exports = new AdministratorController();
