const mongoose=require("mongoose");
const ReelSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User",
    },
    mediaUrl:{
        type:String,
        required:true,
    },
    publicId:{
        type:String,
        required:true,
    },
    caption:{
        type:String,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    comments:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            text:String,
            createdAt:Date,
        }
    ],
},{timestamps:true})
module.exports=mongoose.model("Reel",ReelSchema);