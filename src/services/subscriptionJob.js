const cron = require("node-cron");
const Subscription = require("../app/models/subscriptionModel");
const User = require("../app/models/userModel");

// Lên lịch cron job chạy mỗi ngày lúc 00:00 (nửa đêm)
cron.schedule("0 0 * * *", async () => {
  console.log("Running subscription expiration check...");

  try {
    // Lấy danh sách user với subscription đã hết hạn
    const expiredSubscriptions = await Subscription.find({
      end_date: { $lt: Date.now() }, // Subscription hết hạn
    });

    for (const subscription of expiredSubscriptions) {
      // Tìm người dùng dựa trên user_id trong subscription
      const user = await User.findById(subscription.user_id);

      if (user && user.role === "subscriber") {
        // Cập nhật role thành guest
        user.role = "guest";
        user.subscription_end = null; // Xóa ngày hết hạn subscription trong User
        await user.save();

        console.log(`User ${user.username} role updated to guest.`);
      }

      // (Tuỳ chọn) Nếu cần xoá subscription đã hết hạn
      // await Subscription.findByIdAndDelete(subscription._id);
    }

    console.log("Subscription expiration check completed.");
  } catch (error) {
    console.error("Error while running subscription expiration check:", error);
  }
});

module.exports = cron;
