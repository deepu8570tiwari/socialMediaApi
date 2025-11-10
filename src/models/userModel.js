const mongoose=require("mongoose");
const UserSchema=new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [20, "Username cannot exceed 20 characters"],
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    phone:{
        type:Number,
        min:10
    },
    profilePicture:{
        type:String,
        default:""
    },
    bio:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            refs:"User"
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            refs:"User"
        }
    ],
    savedPosts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            refs:"Post"
        }
    ],
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            refs:"Post"
        }
    ],
    reels:[
        {
            type:mongoose.Schema.Types.ObjectId,
            refs:"Reel"
        }
    ],
    story:[
        {
            type:mongoose.Schema.Types.ObjectId,
            refs:"Story"
        }
    ],
},{timestamps:true})
module.exports=mongoose.model("User",UserSchema);