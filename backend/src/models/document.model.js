import mongoose,{Schema} from "mongoose";

const documentschema=new Schema({
    userid:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    filename:{
        type:String,
        required:true
    },
    filepath:{
        type:String,
        required:true
    },
    filesize:{
        type:Number,
        required:true
    },
    extractedtext:{
        type:String,
        default:""
    },
    chunks:[{
        content:{
            type:String,
            required:true
        },
        pagenumber:{
            type:Number,
            default:0
        },
        chunkindex:{
            type:Number,
            required:true
        }
    }],
    uploaddate:{
        type:Date,
        default:Date.now
    },
    lastaccessed:{
        type:Date,
        default:Date.now
    },
    status:{
        type:String,
        enum:["processing","ready","failed"],
        default:"processing"
    }
},{timestamps:true});

documentschema.index({userid:1,uploaddate:-1});
const Documents=mongoose.model("Documents",documentschema);

export default Documents;