import multer from "multer";
import path from "path";
import fs from "fs";

const filename=import.meta.filename;
const dirname=import.meta.dirname;

const uploaddir=path.join(dirname,"../uploads/documents");

if(!fs.existsSync(uploaddir)){
    fs.mkdirSync(uploaddir,{recursive:true});
}

//configure multer storage
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploaddir);
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix=Date.now()+"-"+Math.round(Math.random()*1e9);
        cb(null,uniqueSuffix+"-"+file.originalname);
    }
})

//apply file filter to accept only pdf files
const filefilter=(req,file,cb)=>{
    if(file.mimetype==="application/pdf"){
        cb(null,true);
    }else{
        cb(new Error("Only PDF files are allowed"),false);
    }
}

const upload=multer({
    storage,
    fileFilter:filefilter,
    limits:{
        fileSize:parseInt(process.env.MAX_FILE_SIZE) || 10*1024*1024 //10MB default
    }
})

export default upload;