const express = require('express');
const guestRoutes = require('./guest.routes');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./administrator.routes');
const editorRoutes = require('./editor.routes');
const subscriberRoutes = require('./subscriber.routes');
const writerRoutes = require('./writer.routes');
const profileRoutes = require('./profile.routes');
const errorsController = require('../app/controllers/errors.controller');

function route(app) {
    // Auth routes
    app.use('/auth', authRoutes);
    // Admin routes
    app.use('/admin', adminRoutes);
    // Editor routes
    app.use('/editor', editorRoutes);
    // Subscriber routes
    app.use('/subscriber', subscriberRoutes);
    // Writer routes
    app.use('/writer', writerRoutes);

    app.use('/profile', profileRoutes);
    // Guest routes
    app.use('/', guestRoutes);
    // Error routes
    // Middleware xử lý lỗi 404
    app.use((req, res, next) => {
      res.status(404);
      errorsController.notFound(req, res); // Gọi phương thức notFound
    });
    // Middleware xử lý lỗi 500
    app.use((err, req, res, next) => {
        errorsController.serverError(req, res); // Gọi phương thức serverError
    });
}

module.exports = route;
