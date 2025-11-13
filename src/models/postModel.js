const mongoose=require("mongoose");
const PostSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User",
    },
    mediaType:{
        type:String,
        enum:["image","video"],
        require:true,
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
module.exports=mongoose.model("Post",PostSchema);