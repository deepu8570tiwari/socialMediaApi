const express= require("express");
const cors = require("cors");
const connectDB=require("./configs/database")
const loginSignupRouter=require("./routes/loginSignUp");
const userRouter=require("./routes/userRoutes");
const postRouter=require("./routes/postRoutes");
const reelRouter=require("./routes/reelRouter");
const storyRouter=require("./routes/storyRouter");
const dotenv=require("dotenv");
dotenv.config();
const morgan=require("morgan");
const helmet=require("helmet");
const app=express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"))
app.use("/api/v1",loginSignupRouter);
app.use("/api/v1",userRouter);
app.use("/api/v1/",postRouter)
app.use("/api/v1",reelRouter);
app.use("/api/v1/",storyRouter)
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on ${process.env.PORT}`);
    connectDB()
})