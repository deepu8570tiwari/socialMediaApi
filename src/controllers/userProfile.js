const User=require("../models/userModel");
const {tryCatch}=require("../utils/tryCatch");
const { uploadToCloudinary } = require("../middleware/isUpload");

const allUser= tryCatch(async(req,res)=>{
    let getAllUsers=await User.find();
    res.status(200).json({message:"All Users Listed", data:getAllUsers});
})
const uploadProfileUser = tryCatch(async (req, res) => {
  const userId = req.user.id;
  if (!req.file) {
    return res.status(400).json({ message: "Profile image is required" });
  }
  const resourceType = req.file.mimetype.startsWith("video/") ? "video" : "image";

  const result = await uploadToCloudinary(req.file.buffer, "profilePicture", resourceType);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profilePicture: result.secure_url },
    { new: true }
  ).select("-password");

  res.status(200).json({
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

module.exports={allUser,uploadProfileUser};