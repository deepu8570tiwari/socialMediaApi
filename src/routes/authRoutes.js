const express= require("express");
const routes=express.Router();
const {registerUser}=require("../controllers/auth/authController");
routes.post('/register', registerUser);
module.exports=routes;