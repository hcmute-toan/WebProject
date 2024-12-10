class SubscriberController {
    dashboard(req, res) {
        res.render('subscriber/subscriber_dashboard', { layout: 'main', isSubscriber: true });
    }

    premiumArticles(req, res) {
        res.render('subscriber/premium_articles', { layout: 'main', isSubscriber: true });
    }
}

module.exports = new SubscriberController();
