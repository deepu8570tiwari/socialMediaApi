const User=require("../models/userModel");
const tryCatch=require("../utils/tryCatch");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
dotenv.config();
const registerUser= tryCatch(async(req,res)=>{
    const {username, email,password}=req.body;
    if (!username || !email || !password) {
        return res.status(422).json({ message: "All fields are required" });
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
        message:
            "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character, and be at least 6 characters long"
        });
    }
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });
    if (existingUser) {
    return res.status(409).json({
      message: existingUser.email === email
        ? "Email already registered"
        : "Username already taken"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword
  });

  await newUser.save();
  const token=jwt.sign({_id:newUser._id,email: newUser.email},process.env.JWT_SECRET, {expiresIn:"5y"})
  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email
    },
    token
  });

})
module.exports={registerUser}