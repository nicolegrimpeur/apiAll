import express from "express";

const router = express.Router();

import * as simpleProjectsController from "../controllers/simpleProjectsController.js";

// redirection sur le / de chaque projet
router.get([
    '/app',
], simpleProjectsController.sendFile);

router.get([
    '/app/*', '/privacy/*',
], simpleProjectsController.sendFile);


export default router;
