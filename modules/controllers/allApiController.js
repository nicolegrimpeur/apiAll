import * as AllApi from '../models/allApi.js';

export function getInfos (req, res) {
    AllApi.getInfos(req, res);
}

export function getInfosAVerifier (req, res) {
    AllApi.getInfosAVerifier(req, res);
}

export function getListeResidences (req, res) {
    AllApi.getListeResidences(req, res);
}

export function addResidence (req, res) {
    AllApi.initResidence(req, res);
}

export function removeResidence (req, res) {
    AllApi.removeResidence(req, res);
}

export function uploadInfos (req, res) {
    AllApi.uploadInfos(req, res);
}

export function getImage (req, res) {
    AllApi.download(req, res).then();
}

export function uploadImage (req, res) {
    AllApi.upload(req, res).then();
}
