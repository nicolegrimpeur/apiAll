import express from "express";
const router = express.Router();
import * as angular_projects_controller from "../controllers/angularProjectsController.js";

////// Projets avec Ionic
const tabProjetsIonic = [
    '/modificationsRP',
    '/all',
    '/plannings'
];
const tabProjetsIonicRedirect = tabProjetsIonic.map((projet) => {
    return projet + '/*';
});

router.get(tabProjetsIonic, angular_projects_controller.site);

router.get(tabProjetsIonicRedirect, angular_projects_controller.redirectSite);

export default router;
