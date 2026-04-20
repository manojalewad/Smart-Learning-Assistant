import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEYS, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const cloudinaryupload=async(filepath)=>{
    try {
        if(!filepath) return null;
        const response=await cloudinary.uploader.upload(filepath,{
            resource_type:"auto"
        })
        fs.unlinkSync(filepath);
        console.log("file is uploaded successfully",response.url);
        return response
    } catch (error) {
        fs.unlinkSync(filepath);
        console.log("error while uploading file",error);
        return null;
    }
}
export default cloudinaryupload