import Quizes from "../models/quize.models.js";
import { apiresponse } from "../utils/apiresponse.js";
import { apierror } from "../utils/apierror.js";
//all quize generate by document id
const getallquizes=async(req,res,next)=>{
    try {
       const documentid=req.params.id;
       const quizes=await Quizes.find({
        userid:req.user._id,
        documentid
       }).populate('documentid','title filename')
       .sort({createdAt:-1});
       res.status(200).json(new apiresponse(200,"Quizes fetched successfully",{quizes,count:quizes.length})); 
    } catch (error) {
        next(error)
    }
}

const getquizebyid=async(req,res,next)=>{
    try {
        const quizeid=req.params.id;
        const quize=await Quizes.findOne({_id:quizeid,userid:req.user._id}).populate('documentid','title filename');
        if(!quize){
            throw new apierror(404,"Quize not found");
        }
        res.status(200).json(new apiresponse(200,"Quize fetched successfully",quize));
    } catch (error) {
        next(error)
    }
}

const submitquiz=async(req,res,next)=>{
    try {
        const {answer}=req.body;
        if(!Array.isArray(answer)){
            throw new apierror(400,"Answer is required");
        }
        const quizeid=req.params.id;
        const quize=await Quizes.findOne({_id:quizeid,userid:req.user._id});
        if(!quize){
            throw new apierror(404,"Quize not found");
        }
        
        
        //process answer
        // console.log(quize);
        let correctcount=0;
        const useranswers=[];
        answer.forEach(ans=>{
            const {questionindex,selectedanswer}=ans;
            // console.log(questionindex);
            if(questionindex<quize.questions.length){
                // console.log(quize.questions[questionindex].correctanswer)
                const iscorrect=quize.questions[questionindex].correctanswer===selectedanswer;
                if(iscorrect){
                    correctcount++;
                }
                useranswers.push({
                    questionindex,
                    selectedanswer,
                    iscorrect,
                    answerat:new Date()
                })
            }
        })
        const score=Math.round((correctcount/quize.questions.length)*100);
        quize.score=score;
        quize.useranswers=useranswers;
        quize.completedat=new Date();
        await quize.save();
        res.status(200).json(new apiresponse(200,"Quize submitted successfully",{quizeid,score,percentage:score,correctcount,totalquestions:quize.totalquestions,useranswers}));
    } catch (error) {
        next(error);
    }
}

const getquizresult=async(req,res,next)=>{
    try {
        const quizid=req.params.id;
        const quize=await Quizes.findOne({_id:quizid,userid:req.user._id}).populate('documentid','title filename');
        if(!quize){
            throw new apierror(404,"Quize not found");
        }
        if(!quize.completedat){
            throw new apierror(400,"Quize is not completed");
        }
        //build the detailed result
        const result=quize.questions.map((question,index)=>{
            const useranswer=quize.useranswers.find(useranswer=>useranswer.questionindex===index);
            return {
                question:question.question,
                options:question.options,
                correctanswer:question.correctanswer,
                selectedanswer:useranswer?.selectedanswer || null,
                iscorrect:useranswer?.iscorrect || false,
                explanation:question.explanation
            };
        })
        res.status(200).json(
            new apiresponse(200,"Quize result fetched successfully",{quize:{
                id:quize._id,
                title:quize.title,
                document:quize.documentid,
                score:quize.score,
                totalquestions:quize.totalquestions,
                completedat:quize.completedat
            },results:result})
        )
    } catch (error) {
        next(error);
    }
}

const deletequiz=async(req,res,next)=>{
    try {
        const quizeid=req.params.id;
        const quize=await Quizes.findOne({_id:quizeid,userid:req.user._id});
        if(!quize){
            throw new apierror(404,"Quize not found");
        }
        await quize.deleteOne();
        res.status(200).json(new apiresponse(200,"Quize deleted successfully"));
    } catch (error) {
        
    }
}

export {
    getallquizes,
    getquizebyid,
    submitquiz,
    getquizresult,
    deletequiz
}





