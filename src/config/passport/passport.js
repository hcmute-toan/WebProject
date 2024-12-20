const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../app/models/userModel");

// Cấu hình passport để sử dụng Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("hehehehehehe");
        // Tìm user theo email và phương thức đăng nhập
        let user = await User.findOne({
          email: profile.emails[0].value,
          authMethod: "google",
        });

        if (!user) {
          // Tạo user mới nếu chưa tồn tại
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            authMethod: "google",
          });
          await user.save();
        }

        // Trả về user khi tìm thấy hoặc tạo mới
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id); // Chỉ lưu ID của user vào session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Lấy user từ cơ sở dữ liệu theo ID
    done(null, user); // Trả về thông tin user
  } catch (error) {
    done(error, null);
  }
});

// Exports passport configuration
module.exports = passport;
