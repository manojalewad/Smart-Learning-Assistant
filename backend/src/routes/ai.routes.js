


import express from "express";
import verifytoken from "../middlewares/auth.middlewares.js";
import { chat, explainconcept, generateflashcard, generatequiz, generatesummary, getchathistory } from "../controllers/ai.controllers.js";

const router=express.Router();

router.use(verifytoken)
router.post('/generate-flashcards',generateflashcard);
router.post('/generate-quiz',generatequiz);
router.post('/explainconcept',explainconcept);
router.post('/getchathistory',getchathistory);
router.post('/chat',chat);
router.post('/generate-summary',generatesummary);

export default router

