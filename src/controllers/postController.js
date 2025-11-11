const { tryCatch } = require("../utils/tryCatch");
const Post = require("../models/postModel");

// ===============================
//  CREATE POST
// ===============================
const createPost = tryCatch(async (req, res) => {
    const { caption, mediaType } = req.body;
    const userId = req.user._id;

    if (!req.file || !req.file.path) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const mediaUrl = req.file.path;

    const post = await Post.create({
        user: userId,
        mediaType,
        mediaUrl,
        caption
    });

    return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: post
    });
});


const getAllPost = tryCatch(async (req, res) => {
    const getAll = await Post.find()
        .populate("user", "username profilePicture")
        .populate("comments.user", "username profilePicture")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        message: "All posts fetched successfully",
        data: getAll
    });
});


const getSinglePost = tryCatch(async (req, res) => {
    const singlePost = await Post.findById(req.params.id)
        .populate("user", "username profilePicture")
        .populate("comments.user", "username profilePicture");

    if (!singlePost) {
        return res.status(404).json({ success: false, message: "No post found" });
    }

    return res.status(200).json({
        success: true,
        message: "Single post fetched successfully",
        data: singlePost
    });
});


const deletePost = tryCatch(async (req, res) => {
    const userId = req.user._id;
    const findPost = await Post.findById(req.params.id);

    if (!findPost) {
        return res.status(404).json({ success: false, message: "No post found" });
    }

    if (findPost.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: "User not authorized to delete this post" });
    }

    await Post.deleteOne({ _id: req.params.id });

    return res.status(200).json({
        success: true,
        message: "Post deleted successfully"
    });
});


const likedDislikedPost = tryCatch(async (req, res) => {
    const userId = req.user._id;
    const findPost = await Post.findById(req.params.id);

    if (!findPost) {
        return res.status(404).json({ success: false, message: "No post found" });
    }

    const index = findPost.likes.indexOf(userId);

    if (index === -1) {
        findPost.likes.push(userId);
    } else {
        findPost.likes.splice(index, 1);
    }

    await findPost.save();

    return res.status(200).json({
        success: true,
        message: index === -1 ? "Post liked successfully" : "Post unliked successfully",
        likesCount: findPost.likes.length,
        likes: findPost.likes
    });
});


const commentPost = tryCatch(async (req, res) => {
    const userId = req.user._id;
    const { text } = req.body;

    const findPost = await Post.findById(req.params.id);
    if (!findPost) {
        return res.status(404).json({ success: false, message: "No post found" });
    }

    const comment = {
        user: userId,
        text,
        createdAt: new Date()
    };

    findPost.comments.push(comment);
    await findPost.save();

    const updatedPost = await Post.findById(findPost._id)
        .populate("comments.user", "username profilePicture");

    return res.status(200).json({
        success: true,
        message: "Comment added successfully",
        comments: updatedPost.comments
    });
});

module.exports = {
    createPost,
    getAllPost,
    getSinglePost,
    deletePost,
    likedDislikedPost,
    commentPost
};
