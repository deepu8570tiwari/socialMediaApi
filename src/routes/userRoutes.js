const express= require("express");
const routes=express.Router();
const { upload, uploadToCloudinary } = require('../middleware/isUpload');
const authenticateToken = require('../middleware/authMiddleware');
const {allUser,uploadProfileUser}=require("../controllers/userProfile");
routes.get('/users', allUser);
routes.put('/upload-profile',authenticateToken,upload.single('profilePicture'),uploadProfileUser);
module.exports=routes;