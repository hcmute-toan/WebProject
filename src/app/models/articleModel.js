
const mongoose = require("mongoose");
const { tag } = require("../controllers/guest.controller");
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
  type : {
    type: String,
    enum: ["none", "pre"],
    default : "none",
  },
  author_id: { type: Schema.Types.ObjectId, ref: "User" },
  count_view: { type: Number, default: 0 },
  // created_at: { type: Date, default: Date.now },
  // updated_at: { type: Date, default: Date.now },
  Release_at: {type:Date,default:null},
},{ timestamps: true });

ArticleSchema.index(
  { title: "text", summary: "text", content: "text"},
);

module.exports = mongoose.model("Article", ArticleSchema);
