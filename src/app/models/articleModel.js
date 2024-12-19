
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Article Schema
const ArticleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String, required: true },
  image_url: { type: String },
  category_id: { type: Schema.Types.ObjectId, ref: "Category" },
  status: {
    type: String,
    enum: ["draft", "published", "rejected"],
    default: "draft",
  },
  author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  count_view: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Article", ArticleSchema);
