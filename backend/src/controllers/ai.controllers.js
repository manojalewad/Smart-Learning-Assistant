import Chathistorys from "../models/aichathistory.models.js";
import Documents from "../models/document.model.js";
import Flashcards from "../models/flashcard.models.js";
import Quizes from "../models/quize.models.js";
import { chatWithContext, explainConcept, generateFlashcards, generateQuiz } from "../utils/geminiservices.js";
import { findRelevantChunks } from "../utils/textchunker.js";
import { generateSummary } from "../utils/geminiservices.js";
import { apiresponse } from "../utils/apiresponse.js";
import { apierror } from "../utils/apierror.js";

const generateflashcard=async(req,res,next)=>{
    try {
        const {documentid}=req.body;
        if(!documentid){
            throw new apierror(400,"Document id is required");
        }
        const document=await Documents.findOne({_id:documentid,userid:req.user._id,status:"ready"});
        if(!document){
            throw new apierror(400,"Invalid document id");
        }
        console.log("i am ok till here");
        //generate flash card
        console.log(document);
        const cards=await generateFlashcards(document.extractedtext,10);
        // console.log("i am not ok")
        const flashcards=await Flashcards.create({userid:req.user._id,documentid,
            cards:cards.map(card=>(
                {
                    question:card.question,
                    answer:card.answer,
                    difficulty:card.difficulty,
                    lastreviewed:new Date(),
                    reviewcount:0,
                    isstarred:false,
                }
            ))})
        res.status(200).json(new apiresponse(200,"Flashcards generated successfully",flashcards));
    } catch (error) {
        next(error);
    }
}

const generatequiz=async(req,res,next)=>{
    try {
        const {documentid,numquestion=5,title}=req.body;
        if(!documentid || !title){
            throw new apierror(400,"Document id and title is required");
        }
        const document=await Documents.findOne({_id:documentid,userid:req.user._id,status:"ready"});
        if(!document){
            throw new apierror(400,"Invalid document id");
        }
        //generate quize
        const quizes=await generateQuiz(document.extractedtext,parseInt(numquestion));
        const allquize=await Quizes.create({
                questions:quizes,
                useranswers:[],
                totalquestions:quizes.length,
                title,
                userid:req.user._id,
                documentid:documentid
        })
        res.status(200).json(new apiresponse(200,"Quizes generated successfully",allquize));
        
    } catch (error) {
        next(error);
    }
}

const generatesummary=async(req,res,next)=>{
    try {
        const {documentid}=req.body;
        if(!documentid){
            throw new apierror(400,"Document id is required");
        }
        const document=await Documents.findOne({_id:documentid,userid:req.user._id,status:"ready"});
        if(!document){
            throw new apierror(400,"Invalid document id");
        }
        const summary=await generateSummary(document.extractedtext);
        res.status(200).json(new apiresponse(200,"Summary generated successfully",{summary,documentid,documenttitle:document.title}));
    } catch (error) {
        next(error)
    }
}

const chat=async(req,res,next)=>{
    try {
        const {documentid,question}=req.body;
        if(!documentid || !question){
            throw new apierror(400,"Document id and question is required");
        }

        const document=await Documents.findOne({_id:documentid,userid:req.user._id,status:"ready"});
        if(!document){
            throw new apierror(400,"Invalid document id");
        }
      //find relevant chunk
    //   console.log(document.chunks);
      const chunk=await findRelevantChunks(document.chunks,question,3);
    //   console.log(chunk)
      const chunkindexes=chunk.map(c=>c.chunkindex);
      //find or create chat history
      let chathistory=await Chathistorys.findOne({
        userid:req.user._id,
        documentid:documentid,
      })
      if(!chathistory){
            chathistory=await Chathistorys.create({
                userid:req.user._id,
                documentid:documentid,
                message:[]
            })
        }
        //generate response using gemini
        const answer=await chatWithContext(question,chunk);
        //update chat history
        chathistory.message.push({
            role:"user",
            content:question,
            timestamp:new Date(),
            relevantchunks:[]
        },{
            role:"assistant",
            content:answer,
            timestamp:new Date(),
            relevantchunks:chunkindexes
        })
        await chathistory.save();
        res.status(200).json(
            new apiresponse(200,"Chat response generated successfully",{
                question,
                answer,
                relevantchunks:chunkindexes,
                chathistoryid:chathistory._id
            })
        )
    } catch (error) {
        next(error)
    }
}

const explainconcept=async(req,res,next)=>{
   try {
     const {concept ,documentid}=req.body;
     if(!concept || !documentid){
         throw new apierror(400,"Concept and document id is required");
     }
     const document=await Documents.findOne({
         userid:req.user._id,
         _id:documentid,
         status:"ready"
     })
     if(!document){
         throw new apierror(400,"Invalid document id");
     }
 
     //find revelant chunk
     const relchunk=await findRelevantChunks(document.chunks,concept,3);
     const context=relchunk.map(c=>c.content).join("\n\n");
     const response=await explainConcept(concept,context);
     res.status(200).json(
         new apiresponse(200,"Concept explanation generated successfully",{response,concept,relevantchunks:relchunk.map(c=>c.chunkindex)})
     )
   } catch (error) {
    next(error)
   }
}
const getchathistory=async(req,res,next)=>{
    try {
       
        const {documentid}=req.body;
        if(!documentid){
            throw new apierror(400,"Document id is required");
        }
       
        const chathistory=await Chathistorys.findOne({
            userid:req.user._id,
            documentid
        })

        if(!chathistory){
            throw new apierror(400,"Chat history not found");
        }
        res.status(200).json(
            new apiresponse(200,"Chat history found successfully",chathistory.message)
        )
    } catch (error) {
        next(error)
    }
}

export {
    generateflashcard,
    generatequiz,
    generatesummary,
    chat,
    explainconcept,
    getchathistory
}