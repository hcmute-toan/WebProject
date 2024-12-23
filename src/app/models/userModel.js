// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const Schema = mongoose.Schema;

// // User Schema
// const UserSchema = new Schema({
//   username: { type: String, required: true},
//   password: {
//     type: String,
//     required: function () {
//       return this.authMethod === "local";
//     },
//   }, // Password chỉ yêu cầu nếu authMethod là local
//   email: { type: String, required: true },
//   authMethod: {
//     type: String,
//     enum: ["local", "google"],
//     required: true,
//     default: "local",
//   },
//   role: {
//     type: String,
//     enum: ["guest", "subscriber", "writer", "editor", "administrator"],
//     required: true,
//     default: "guest",
//   },
//   subscription_end: { type: Date, default: null },
//   image: { type: String, default: "/assets/icons/user.svg" },
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date, default: Date.now },
// });

// // Unique constraint for email within a specific authMethod
// UserSchema.index({ email: 1, authMethod: 1 }, { unique: true });

// // Hash password before saving if authMethod is local
// UserSchema.pre("save", async function (next) {
//   if (this.authMethod !== "local" || !this.isModified("password")) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
  username: { type: String, required: true},
  password: {
    type: String,
    required: function () {
      return this.authMethod === "local";
    },
  }, // Password chỉ yêu cầu nếu authMethod là local
  email: { type: String, required: true },
  authMethod: {
    type: String,
    enum: ["local", "google"],
    required: true,
    default: "local",
  },
  role: {
    type: String,
    enum: ["guest", "subscriber", "writer", "editor", "administrator"],
    required: true,
    default: "guest",
  },
  subscription_end: { type: Date, default: null },
  image: { type: String, default: "/assets/icons/user.svg" },
  // created_at: { type: Date, default: Date.now },
  // updated_at: { type: Date, default: Date.now },
},{ timestamps: true });

// Unique constraint for email within a specific authMethod
UserSchema.index({ email: 1, authMethod: 1 }, { unique: true });

// Hash password before saving if authMethod is local
UserSchema.pre("save", async function (next) {
  // Ensure subscription_end is at least 7 days after updated_at
  if (this.subscription_end && this.updated_at) {
    const minSubscriptionEnd = new Date(this.updated_at);
    minSubscriptionEnd.setDate(minSubscriptionEnd.getDate() + 7); // Thêm 7 ngày vào updated_at

    if (this.subscription_end < minSubscriptionEnd) {
      this.subscription_end = minSubscriptionEnd; // Cập nhật subscription_end
    }
  }

  if (this.authMethod !== "local" || !this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", UserSchema);
