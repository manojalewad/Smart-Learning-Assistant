import jwt from "jsonwebtoken";
import Users from "../models/user.models.js";
import { apierror } from "../utils/apierror.js";

const verifytoken=async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        try {
            token=req.headers.authorization.split(" ")[1];
            //verify token
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await Users.findById(decoded.id).select("-password");
            if(!req.user){
                throw new apierror("User not found",404);
            }
            next();
        } catch (error) {
            console.log(error);
            if(error.name==="TokenExpiredError"){
                throw new apierror("Token expired",401);
            }
            next(error);
        }
    }
    if(!token){
        throw new apierror("Not authorized, no token",401);
    }
}
export default verifytoken;