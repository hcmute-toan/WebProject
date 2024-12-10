const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// ArticleTag Schema
const ArticleTagSchema = new Schema({
    article_id: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    tag_id: { type: Schema.Types.ObjectId, ref: 'Tag', required: true },
});

module.exports = mongoose.model('ArticleTag', ArticleTagSchema);
