const tryCatch=require("../../utils/tryCatch");
const User=require("../models/userModel");
const dotenv=require("dotenv");
dotenv.config()
const verifyUser = tryCatch(async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: "Token is required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
});
module.exports=verifyUser;