const User=require("../models/userModel");
const {tryCatch}=require("../utils/tryCatch");
const allUser= tryCatch(async(req,res)=>{
    let getAllUsers=await User.find();
    res.status(200).json({message:"All Users Listed", data:getAllUsers});
})
const uploadProfileUser = tryCatch(async (req, res) => {
  const userId = req._id;
  // Check if file exists
  if (!req.file) {
    return res.status(400).json({ message: "Profile image is required" });
  }
  // Determine resource type
  const resourceType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

  // Upload to Cloudinary
  const result = await uploadToCloudinary(req.file.buffer, 'profilePicture', resourceType);
  // Update user profile
  const updateUserProfile = await User.findByIdAndUpdate(
    userId,
    { profilePicture: result.secure_url },
    { new: true }
  );

  res.status(200).json({
    message: "Profile updated successfully",
    data: updateUserProfile,
  });
});

module.exports={allUser,uploadProfileUser};