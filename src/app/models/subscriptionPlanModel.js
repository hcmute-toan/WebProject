const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Định nghĩa schema cho SubscriptionPlan
const subscriptionPlanSchema = new Schema({
  name: { type: String, required: true }, // Tên gói, ví dụ: '30 Days', '3 Months', ...
  duration: { type: Number, required: true }, // Thời gian gói, tính bằng số ngày (ví dụ: 30, 90, 180, 360...)
  originalPrice: { type: Number, required: true }, // Giá gốc
  discountedPrice: { type: Number, required: true }, // Giá đã giảm
  dailyCost: { type: Number, required: true }, // Chi phí hàng ngày (có thể tính từ giá giảm / thời gian)
  discountPercent: { type: Number, required: true }, // Tỉ lệ giảm giá (ví dụ: 50%)
  description: { type: String, default: '' } // Mô tả (tuỳ chọn)
}, {
  timestamps: true // Tự động thêm thời gian tạo và cập nhật
});

// Tạo model từ schema
const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

module.exports = SubscriptionPlan;
