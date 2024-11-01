import {Lien} from "../shared/lien.js";
import {Path} from "../shared/path.js";
import * as path from "path";
import fs from "fs";

const __dirname = path.resolve('./' + Path);

export function sendFile(req, res) {
    console.log('sendFile');
    console.log('req.originalUrl', req.originalUrl);
    console.log('req.path', req.path);
    if (fs.existsSync(__dirname + req.originalUrl) && fs.statSync(__dirname + req.originalUrl).isFile()) {
        res.sendFile(__dirname + req.originalUrl);
    } else {
        let url = Lien + '/';
        const urlSplit = req.originalUrl.split('/');
        const urlMatch = req.originalUrl.match(/\.[a-z]+/g);
        const tailleMax = urlMatch ? urlSplit.length - 1 : urlSplit.length;
        for (let i = 1; i < tailleMax; i++)
            if (urlSplit[i] !== '')
                url += urlSplit[i] + '/';

        res.redirect(url + 'index.html');
    }
}
