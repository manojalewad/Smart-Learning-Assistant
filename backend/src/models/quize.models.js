import mongoose from "mongoose";
import { Schema } from "mongoose";

const quizeschema=new Schema({
    userid:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    documentid:{
        type:Schema.Types.ObjectId,
        ref:"Documents",
        required:true
    },
    title:{
        type:String,
        required:[true,"Title is required"],
        trim:true,
    },
    questions:[
        {
            question:{
                type:String,
                required:[true,"Question is required"],
            },
            options:{
                type:[String],
                required:[true,"Options are required"],
                validate:[array=>array.length===4,"Options must be an array of 4 strings"]
            },
            correctanswer:{
                type:String,
                required:true
            },
            explanation:{
                type:String,
                default:""
            },
            difficulty:{
                type:String,
                enum:["easy","medium","hard"],
                default:"medium"
            }
        }
    ],
    useranswers:[
        {
            questionindex:{
                type:Number,
                required:true
            },
            selectedanswer:{
                type:String,
                required:true
            },
            iscorrect:{
                type:Boolean,
                required:true
            },
            answerat:{
                type:Date,
                default:Date.now
            }
        }
    ],
    score:{
        type:Number,
        default:0
    },
    totalquestions:{
        type:Number,
        required:true
    },
    completedat:{
        type:Date,
        default:Date.now
    }
},{timestamps:true});

const Quizes=mongoose.model("Quizes",quizeschema);

export default Quizes;
