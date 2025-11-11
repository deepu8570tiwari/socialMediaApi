const tryCatch=require("../../utils/tryCatch");
const User=require("../models/userModel");
const userVerified = tryCatch(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user)
    return res.status(404).json({ message: "User not found" });

  return res.status(200).json({
    verified: user.isVerified,
    message: user.isVerified ? "User is verified" : "User is not verified",
  });
});
module.exports=userVerified;