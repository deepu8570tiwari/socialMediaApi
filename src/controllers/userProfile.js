const User=require("../models/userModel");
const {tryCatch}=require("../utils/tryCatch");
const allUser= tryCatch(async(req,res)=>{
    let getAllUsers=await User.find();
    res.status(200).json({message:"All Users Listed", data:getAllUsers});
})
module.exports={allUser};