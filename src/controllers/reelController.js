const { tryCatch } = require("../utils/tryCatch");
const Reel = require("../models/reelModel");
const { uploadToCloudinary } = require("../middleware/isUpload");
// ===============================
//  CREATE POST
// ===============================
const createReel = tryCatch(async (req, res) => {
    const { caption } = req.body;
    const userId = req.user.id;

    if (!req.file || !req.file.path) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Determine the resource type dynamically
    const resourceType = req.file.mimetype.startsWith("video/") ? "video" : "image";

    // Upload file buffer to Cloudinary (same helper as in profile upload)
    const result = await uploadToCloudinary(req.file.buffer, "reels", resourceType);

    const reel = await Reel.create({
        user: userId,
        mediaUrl:result.secure_url,
        caption
    });

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
    const singleReel = await Post.findById(req.params.id)
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

    if (!findReel) {
        return res.status(404).json({ success: false, message: "No Reel found" });
    }

    if (findReel.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: "User not authorized to delete this post" });
    }

    await Reel.deleteOne({ _id: req.params.id });

    return res.status(200).json({
        success: true,
        message: "Reel deleted successfully"
    });
});


const likedDislikedReel = tryCatch(async (req, res) => {
    const userId = req.user._id;
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
    const userId = req.user._id;
    const { text } = req.body;

    const findReel = await Reel.findById(req.params.id);
    if (!findReel) {
        return res.status(404).json({ success: false, message: "No Reel found" });
    }
    const comment = {
        user: userId,
        text,
        createdAt: new Date()
    };
    findReel.comments.push(comment);
    await findReel.save();

    const updatedPost = await Post.findById(findReel._id)
        .populate("comments.user", "username profilePicture");

    return res.status(200).json({
        success: true,
        message: "Comment added successfully",
        comments: updatedPost.comments
    });
});

module.exports = {
    createReel,
    getAllReel,
    getSingleReel,
    deleteReel,
    likedDislikedReel,
    commentReel
};
