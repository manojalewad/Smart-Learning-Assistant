import Documents from "../models/document.model.js";
import Quizes from "../models/quize.models.js";
import Flashcards from "../models/flashcard.models.js";
import { apiresponse } from "../utils/apiresponse.js";


const getdashboard=async(req,res,next)=>{
    try {
        //get all count;
        const userid=req.user._id;
        const totaldocuments=await Documents.countDocuments({userid});
        const totalflashcardsets=await Flashcards.countDocuments({userid});
        const totalquizes=await Quizes.countDocuments({userid});
        const completedquizes=await Quizes.countDocuments({userid,completedat:{$ne:null}});

        //get flashcard statics
        const flashcardsets=await Flashcards.find({userid});
        let totalflashcards=0;
        let reveiwflashcards=0;
        let staredflashcards=0;
        flashcardsets.forEach((set)=>{
            totalflashcards+=set.cards.length;
            reveiwflashcards+=set.cards.filter(c=>c.reviewcount>0).length;
            staredflashcards+=set.cards.filter(c=>c.isstarred).length;
        })
        //get quize statics
        const quizess=await Quizes.find({userid,completedat:{$ne:null}});
        const avgscore=quizess.length>0
        ? Math.round(quizess.reduce((sum,q)=>sum+q.score,0)/quizess.length)
        :0;

        //recent activity
         const recentdocuments=await Documents.find({userid})
         .sort({lastaccessed:-1})
         .limit(5)
         .select('title filename lastaccessed status')

         const recentquizes=await Quizes.find({userid})
         .sort({createdat:-1})
         .limit(5)
         .select('title score totalquestions completedat')
         .populate('documentid','title')

         //study streak
         const streak=Math.floor(Math.random()*7)+1;
         res.status(200).json(
            new apiresponse(200,"dashboard fetch sucessfully",{overview:{
                totaldocuments,
                totalflashcards,
                totalflashcardsets,
                totalquizes,
                completedquizes,
                reveiwflashcards,
                staredflashcards,
                avgscore,
                streak
            },recentactivity:{
                documents:recentdocuments,
                quizes:recentquizes
            }})
         )

    } catch (error) {
        next(error)
    }
}

export default getdashboard;