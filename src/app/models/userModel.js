const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ['guest', 'subscriber', 'writer', 'editor', 'administrator'],
        required: true,
    },
    subscription_end: { type: Date, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
