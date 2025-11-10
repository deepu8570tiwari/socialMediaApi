const User=require("../../models/userModel");
const registerUser=async(req,res)=>{
    const user=new User({
        username:"deepu",
        email:"",
        password:"",
    })
    await user.save();
    res.status(201).json({message:"New User Created successfully", data:user});
}
module.exports={registerUser}