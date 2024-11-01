import express from "express";
const router = express.Router();

import * as plannings_controller from "../controllers/planningsController.js";

router.post('/add', plannings_controller.addInscription);

router.post('/remove', plannings_controller.removeInscription);

router.get('/getHistorique/:id/:name', plannings_controller.getHistorique);

router.get('/getPlanning/:id/:name', plannings_controller.getPlanning);

router.get('/getListPlannings', plannings_controller.getListPlannings);

router.get('/init/:name/:id', plannings_controller.initPlannings);

router.get('/removeFile/:name/:id', plannings_controller.removePlanning);

router.get('/zero/:name/:id', plannings_controller.zeroPlanning);

router.get('/modifOrdrePlannings/:name/:id', plannings_controller.modifOrdrePlannings);

router.get('/createRes/:id/:name', plannings_controller.initResidence);

router.get('/supprRes/:id/:name', plannings_controller.removeResidence);

router.get('/getNews', plannings_controller.getNews);

export default router;
