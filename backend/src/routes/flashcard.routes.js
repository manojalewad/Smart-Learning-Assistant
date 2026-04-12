import express from "express"
import verifytoken from "../middlewares/auth.middlewares.js";

import { getallflashcards,getflashcards,deleteflashcardset,reviewflashcards,toggleflashcard,getflashcardsetbyid } from "../controllers/flashcard.controllers.js";
const router=express.Router();

//login required;
//all router are procted 
router.use(verifytoken)
router.get('/getallflashcards',getallflashcards);
router.get('/getflashcards/:id',getflashcards);
router.delete('/:id',deleteflashcardset);
router.post('/review/:id',reviewflashcards);
router.put('/star/:id',toggleflashcard);
router.get('/:id',getflashcardsetbyid);

export default router;