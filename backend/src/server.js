import express from "express";
import cors from "cors";
import errorhandler from "./middlewares/errorhandle.middlewares.js";
import connectDB from "./db/dbconnection.js";
import path from "path";
import authroute from "./routes/auth.routes.js";
import documentroute from "./routes/document.routes.js";
import airoute from "./routes/ai.routes.js";
import flashcardroute from "./routes/flashcard.routes.js";
import quizroute from "./routes/quize.routes.js";
import progressroute from "./routes/progress.routes.js"
//in es6 we have direct access to __dirname and __filename this is path
const {filename,dirname}=import.meta;

//create an instance of express app
const app=express();

//connect the moongoose to the database
connectDB();

//configure the cors middleware to allow requests from the frontend
app.use(cors(
    {
        origin:"*",
        credentials:true,
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"]
    }
))

//due to this we can access the req.body data
app.use(express.json());

//this is used to parse the urlencoded data sent from the frontend
app.use(express.urlencoded({extended:true}));

//make the public folder accessible to the frontend
app.use(express.static(path.join(dirname,"../public")));
app.use(
  "/uploads/documents",
  express.static(path.join(dirname, "uploads/documents"))
);
//routes 
app.use("/api/v1/auth",authroute)
app.use("/api/v1/documents",documentroute)
app.use("/api/v1/flashcards",flashcardroute)
app.use("/api/v1/ai",airoute)
app.use("/api/v1/quizess",quizroute)
app.use("/api/v1/progress",progressroute)

//global error handling middleware
app.use(errorhandler)
//404 not found error handling middleware
app.use((req,res)=>{
    res.status(404).json({
        sucess:false,
        message:"Route not found",
        statuscode:404
    })
})

//server is listening
app.listen(process.env.PORT || 8000,()=>{
    console.log(`server is listening in ${process.env.NODE_ENV} mode on port ${process.env.PORT || 8000}`);
})

process.on("unhandledRejection",(err)=>{
    console.log(err.message);
    process.exit(1);
})




