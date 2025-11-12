const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {upload} = require("../middleware/isUpload"); // ✅ if you use multer for file upload

const {
  createReel,
  getAllReel,
  getSingleReel,
  deleteReel,
  likedDislikedReel,
  commentReel,
} = require("../controllers/reelController");

router.post("/reels", authenticateToken, upload.single("file"), createReel);
router.get("/reels", authenticateToken, getAllReel);
router.get("/reels/:id", authenticateToken, getSingleReel);
router.delete("/reels/:id", authenticateToken, deleteReel);
router.put("/reels/:id/like", authenticateToken, likedDislikedReel);
router.post("/reels/:id/comment", authenticateToken, commentReel);

module.exports = router;
