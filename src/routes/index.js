const newsRouter = require('./news');
const siteRouter = require('./site');
const authRouter = require('./auth');
function route(app) {
    app.use('/news', newsRouter);
    app.use('/auth',authRouter);
    app.use('/', siteRouter);
}
module.exports = route;
