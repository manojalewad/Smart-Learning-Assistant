import upload from "../config/multer.js";


import express from "express";
import { uploaddocument,getdocuments,getdocumentbyid,deletedocument,updatedocument } from "../controllers/document.controllers.js";
import verifytoken from "../middlewares/auth.middlewares.js";

const router=express.Router();

//route to upload docuement all routes in this file are protected routes
router.use(verifytoken)
router.post("/upload",upload.single("file"),uploaddocument);
router.get("/getdocuments",getdocuments);
router.get("/:id",getdocumentbyid);
router.delete("/:id",deletedocument);
router.post("/update/:id",updatedocument);
export default router;