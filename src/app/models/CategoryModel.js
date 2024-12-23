const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Category Schema
const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    parent_id: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    image : { type: String},
    // created_at: { type: Date, default: Date.now },
    // updated_at: { type: Date, default: Date.now },
},{ timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
