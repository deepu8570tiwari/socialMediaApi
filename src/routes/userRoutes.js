const express= require("express");
const routes=express.Router();
const { upload, uploadToCloudinary } = require('../middleware/isUpload');
const authenticateToken = require('../middleware/authMiddleware');
const {
    allUser,
    uploadProfileUser,
    getUserById,
    followUser,
    unfollowUser,
    getFollowCounts,
    getFollowersList,
    getFollowingList,
    getSuggestedUsers
    }=require("../controllers/userProfile");
routes.get('/users', authenticateToken,allUser);
routes.get('/users/:id',authenticateToken,getUserById);
routes.post("/users/follow/:id", authenticateToken, followUser);
routes.post("/users/unfollow/:id", authenticateToken, unfollowUser);
routes.get("/users/followers/:id", authenticateToken, getFollowersList);
routes.get("/users/following/:id", authenticateToken, getFollowingList);
routes.post("/users/followcount/", authenticateToken, getFollowCounts);
routes.get("/users/suggested", authenticateToken, getSuggestedUsers);
routes.put('/upload-profile',authenticateToken,upload.single('profilePicture'),uploadProfileUser);
module.exports=routes;