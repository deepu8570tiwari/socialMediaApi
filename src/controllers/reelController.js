const { tryCatch } = require("../utils/tryCatch");
const Reel = require("../models/reelModel");
const cloudinary = require('../configs/cloudinary');
const { uploadToCloudinary } = require("../middleware/isUpload");
const User=require("../models/userModel");
// ===============================
//  CREATE POST
// ===============================
const createReel = tryCatch(async (req, res) => {
    const { caption } = req.body;
    const userId = req.user.id;
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Determine the resource type dynamically
    const resourceType = req.file.mimetype.startsWith("video/") ? "video" : "image";

    // Upload file buffer to Cloudinary (same helper as in profile upload)
    const result = await uploadToCloudinary(req.file.buffer, "reels", resourceType);

    const reel = await Reel.create({
        userId: userId,
        mediaUrl:result.secure_url,
        publicId: result.public_id,
        caption
    });
     const userInfo= await User.findById(userId);
    if(userInfo){
        userInfo.reels.push(reel._id);
        await userInfo.save();
    }

    return res.status(201).json({
        success: true,
        message: "Reel created successfully",
        data: reel
    });
});


const getAllReel = tryCatch(async (req, res) => {
    const getAllReels = await Reel.find()
        .populate("userId", "username profilePicture")
        .populate("comments.user", "username profilePicture")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        message: "All Reels fetched successfully",
        data: getAllReels
    });
});


const getSingleReel = tryCatch(async (req, res) => {
    const singleReel = await Reel.findById(req.params.id)
        .populate("userId", "username profilePicture")
        .populate("comments.user", "username profilePicture");

    if (!singleReel) {
        return res.status(404).json({ success: false, message: "No Reel found" });
    }

    return res.status(200).json({
        success: true,
        message: "Single Reel fetched successfully",
        data: singleReel
    });
});


const deleteReel = tryCatch(async (req, res) => {
    const userId = req.user.id;
    const findReel = await Reel.findById(req.params.id);
    console.log(findReel);
    if (!findReel) {
        return res.status(404).json({ success: false, message: "No Reel found" });
    }
    if (findReel.userId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: "User not authorized to delete this post" });
    }
    if (findReel.publicId) {
        await cloudinary.uploader.destroy(findReel.publicId);
    }
    await Reel.deleteOne({ _id: req.params.id });
    await User.findByIdAndUpdate(
            userId,
            { $pull: { reels: req.params.id } }, // removes reelsId from reel array
            { new: true } // returns updated document (optional)
        );
    return res.status(200).json({
        success: true,
        message: "Reel deleted successfully"
    });
});


const likedDislikedReel = tryCatch(async (req, res) => {
    const userId = req.user.id;
    const findReel = await Reel.findById(req.params.id);

    if (!findReel) {
        return res.status(404).json({ success: false, message: "No post found" });
    }

    const index = findReel.likes.indexOf(userId);
    if (index === -1) {
        findReel.likes.push(userId);
    } else {
        findReel.likes.splice(index, 1);
    }

    await findReel.save();

    return res.status(200).json({
        success: true,
        message: index === -1 ? "Reel liked successfully" : "Reel unliked successfully",
        likesCount: findReel.likes.length,
        likes: findReel.likes
    });
});


const commentReel = tryCatch(async (req, res) => {
    const userId = req.user.id;
    const { text } = req.body;

    const findReel = await Reel.findById(req.params.id);
    if (!findReel) {
        return res.status(404).json({ success: false, message: "No Reel found" });
    }
    const comment = {
        userId: userId,
        text,
        createdAt: new Date()
    };
    findReel.comments.push(comment);
    await findReel.save();

    const updatedPost = await Reel.findById(findReel._id)
        .populate("comments.user", "username profilePicture");

    return res.status(200).json({
        success: true,
        message: "Comment added successfully",
        comments: updatedPost.comments
    });
});
const toggleSaveReel = tryCatch(async (req, res) => {
  const userId = req.user.id;
  const reelId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found"
    });
  }

  const alreadySaved = user.savedReels.includes(reelId);

  // UNSAVE
  if (alreadySaved) {
    user.savedReels = user.savedReels.filter(id => id.toString() !== reelId);
    await user.save();

    return res.status(200).json({
      status: true,
      action: "unsaved",
      message: "Reel removed from saved"
    });
  }

  // SAVE
  user.savedReels.push(reelId);
  await user.save();

  return res.status(200).json({
    status: true,
    action: "saved",
    message: "Reel saved successfully"
  });
});

const getSavedReels = tryCatch(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId)
    .select("savedReels")
    .populate("savedReels");

  return res.status(200).json({
    status: true,
    total: user.savedReels.length,
    reels: user.savedReels
  });
});
module.exports = {
    createReel,
    getAllReel,
    getSingleReel,
    deleteReel,
    likedDislikedReel,
    commentReel,
    toggleSaveReel,
    getSavedReels
};
