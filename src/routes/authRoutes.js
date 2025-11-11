const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");


const {registerUser,loginUser} = require("../controllers/auths/loginSignUpController");
const forgotPassword = require("../controllers/auths/forgotPasswordController");
const resetPassword = require("../controllers/auths/resetPasswordController");
const changePassword = require("../controllers/auths/changePasswordController");
const userVerified = require("../controllers/auths/userVerifiedController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", authenticateToken, changePassword);
router.get("/verified", authenticateToken, userVerified);

module.exports = router;
