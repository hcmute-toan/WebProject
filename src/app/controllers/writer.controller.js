class WriterController {
    dashboard(req, res) {
        res.render('writer/writer_dashboard', { layout: 'dashboard' });
    }

    editArticle(req, res) {
        res.render('writer/edit_article', { layout: 'dashboard' });
    }

    writeArticle(req, res) {
        res.render('writer/write_article', { layout: 'dashboard' });
    }
}

module.exports = new WriterController();
