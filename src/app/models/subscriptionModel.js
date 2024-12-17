const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Subscription Schema
const SubscriptionSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
