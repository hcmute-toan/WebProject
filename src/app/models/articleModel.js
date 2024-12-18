const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Article Schema
const ArticleSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    image_url: { type: String, default: null },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    status: {
        type: String,
        enum: ['draft', 'pending', 'published', 'rejected'],
        default: 'draft',
    },
    Release_at: {type:Date,default:null},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Article', ArticleSchema);

