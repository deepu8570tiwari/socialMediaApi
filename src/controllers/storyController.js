const { tryCatch } = require("../utils/tryCatch");
const Story = require("../models/storyModel");

const createStory = tryCatch(async (req, res) => {
  const { mediaType } = req.body;
  const userId = req.user._id;

  if (!req.file || !req.file.path) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const mediaUrl = req.file.path;
  const expiryAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const story = await Story.create({
    user: userId,
    mediaType,
    mediaUrl,
    expiryAt,
  });

  return res.status(201).json({
    success: true,
    message: "Story created successfully",
    data: story,
  });
});

const getAllStory = tryCatch(async (req, res) => {
  const getAllStories = await Story.find({ expiryAt: { $gt: new Date() } })
    .populate("user", "username profilePicture")
    .populate("comments.user", "username profilePicture")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: "All active stories fetched successfully",
    data: getAllStories,
  });
});


const viewAllStories = tryCatch(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const story = await Story.findById(id);
  if (!story) {
    return res.status(404).json({ success: false, message: "No story found" });
  }

  if (!story.viewers.includes(userId)) {
    story.viewers.push(userId);
    await story.save();
  }

  return res.status(200).json({
    success: true,
    message: "Story viewed successfully",
    viewersCount: story.viewers.length,
  });
});


const likedDislikedStories = tryCatch(async (req, res) => {
  const userId = req.user._id;
  const story = await Story.findById(req.params.id);

  if (!story) {
    return res.status(404).json({ success: false, message: "No story found" });
  }

  const index = story.likes.indexOf(userId);
  if (index === -1) {
    story.likes.push(userId);
  } else {
    story.likes.splice(index, 1);
  }

  await story.save();

  return res.status(200).json({
    success: true,
    message: index === -1 ? "Story liked successfully" : "Story unliked successfully",
    likesCount: story.likes.length,
    likes: story.likes,
  });
});

const commentStories = tryCatch(async (req, res) => {
  const userId = req.user._id;
  const { text } = req.body;

  const story = await Story.findById(req.params.id);
  if (!story) {
    return res.status(404).json({ success: false, message: "No story found" });
  }

  const comment = {
    user: userId,
    text,
    createdAt: new Date(),
  };

  story.comments.push(comment);
  await story.save();

  const updatedStory = await Story.findById(story._id).populate(
    "comments.user",
    "username profilePicture"
  );

  return res.status(200).json({
    success: true,
    message: "Comment added successfully",
    comments: updatedStory.comments,
  });
});


const deleteStories = tryCatch(async (req, res) => {
  const userId = req.user._id;
  const story = await Story.findById(req.params.id);

  if (!story) {
    return res.status(404).json({ success: false, message: "No story found" });
  }

  if (story.user.toString() !== userId.toString()) {
    return res.status(403).json({ success: false, message: "User not authorized to delete this story" });
  }

  await Story.deleteOne({ _id: req.params.id });

  return res.status(200).json({
    success: true,
    message: "Story deleted successfully",
  });
});


module.exports = {
  createStory,
  getAllStory,
  viewAllStories,
  likedDislikedStories,
  commentStories,
  deleteStories,
};
