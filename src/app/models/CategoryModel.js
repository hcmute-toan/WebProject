const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Category Schema
const CategorySchema = new Schema({
    CategoryName: { type: String, required: true },
    ParentCategoryID: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
});

// Models
module.exports = mongoose.model('Category', CategorySchema);
