const tryCatch=require("../../utils/tryCatch");
const User=require("../models/userModel");
const dotenv=require("dotenv");
dotenv.config();
const resetPassword = tryCatch(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(422).json({ message: "Token and new password required" });
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character, and be at least 6 characters long",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
});
module.exports=resetPassword;