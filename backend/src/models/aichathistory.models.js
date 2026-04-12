import mongoose,{Schema} from "mongoose";

const aichathistoryschema=new Schema({
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
    message:[
        {
            role:{
                type:String,
                enum:["user","assistant"],
                required:true
            },
            content:{
                type:String,
                required:true
            },
            relevantchunks:{
                type:[Number],
                default:[]
            },
            timestamp:{
                type:Date,
                default:Date.now
            }
        }
    ]
},{timestamps:true});

aichathistoryschema.index({userid:1,documentid:1});

const Chathistorys=mongoose.model("Chathistorys",aichathistoryschema);
export default Chathistorys;