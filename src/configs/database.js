const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config();
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.NODE_MONGO_URI,{
            serverSelectionTimeoutMS: 10000,
            dbName:"socialMedia",
        })
        console.log("Database is connected ")
    } catch (error) {
        console.log(error)
    }
    
}
module.exports = connectDB;