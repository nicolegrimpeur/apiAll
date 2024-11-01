import fs from 'fs';
import * as del from 'del';
import util from 'util';
import multer from 'multer';
const maxSize = 2 * 1024 * 1024;

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = __dirname + '/../ressourcesModels/allRessources/';

/////// apiJson -> gestion des fichiers json du site all
export function getInfos (req, res) {
    const id = String(req.params.id);

    try {
        const textes = JSON.parse(fs.readFileSync(path + 'infos/' + id + '.json'));
        res.status(200).json(textes);
    } catch {
        const textes = JSON.parse(fs.readFileSync(path + 'aVerifier/' + id + '.json'));
        res.status(200).json(textes);
    }
}

export function getInfosAVerifier (req, res) {
    const id = String(req.params.id);

    const textes = JSON.parse(fs.readFileSync(path + 'aVerifier/' + id + '.json'));
    res.status(200).json(textes);
}

export function getListeResidences (req, res) {
    const isAVerifier = String(req.params.name);
    console.log(isAVerifier);
    const textes = JSON.parse(fs.readFileSync(path + (isAVerifier === 'true' ? 'aVerifier/' : 'infos/') + 'listeResidences.json'));
    res.status(200).json(textes);
}

// permet d'initialiser les fichiers d'une nouvelle résidence
export function initResidence (req, res) {
    const id = String(req.params.id);
    const name = String(req.params.name);

    const template = {
        langue: '',
        name: name,
        news: [],
        nameLiens: '',
        liens: [],
        nameInfos: '',
        infos: [],
        bullesLien: [],
        colInfo: []
    }

    // on récupère la liste de résidence
    const liste = JSON.parse(fs.readFileSync(path + 'aVerifier/listeResidences.json'));

    // on vérifie que la résidence n'existe pas déjà
    if (liste.residence.find(res => res.id === id.toUpperCase()) === undefined && id !== 'undefined') {
        // on créé les fichiers fr et en
        template.langue = 'fr';
        template.nameLiens = 'Annonces';
        template.nameInfos = 'Informations';
        fs.writeFileSync(path + 'aVerifier/' + id.toUpperCase() + '_fr.json', JSON.stringify(template, null, 2));
        fs.writeFileSync(path + 'infos/' + id.toUpperCase() + '_fr.json', JSON.stringify(template, null, 2));

        template.langue = 'en';
        template.nameLiens = 'Announcements';
        template.nameInfos = 'Informations';
        fs.writeFileSync(path + 'aVerifier/' + id.toUpperCase() + '_en.json', JSON.stringify(template, null, 2));
        fs.writeFileSync(path + 'infos/' + id.toUpperCase() + '_en.json', JSON.stringify(template, null, 2));

        // on met à jour la liste de résidence avec la nouvelle
        liste.residence.push(
            {id: id.toUpperCase(), name: name}
        );
        fs.writeFileSync(path + 'aVerifier/listeResidences.json', JSON.stringify(liste, null, 2));

        if (res !== undefined) res.status(200).send('ok');
    } else {
        if (res !== undefined) res.status(201).send('pas content');
    }
}

// permet de supprimer une résidence
export function removeResidence (req, res) {
    const id = String(req.params.id);
    
    // on récupère la liste de résidence
    const liste = JSON.parse(fs.readFileSync(path + 'aVerifier/listeResidences.json'));

    const ind = liste.residence.findIndex(res => res.id === id.toUpperCase());
    if (ind !== undefined && ind !== -1) {
        liste.residence = liste.residence.slice(0, ind).concat(liste.residence.slice(ind + 1, liste.residence.length));

        fs.writeFileSync(path + 'aVerifier/listeResidences.json', JSON.stringify(liste, null, 2));

        del.deleteAsync([path + 'aVerifier/' + id + '_fr' + '.json'], {force: true}).then();
        del.deleteAsync([path + 'aVerifier/' + id + '_en' + '.json'], {force: true}).then();
        del.deleteAsync([path + 'infos/' + id + '_fr' + '.json'], {force: true}).then();
        del.deleteAsync([path + 'infos/' + id + '_en' + '.json'], {force: true}).then();
        del.deleteAsync([path + 'images/residence' + id + '.jpeg'], {force: true}).then();

        // on récupère la liste de résidence
        const listeInfos = JSON.parse(fs.readFileSync(path + 'infos/listeResidences.json'));
        const indInfos = listeInfos.residence.findIndex(res => res.id === id.toUpperCase());
        if (indInfos !== undefined && indInfos !== -1) {

            liste.residence = liste.residence.slice(0, ind).concat(liste.residence.slice(ind + 1, liste.residence.length));

            fs.writeFileSync(path + 'infos/listeResidences.json', JSON.stringify(liste, null, 2));

            del([path + 'infos/' + id + '_fr' + '.json'], {force: true}).then();
            del([path + 'infos/' + id + '_en' + '.json'], {force: true}).then();
        }

        if (res !== undefined) res.status(200).send('Suppression effectué');
    } else {
        if (res !== undefined) res.status(201).send('La résidence n\'existe pas encore');
    }
}


////////// gestion de l'upload d'image
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path + "images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

// upload d'une image sur serveur
export async function upload (req, res) {
    try {
        await uploadFileMiddleware(req, res);

        if (req.file === undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (err) {
        console.log('erreur : ', err);

        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
}

// download une image
export async function download (req, res) {
    const fileName = req.params.name + '.jpeg';
    const directoryPath = path + 'images/';

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
}

// passer les infos sur serveur
export function uploadInfos (req, res) {
    const id = String(req.params.id);
    const isAVerifier = String(req.params.name);
    const json = req.body;

    if (isAVerifier === 'false') fs.writeFileSync(path + 'infos/' + id + '.json', JSON.stringify(json, null, 2));
    fs.writeFileSync(path + 'aVerifier/' + id + '.json', JSON.stringify(json, null, 2));

    // on récupère la liste de résidence
    const liste = JSON.parse(fs.readFileSync(path + 'aVerifier/listeResidences.json'));
    fs.writeFileSync(path + 'infos/listeResidences.json', JSON.stringify(liste, null, 2));

    res.status(200).send('ok');
}
