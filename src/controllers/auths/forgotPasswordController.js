const tryCatch=require("../../utils/tryCatch");
const User=require("../models/userModel");
const dotenv=require("dotenv");
dotenv.config();
const forgotPassword = tryCatch(async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(422).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "User not found" });

  const resetToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // (In real apps: email this token or OTP)
  return res.status(200).json({
    message: "Password reset token generated",
    resetToken,
  });
});
module.exports=forgotPassword;