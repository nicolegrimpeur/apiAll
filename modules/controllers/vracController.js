import {Path} from "../shared/path.js";
import * as path from "path";

const __dirname = path.resolve('./' + Path);

export function sendRobots(req, res) {
    res.sendFile(__dirname + '/public/robots.txt');
}
