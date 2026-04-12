import mongoose,{Schema} from "mongoose";

const flashcardschema=new Schema({
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
    cards:[{
        question:{
            type:String,
            required:true
        },
        answer:{
            type:String,
            required:true
        },
        difficulty:{
            type:String,
            enum:["easy","medium","hard"],
            default:"medium"
        },
        lastreviewed:{
            type:Date,
            default:null
        },
        reviewcount:{
            type:Number,
            default:0
        },
        isstarred:{
            type:Boolean,
            default:false
        }
    }]
},{timestamps:true});

flashcardschema.index({userid:1,documentid:1});
const Flashcards=mongoose.model("Flashcards",flashcardschema);
export default Flashcards;