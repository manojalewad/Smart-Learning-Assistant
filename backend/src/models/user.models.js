import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt"
const userschema=new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
        trim:true,
        lowercase:[true,"Username must be lowercase"],
        minLength:[3,"Username must be at least 3 characters long"],
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        trim:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Please provide a valid email address"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength:[6,"Password must be at least 6 characters long"],
        select:false
    },
    profilepicture:{
        type:String,
        default:null
    }
},{timestamps:true})

userschema.pre("save",async function(){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
    }
})

userschema.methods.comparepassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

const Users=mongoose.model("Users",userschema);
export default Users;