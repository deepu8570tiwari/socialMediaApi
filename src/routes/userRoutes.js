const express= require("express");
const routes=express.Router();
const {allUser}=require("../controllers/userProfile");
routes.get('/users', allUser);
module.exports=routes;