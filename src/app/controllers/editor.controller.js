class EditorController {
    dashboard(req, res) {
        res.render('editor/editor_dashboard', { layout: 'dashboard' });
    }

    reviewArticle(req, res) {
        res.render('editor/review_article', { layout: 'dashboard' });
    }
}

module.exports = new EditorController();
