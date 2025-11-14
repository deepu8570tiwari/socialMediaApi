const User=require("../models/userModel");
const {tryCatch}=require("../utils/tryCatch");
const { uploadToCloudinary } = require("../middleware/isUpload");

const allUser= tryCatch(async(req,res)=>{
    let getAllUsers=await User.find();
    res.status(200).json({message:"All Users Listed", users:getAllUsers});
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
const getUserById = tryCatch(async (req, res) => {
  const userId = req.user.id;
  console.log("User ID:", userId);
  // Fetch user
  const result = await User.findById(userId);
  // If no user
  if (!result) {
    return res.status(400).json({
      status: false,
      message: "No user found"
    });
  }

  // Success
  return res.status(200).json({
    status: true,
    message: "Single User",
    user: result
  });
});
const followUser = tryCatch(async (req, res) => {
  const currentUserId = req.user.id;
  const targetUserId = req.params.id;    // user to follow

  if (currentUserId === targetUserId) {
    return res.status(400).json({
      status: false,
      message: "You cannot follow yourself"
    });
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    return res.status(404).json({
      status: false,
      message: "User to follow does not exist"
    });
  }

  // Already following?
  if (currentUser.following.includes(targetUserId)) {
    return res.status(400).json({
      status: false,
      message: "Already following this user"
    });
  }

  // Add follow
  currentUser.following.push(targetUserId);
  targetUser.followers.push(currentUserId);

  await currentUser.save();
  await targetUser.save();

  return res.status(200).json({
    status: true,
    message: "User followed successfully"
  });
});
const unfollowUser = tryCatch(async (req, res) => {
  const currentUserId = req.user.id;
  const targetUserId = req.params.id;  // user to unfollow

  if (currentUserId === targetUserId) {
    return res.status(400).json({
      status: false,
      message: "You cannot unfollow yourself"
    });
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    return res.status(404).json({
      status: false,
      message: "User to unfollow does not exist"
    });
  }

  // Not following?
  if (!currentUser.following.includes(targetUserId)) {
    return res.status(400).json({
      status: false,
      message: "You are not following this user"
    });
  }

  // Remove follow
  currentUser.following = currentUser.following.filter(
    id => id.toString() !== targetUserId
  );

  targetUser.followers = targetUser.followers.filter(
    id => id.toString() !== currentUserId
  );

  await currentUser.save();
  await targetUser.save();

  return res.status(200).json({
    status: true,
    message: "User unfollowed successfully"
  });
});
const getFollowCounts = tryCatch(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId).select("followers following");

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found"
    });
  }

  return res.status(200).json({
    status: true,
    followers: user.followers.length,
    following: user.following.length
  });
});
const getFollowersList = tryCatch(async (req, res) => {
  const userId = req.params.id;

  // Fetch only required fields + populate follower users
  const user = await User.findById(userId)
    .select("followers")
    .populate("followers", "username email");

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found"
    });
  }

  return res.status(200).json({
    status: true,
    message: "Followers fetched successfully",
    total_followers: user.followers.length,
    followers: user.followers
  });
});
const getFollowingList = tryCatch(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId)
    .select("following")
    .populate("following", "username email");

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found"
    });
  }

  return res.status(200).json({
    status: true,
    message: "Following list fetched successfully",
    total_following: user.following.length,
    following: user.following
  });
});
const getSuggestedUsers = tryCatch(async (req, res) => {
  const currentUserId = req.user.id;

  // Fetch logged in user's following list
  const currentUser = await User.findById(currentUserId).select("following");

  if (!currentUser) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  // Suggested = users not followed + not yourself
  const suggestedUsers = await User.find({
    _id: { $nin: [...currentUser.following, currentUserId] },
  })
    .select("username email")
    .limit(10); // <= return only 10 suggestions

  return res.status(200).json({
    status: true,
    message: "Suggested users fetched successfully",
    total_suggested: suggestedUsers.length,
    users: suggestedUsers,
  });
});

module.exports={
    allUser,
    uploadProfileUser,
    getUserById,
    followUser,
    unfollowUser,
    getFollowCounts,
    getFollowersList,
    getFollowingList,
    getSuggestedUsers
};