import dotenv from "dotenv";
dotenv.config();
import express from "express"
// import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
// dotenv.config()

const app=express();
const PORT=process.env.PORT || 5000

app.use(cors({origin:"http://localhost:3000",credentials:true}))

app.use(express.json()) //allows us to parse incoming requests:req.body
app.use(cookieParser())  //allows us to parse incoming cookies

app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
    connectDB()
    console.log("server is running on port: ",PORT);
});

// 3BI4ncsT2jqDHM48