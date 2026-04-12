import express from "express";
import {body} from "express-validator";
import {
    register,
    login,
    getprofile,
    updateprofile,
    changepassword
} from '../controllers/auth.controllers.js'

import verifytoken from "../middlewares/auth.middlewares.js";
const regiservalidation=[
    body("username").notEmpty().trim().isLength({min:3}).withMessage("Username must be of at least 3 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")
]
const loginvalidation=[
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")
]
const router=express.Router();

//register route
router.post("/register",regiservalidation,register);
//login route
router.post("/login",loginvalidation,login);

//procted route means required login
router.get("/getprofile",verifytoken,getprofile);
router.post("/updateprofile",verifytoken,updateprofile);
router.put("/changepassword",verifytoken,changepassword);
export default router;