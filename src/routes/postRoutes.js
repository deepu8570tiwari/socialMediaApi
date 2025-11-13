const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {upload} = require("../middleware/isUpload");

const {
  createPost,
  getAllPost,
  getSinglePost,
  deletePost,
  likedDislikedPost,
  commentPost,
} = require("../controllers/postController");

router.post("/posts", authenticateToken, upload.single("mediaUrl"), createPost);
router.get("/posts", authenticateToken, getAllPost);
router.get("/posts/:id", authenticateToken, getSinglePost);
router.delete("/posts/:id", authenticateToken, deletePost);
router.put("/posts/:id/like", authenticateToken, likedDislikedPost);
router.post("/posts/:id/comment", authenticateToken, commentPost);

module.exports = router;
