import express from "express";
import {  getquizebyid, getallquizes, submitquiz, getquizresult, deletequiz } from "../controllers/quize.controllers.js";

import verifytoken from "../middlewares/auth.middlewares.js";
const router=express.Router();
router.use(verifytoken);
router.get('/getallquizes/:id',getallquizes);
router.get('/getquizebyid/:id',getquizebyid);
router.post('/submitquize/:id',submitquiz);
router.get('/getquizresult/:id',getquizresult);
router.delete('/deletequize/:id',deletequiz);
export default router