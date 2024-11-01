// port utilisé par le site
const port = 7000;

// instanciation du serveur
import express from "express";
import bodyParser from "body-parser";

const app = express();

import http from "http";

const serverHTTP = http.createServer(app);

import vracRouter from './modules/routes/vracRoutes.js';
import mdpRouter from "./modules/routes/mdpRoutes.js";
import planningsRouter from "./modules/routes/planningsRoutes.js";
import allApiRouter from './modules/routes/allApiRoutes.js';
import projetsIonicRouter from './modules/routes/projetsIonicRoutes.js';
import simpleProjectsRouter from './modules/routes/simpleProjectsRoutes.js';

import {Lien} from "./modules/shared/lien.js";

app.enable('trust proxy');

app.use(bodyParser.json());

// pour l'api principalement
app.use(function (req, res, next) {
    // site que je veux autoriser à se connecter
    res.setHeader('Access-Control-Allow-Origin', '*');

    // méthodes de connexion autorisées
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST']);

    res.setHeader('Access-Control-Allow-Headers', 'content-type');

    // ajout du cache control
    res.setHeader('Cache-Control', 'no-cache');

    next();
});

app.get('/*', function (req, res, next) {
    const options = {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const today = new Date();

    // debug
    console.log('path |', today.toLocaleTimeString("fr-FR", options), '|', req.path);

    const maintenance = false;

    if (maintenance) {
        // si maintenance
        res.send('Maintenance en cours');
    } else {
        // si pas maintenance, on continue
        next();
    }
});

app.use('/mdpRP', mdpRouter);
app.use('/plannings', planningsRouter);
app.use('/apiJson', allApiRouter);
app.use('/', vracRouter);
app.use('/', projetsIonicRouter);
app.use('/', simpleProjectsRouter);

app.get(['/*', '/'], function (req, res) {
    res.redirect(Lien + '/all/');
});

serverHTTP.listen(port);

console.log("let's go port : " + port);
