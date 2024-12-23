const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Tag Schema
const TagSchema = new Schema({
    name: { type: String, required: true, unique: true },
    // created_at: { type: Date, default: Date.now },
    // updated_at: { type: Date, default: Date.now },
},{ timestamps: true });

module.exports = mongoose.model('Tag', TagSchema);
