import jwt from "jsonwebtoken";
import Users from "../models/user.models.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
const generatejwttoken=async(id)=>{
    return jwt.sign(
        {
            id
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES || "7d"
        }
    )
}

const register=async(req,res,next)=>{
    try {
        const{username,email,password}=req.body;
        //check if user already exists
        const userexists=await Users.findOne({$or:[{username},{email}]});
        if(userexists){
            return res.status(400).json({
                success:false,
                message:"Username or email already exists"
            })
        }
        const newuser=await Users.create({
            username,
            email,
            password
        })
        const token=await generatejwttoken(newuser._id);
        res.status(201).json({
            success:true,
            data:{
                id:newuser._id,
                username:newuser.username,
                email:newuser.email,
                profilepicture:newuser.profilepicture,
                createdat:newuser.createdat,
            },
            token,
            message:"User created successfully"
        })
    } catch (error) {
        next(error);
    }
}

const login=async(req,res,next)=>{
    const{email,password}=req.body;
    try {
        //check if user exists
        const user=await Users.findOne({email}).select("+password");
        if(!user){
            throw new apierror(400,"Invalid credentials");
        }
        //check if password is correct
        const isvalid=await user.comparepassword(password);
        if(!isvalid){
            throw new apierror(400,"Invalid Password");
        }
        const token=await generatejwttoken(user._id);
        res.status(200).json(
            new apiresponse(200,"user logged in successfully",{
                user:{
                _id:user._id,
                username:user.username,
                email:user.email,
                profilepicture:user.profilepicture,
                },
                token
            })
        )
        
    } catch (error) {
       next(error);
    }

}

const getprofile=async(req,res,next)=>{
    try {
        if(!req.user){
            throw new apierror("User not found",404);
        }
        const user=req.user;
        res.status(200).json(
            new apiresponse(200,"User profile fetched successfully",user)
        )
    } catch (error) {
        next(error);
    }
}

const updateprofile=async(req,res,next)=>{
    if(!req.user) {
        throw new apierror("User not found",404);
    }
    try {
        const {username,email,profilepicture}=req.body;
        const user=req.user;
        if(username){
            user.username=username;
        }
        if(email){
            user.email=email;
        }
        if(profilepicture){
            user.profilepicture=profilepicture;
        }
        await user.save();
        res.status(200).json(
            new apiresponse(200,"User profile updated successfully",user)
        )
    } catch (error) {
        next(error);
    }
}

const changepassword=async(req,res,next)=>{
    if(!req.user) {
        throw new apierror(404,"User not found");
    }
    try {

       const {oldpassword,newpassword}=req.body
        if(!oldpassword || !newpassword){
            throw new apierror(400,"Old password and new password are required");
        }
        //verify old password
        const user=await Users.findById(req.user._id).select("+password");
        const isvalid=await user.comparepassword(oldpassword);
        if(!isvalid){
            throw new apierror(400,"Invalid old password");
        }

        user.password=newpassword;
        await user.save();
        res.status(200).json(
            new apiresponse(200,"Password changed successfully")
        );
    } catch (error) {
        next(error);
    }
}
export{
    register, login, getprofile, updateprofile, changepassword
}
