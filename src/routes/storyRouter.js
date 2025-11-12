const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {upload} = require("../middleware/isUpload"); 

const {
  createStory,
  getAllStory,
  viewAllStories,
  deleteStories,
  likedDislikedStories,
  commentStories,
} = require("../controllers/storyController");

router.post("/stories", authenticateToken, upload.single("file"), createStory);

router.get("/stories", authenticateToken, getAllStory);

router.put("/stories/:id/view", authenticateToken, viewAllStories);

router.delete("/stories/:id", authenticateToken, deleteStories);

router.put("/stories/:id/like", authenticateToken, likedDislikedStories);

router.post("/stories/:id/comment", authenticateToken, commentStories);

module.exports = router;
