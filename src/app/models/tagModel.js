const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Tag Schema
const TagSchema = new Schema({
    name: { type: String, required: true, unique: true }, // kinh donah, chinh tri
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tag', TagSchema);
