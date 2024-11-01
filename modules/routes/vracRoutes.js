import express from "express";
const router = express.Router();

import * as vrac_controller from "../controllers/vracController.js";

///// robots.txt
router.get('/robots.txt', vrac_controller.sendRobots);

export default router;
