import express from "express";
const router = express.Router();

import * as allApi_controller from "../controllers/allApiController.js";

// api qui va avec le site du all et avec l'interface de modification rp
router.get('/:id', allApi_controller.getInfos);

router.get('/aVerifier/:id', allApi_controller.getInfosAVerifier);

router.get('/listeResidences/:name', allApi_controller.getListeResidences);

router.get('/addRes/:name/:id', allApi_controller.addResidence);

router.get('/removeRes/:id', allApi_controller.removeResidence);

router.post('/upload/:id/:name', allApi_controller.uploadInfos);

router.get('/get/:name', allApi_controller.getImage);

router.post('/upload', allApi_controller.uploadImage);

export default router;
