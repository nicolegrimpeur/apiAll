import fs from 'fs';
import {CronJob} from 'cron';

import * as PlanningsApi from '../../models/planningsApi.js';

const path = '/path/to/planningsRessources/';

// options pour l'enregistrement de la date
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

// remet à 0 les plannings dans paths
function reset() {
  // on récupère le fichier de log
  const log = JSON.parse(fs.readFileSync(path + 'log/log.json'));

  // on récupère la liste des résidences
  const liste = JSON.parse(fs.readFileSync(path + 'listPlannings.json'));

  // on récupère la date actuelle
  const time = new Date(Date());

  try {
    // on parcours le tableau pour remettre à 0 les plannings inscrits
    for (let residence of liste['residences'])
      for (let nomPlanning of residence['liste'])
        PlanningsApi.remiseZero(nomPlanning, residence['residence']);

    // on ajoute au log le succès
    log.log.push({
      dateModif: time.toLocaleDateString('fr-FR', options),
      modification: 'succès'
    });

  } catch (err) {
    // on ajoute au log l'erreur
    log.log.push({
      dateModif: time.toLocaleDateString('fr-FR', options),
      modification: 'erreur',
      erreur: err
    });
  }

  // on enregistre les modifications
  fs.writeFileSync(path + 'log/log.json', JSON.stringify(log, null, 2));
}

const job = new CronJob(
    '0 1 * * 0', // cronTime
    reset, // onTick
    null, // onComplete
    true, // start
    'Europe/Paris' // timeZone
);
