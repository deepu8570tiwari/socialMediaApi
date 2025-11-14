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
  toggleSaveReel,
  getSavedReels
} = require("../controllers/reelController");

router.post("/reels", authenticateToken, upload.single("mediaUrl"), createReel);
router.get("/reels", authenticateToken, getAllReel);
router.get("/reels/:id", authenticateToken, getSingleReel);
router.delete("/reels/:id", authenticateToken, deleteReel);
router.put("/reels/:id/like", authenticateToken, likedDislikedReel);
router.post("/reels/:id/comment", authenticateToken, commentReel);
router.post("/reels/toggle-save/:id", authenticateToken, toggleSaveReel);
router.get("/reels/saved", authenticateToken, getSavedReels);
module.exports = router;
