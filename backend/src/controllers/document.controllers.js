import mongoose from "mongoose";
import { apierror } from "../utils/apierror.js";
import fs from "fs/promises";
import Documents from "../models/document.model.js";
import { apiresponse } from "../utils/apiresponse.js";
import { chunkText } from "../utils/textchunker.js";
import parsepdf from "../utils/pdfParser.js";
import Flashcards from "../models/flashcard.models.js";
import Quizes from "../models/quize.models.js";
import cloudinaryupload from "../utils/cloudnaryupload.js";

const uploaddocument=async(req,res,next)=>{
    try {
        if(!req.file){
            throw new apierror(400,"No file uploaded");
        }
        //if file is uploaded check for title
        const {title}=req.body;
        if(!title){
            await fs.unlink(req.file.path).catch(()=>{});
            throw new apierror(400,"Title is required");
        }
        //create url to uploaded file
        const localpath=req.file.path;
        const fileup=await cloudinaryupload(localpath);
        if(!fileup?.url){
        await fs.unlink(localpath).catch(()=>{});
        throw new apierror(402,"file url is not available to update");
        }
        const fileurl=fileup.url;
        console.log(fileurl);
        //create document in database
        const document= await Documents.create({
            userid:req.user._id,
            title,
            filename:req.file.originalname,
            filesize:req.file.size,
            filepath:fileurl,
            status:"processing"
        })
        processpdf(document._id,req.file.path).catch(err=>{
            console.error("Error processing PDF:", err);
        });
        res.status(201).json(
            new apiresponse(200,"Document uploaded successfully",document)
        )
    } catch (error) {
        if(req.file?.path){
            await fs.unlink(req.file.path).catch(()=>{});
        }
        return next(error);
    }
}

// Function to process PDF and extract text
const processpdf=async(documentid,filepath)=>{
    try {
        
        const text=await parsepdf(filepath);
        console.log("Extracted text:", text);
        const chunks=chunkText(text.text,500,50);
        const currdocument=await Documents.findByIdAndUpdate(documentid,{
            extractedtext:text.text,
            status:"ready",
            chunks:chunks
        })
    } catch (error) {
        console.log("Error while processing PDF:", error);
        await Documents.findByIdAndUpdate(documentid,{
            status:"failed"
        })
    } finally {
        await fs.unlink(filepath).catch(()=>{});
    }
}

const getdocuments=async(req,res,next)=>{
    try {
        if(!req.user){
            throw new apierror("User not found",404);
        }
       const documents=await Documents.aggregate([
        {
            $match:{
                userid:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"flashcards",
                localField:"_id",
                foreignField:"documentid",
                as:"setofflashcards"
            }
        },
        {
            $lookup:{
                from:"quizes",
                localField:"_id",
                foreignField:"documentid",
                as:"setofquzies"
            }
        },
        {
            $addFields:{
                flashcardcount:{$size:"$setofflashcards"},
                quzicount:{$size:"$setofquzies"}
            }
        },
        {
            $project:{
                setofquzies:0,
                setofflashcards:0,
                extractedtext:0,
                chunks:0
            }
        },
        {
            $sort:{
                uploaddate:-1
            }
        }
       ])
       res.status(200).json(
        new apiresponse(200,"Documents fetched successfully",{
            data:documents,
            count:documents.length
        })
       )
    } catch (error) {
        next(error);
    }
}

const getdocumentbyid=async(req,res,next)=>{
    try {
        const documentid=req.params.id;
        if(!documentid){
            throw new apierror(400,"Document id is required");
        }
        const flashcardcount=await Flashcards.countDocuments({documentid,userid:req.user._id});
        const quizecount=await Quizes.countDocuments({documentid,userid:req.user._id});
        //updata last accessed date
        const document=await Documents.findOne({_id:documentid,userid:req.user._id});
        document.lastaccessed=Date.now();
        await document.save();
        const documentdata=document.toObject();
        documentdata.flashcardcount=flashcardcount;
        documentdata.quizecount=quizecount;
        res.status(200).json(
            new apiresponse(200,"Document fetched successfully",documentdata)
        )
    } catch (error) {
        next(error);
    }
}
const deletedocument=async(req,res,next)=>{
    try {
        const documentid=req.params.id;
        if(!documentid){
            throw new apierror(400,"Document id is required");
        }
        const document=await Documents.findOne({_id:documentid,userid:req.user._id});
        if(!document){
            throw new apierror(400,"invalid document id ");
        }
        //delete file from system
        await fs.unlink(document.filepath).catch(()=>{})
        //delete file from database
        await document.deleteOne();
        res.status(200).json(
            new apiresponse(200,"Document deleted sucessfully")
        )
    } catch (error) {
        next(error);
    }
}

const updatedocument=async(req,res,next)=>{
    try {
        const documentid=req.params.id;
        const {newtitle}=req.body;
        if(!newtitle){
        throw new apierror(400,"New title is required");
        }
        if(!documentid){
            throw new apierror(400,"Document id is required");
        }
        const document=await Documents.findOne({_id:documentid,userid:req.user._id});
        if(!document){
            throw new apierror(400,"invalid document id ");
        }
        document.title=newtitle;
        await document.save();
        res.status(200).json(
            new apiresponse(200,"Document is title is updated",document)
        )

    } catch (error) {
        next(error);
    }
}
export {uploaddocument,getdocuments,getdocumentbyid,deletedocument,updatedocument};
