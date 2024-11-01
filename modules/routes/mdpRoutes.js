import express from "express";
const router = express.Router();

import * as mdpController from "../controllers/mdpController.js";

router.post('/', mdpController.checkMdp);

router.post('/all', mdpController.checkMdpAll);

export default router;
