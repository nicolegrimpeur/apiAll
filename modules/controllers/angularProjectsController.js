import {Lien} from "../shared/lien.js";
import {Path} from "../shared/path.js";
import * as path from "path";
import fs from "fs";

const __dirname = path.resolve('./' + Path);

export function site(req, res) {
    // ajout du cache control
    res.setHeader('Cache-Control', 'max-age=3600');

    if (req.originalUrl[req.originalUrl.length - 1] === '/') {
        res.sendFile(__dirname + req.originalUrl + '/index.html');
    } else {
        res.redirect(Lien + '/' + req.originalUrl.split('/')[1] + '/');
    }
}

export function redirectSite(req, res) {
    // ajout du cache control
    res.setHeader('Cache-Control', 'max-age=3600');

    fs.promises.access(__dirname + req.originalUrl)
        .then(() => {
            res.sendFile(__dirname + req.originalUrl);
        })
        .catch(() => {
            res.redirect(Lien + '/' + req.originalUrl.split('/')[1] + '/');
        });
}
