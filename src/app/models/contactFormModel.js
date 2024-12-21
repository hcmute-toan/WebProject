const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Định nghĩa schema cho phản hồi liên hệ
const contactFormSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model từ schema
const ContactForm = mongoose.model("ContactForm", contactFormSchema);

module.exports = ContactForm;
