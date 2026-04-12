import express from "express"

import getdashboard from "../controllers/progress.controllers.js"
import verifytoken from "../middlewares/auth.middlewares.js";

const router=express.Router();

router.use(verifytoken)

router.get('/dashboard',getdashboard);
export default router