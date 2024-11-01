import * as PlanningsApi from "../models/planningsApi.js";
import {readFile} from "node:fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export function addInscription(req, res) {
    const informations = req.body;

    PlanningsApi.addCreneau(informations, res);
}

export function removeInscription(req, res) {
    const informations = req.body;

    PlanningsApi.removeCreneau(informations, res);
}

export function getHistorique(req, res) {
    PlanningsApi.getHistorique(req, res);
}

export function getPlanning(req, res) {
    PlanningsApi.getPLannings(req, res);
}

export function getListPlannings(req, res) {
    PlanningsApi.getListPlannings(req, res)
}

export function initPlannings(req, res) {
    const id = String(req.params.id);
    const residence = String(req.params.name);

    PlanningsApi.initFile(id, residence, res);
}

export function removePlanning(req, res) {
    const id = String(req.params.id);
    const residence = String(req.params.name);

    PlanningsApi.removeFile(id, residence, res);
}

export function zeroPlanning(req, res) {
    const id = String(req.params.id);
    const residence = String(req.params.name);

    PlanningsApi.remiseZero(id, residence, res);
}

export function modifOrdrePlannings(req, res) {
    const informations = String(req.params.id);
    const residence = String(req.params.name);

    PlanningsApi.modifListePlanning(residence, informations, res);
}

export function initResidence(req, res) {
    const id = String(req.params.id);
    const name = String(req.params.name);

    PlanningsApi.createResidence(id, name, res);
}

export function removeResidence(req, res) {
    const id = String(req.params.id);
    const name = String(req.params.name);

    PlanningsApi.supprResidence(id, name, res);
}

export function getNews(request, reply) {
    // égal au dossier controllers
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const path = __dirname + '/../ressourcesModels/planningsRessources/news.txt';
    readFile(path, 'utf8', (err, news) => {
        if (err)
            reply.send({msg: err, status: 500});
        else
            reply.send({msg: news, status: 200});
    });
}
