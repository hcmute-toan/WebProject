class ErrorsController {
    notFound(req, res) {
        res.render('errors/404', { layout: 'error' });
    }

    serverError(req, res) {
        res.render('errors/500', { layout: 'error' });
    }
}

module.exports = new ErrorsController();