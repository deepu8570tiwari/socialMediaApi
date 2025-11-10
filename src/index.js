const express= require("express");
const connectDB=require("./configs/database")
const loginSignupRouter=require("./routes/loginSignUp");
const userRouter=require("./routes/userRoutes");
const dotenv=require("dotenv");
dotenv.config();
const morgan=require("morgan");
const helmet=require("helmet");
const app=express();
app.use(express.json());
app.use(helmet());
app.use(morgan("common"))
app.use("/api/v1",loginSignupRouter);
app.use("api/v1",userRouter);
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on ${process.env.PORT}`);
    connectDB()
})