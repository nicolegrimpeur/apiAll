import fs from "fs";
import * as del from "del";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = __dirname + '/../ressourcesModels/planningsRessources/';

export function index (res) {
  res.sendFile(__dirname + '/index.html');
}

export function getHistorique (req, res) {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  const historique = JSON.parse(fs.readFileSync(path + 'historique/' + residence + '/' + 'historique_' + id + '.json'));
  res.status(200).json(historique);
}

export function getPLannings (req, res) {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  const planning = JSON.parse(fs.readFileSync(path + 'plannings/' + residence + '/' + id + '.json'));
  res.status(200).json(planning);
}

export function getListPlannings (req, res) {
  const liste = JSON.parse(fs.readFileSync(path + 'listPlannings.json'));
  res.status(200).json(liste);
}

// initialise un planning
export function initFile (id, residence, res) {
  // informations nécessaires pour l'inscription
  const data = {
    "nom": "",
    "prenom": "",
    "chambre": ""
  }

  // tous les créneaux possibles
  const horaires = {
    'H7': data,
    'H8M30': data,
    'H10': data,
    'H11M30': data,
    'H13M': data,
    'H14M30': data,
    'H16M': data,
    'H17M30': data,
    'H19': data,
    'H20M30': data
  };

  // tous les jours de la semaine
  const jours = {
    'dimanche1': horaires,
    'lundi': horaires,
    'mardi': horaires,
    'mercredi': horaires,
    'jeudi': horaires,
    'vendredi': horaires,
    'samedi': horaires,
    'dimanche2': horaires
  };

  // vérifie si le dossier de la résidence existe, si non, le créé
  const dirPath = path + 'plannings/' + residence;
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // on écrit le fichier de planning avec ces données de base
  fs.writeFileSync(dirPath + '/' + id + '.json', JSON.stringify(jours, null, 2));

  // on initialise le système d'historique correspondant à ce planning
  this.initHistorique(id, residence);

  this.addListe(id, residence);

  // si la fonction a été appelée via requête http
  if (res !== undefined) res.status(200).json('ok');
}

// supprime un planning
export function removeFile (id, residence, res) {
  // supprime le planning correspondant
  del.deleteAsync([path + 'plannings/' + residence + '/' + id + '.json']).then();
  del.deleteAsync([path + 'historique/' + residence + '/historique_' + id + '.json']).then();

  const liste = JSON.parse(fs.readFileSync(path + 'listPlannings.json'));

  // on récupère l'indice de l'objet résidence
  const indexRes = liste['residences'].findIndex(res => res.residence === residence);
  if (indexRes !== -1) {
    // on récupère l'indice de l'id
    let indexId = liste['residences'][indexRes].liste.findIndex(res => res === id);
    if (indexId !== -1) {
      liste['residences'][indexRes].liste.splice(indexId, 1);

      // on réécrit le fichier
      fs.writeFileSync(path + 'listPlannings.json', JSON.stringify(liste, null, 2));

      // si la fonction a été appelée via requête http
      if (res !== undefined) {
        res.status(200).json('ok');
        res = undefined;
      }
    }
  }
  if (res !== undefined) res.status(201).json('pas trouvé');
}

// ajoute le planning à la liste de planning
export function addListe (id, residence) {
  const liste = JSON.parse(fs.readFileSync(path + 'listPlannings.json'));

  // on récupère l'index de la position de la résidence dans la liste
  let index = liste['residences'].findIndex(res => res.residence === residence);

  // si la résidence n'existe pas encore
  if (index === -1) {
    liste['residences'].push({
      'residence': residence,
      'name': residence,
      'liste': [id]
    });
  } else {
    // on vérifie que ce que l'on cherche à ajouter ne l'a pas déjà été
    if (liste['residences'][index]['liste'].find(res => res === id) === undefined) {
      liste['residences'][index]['liste'].push(id);
    }
  }

  // on réécrit le fichier
  fs.writeFileSync(path + 'listPlannings.json', JSON.stringify(liste, null, 2));
}

// remplace la liste de planning d'une résidence par une nouvelle
export function modifListePlanning (residence, informations, res) {
  const liste = JSON.parse(fs.readFileSync(path + 'listPlannings.json'));

  // on récupère l'index de la position de la résidence dans la liste
  let index = liste['residences'].findIndex(res => res.residence === residence);

  // on remplace l'ancienne liste par la nouvelle avec le nouvelle ordre
  liste['residences'][index].liste = informations.split('+');

  // on vérifie que la modification vient bien de l'application
  if (liste['residences'][index].liste[liste['residences'][index].liste.length - 1] === 'OkPourModifs') {
    // on supprime la valeur du mot de passe
    liste['residences'][index].liste.pop();

    // on réécrit le fichier
    fs.writeFileSync(path + 'listPlannings.json', JSON.stringify(liste, null, 2));

    // on renvoi une réponse
    if (res !== undefined) res.status(201).json('pas trouvé');
  }
}

// ajoute un créneau
export function addCreneau (informations, res) {
  let id, nom, prenom, residence, chambre, jour, heure;

  // on récupère les informations dans la requête
  id = informations.id;
  nom = informations.nom;
  prenom = informations.prenom;
  residence = informations.residence;
  chambre = informations.chambre;
  jour = informations.jour;
  heure = informations.heure;

  // on vérifie que l'on a toutes les infos nécessaires
  if (id !== undefined && residence !== undefined && jour !== undefined && heure !== undefined && nom !== undefined && prenom !== undefined && chambre !== undefined) {
    // si le try passe, le fichier existe, sinon on le créé
    try {
      // on récupère le planning
      const planning = JSON.parse(fs.readFileSync(path + 'plannings/' + residence + '/' + id + '.json'));

      // on vérifie qu'il n'y a pas déjà quelqu'un sur ce créneau
      if (planning[jour][heure].nom === '') {
        // on inscrit la personne
        planning[jour][heure].nom = nom;
        planning[jour][heure].prenom = prenom;
        planning[jour][heure].chambre = chambre;

        // on enregistre l'inscription
        fs.writeFileSync(path + 'plannings/' + residence + '/' + id + '.json', JSON.stringify(planning, null, 2));

        // on ajoute l'inscription à l'historique
        this.addHistorique('Inscription sur le créneau', id, residence, nom, prenom, chambre, jour, heure);

        // on renvoi une réponse positive à l'inscription
        res.status(200).send({message: 'Inscription réussi'});
      } else {
        // quelqu'un est déjà inscris, on envoi une réponse d'erreur
        res.status(403).send({message: 'Créneau déjà utilisé'})
      }
    } catch (err) {
      // on initialise le fichier de planning
      this.initFile(id, residence);
      // on refait l'inscription
      this.addCreneau(informations, res);
    }
  } else {
    // il manque des informations, donc on renvoit une erreur
    res.status(404).send({message: 'Erreur dans les informations fournies'});
  }
}

// suppression d'un créneau déjà existant
export function removeCreneau (informations, res) {
  let id, nom, prenom, residence, chambre, jour, heure;

  // on récupère les informations dans la requête
  id = informations.id;
  nom = informations.nom;
  prenom = informations.prenom;
  residence = informations.residence;
  chambre = informations.chambre;
  jour = informations.jour;
  heure = informations.heure;

  // on vérifie que l'on a toutes les infos nécessaires
  if (id !== undefined && residence !== undefined && jour !== undefined && heure !== undefined && nom !== undefined && prenom !== undefined && chambre !== undefined) {
    // si le try passe, le fichier existe, sinon on renvoi une erreur
    try {
      // on récupère le planning
      const planning = JSON.parse(fs.readFileSync(path + 'plannings/' + residence + '/' + id + '.json'));

      // on vérifie s'il y a quelqu'un ou pas sur ce créneau
      if (planning[jour][heure].nom !== '') {
        // on supprime le créneau
        planning[jour][heure].nom = '';
        planning[jour][heure].prenom = '';
        planning[jour][heure].chambre = '';

        // on enregistre les modifications
        fs.writeFileSync(path + 'plannings/' + residence + '/' + id + '.json', JSON.stringify(planning, null, 2));

        // on ajoute la modification à l'historique
        this.addHistorique('Suppression du créneau', id, residence, nom, prenom, chambre, jour, heure);

        // on renvoit une réponse positive à la suppression
        res.status(200).send({message: 'Suppression réussi'});
      } else {
        // on renvoi une erreur
        res.status(403).send({message: 'Il n\'y a pas d\'inscription sur ce créneau'});
      }
    } catch (err) {
      // on renvoi une erreur
      res.status(404).send({message: 'Erreur dans les informations fournies'})
    }
  } else {
    res.status(404).send({message: 'Erreur dans les informations fournies'});
  }
}

// remet à 0 le planning et l'historique qui lui est associé
export function remiseZero (id, residence, res) {
  // on récupère l'historique
  const planning = JSON.parse(fs.readFileSync(path + 'plannings/' + residence + '/' + id + '.json'));

  // on déplace les données de dimanche 2 dans dimanche 1
  planning.dimanche1 = JSON.parse(JSON.stringify(planning.dimanche2));

  // on remet le reste à 0
  for (let jour in planning)
    if (jour !== 'dimanche1')
      for (let heure in planning[jour])
        for (let data in planning[jour][heure])
          planning[jour][heure][data] = '';

  // on enregistre les modifications
  fs.writeFileSync(path + 'plannings/' + residence + '/' + id + '.json', JSON.stringify(planning, null, 2));

  // on réinitialise l'historique
  this.initHistorique(id, residence);

  // si la fonction a été appelé depuis une requète html, on renvoi une réponse positive
  if (res !== undefined) res.status(200).send('zero');
}

// initialisation de l'historique
export function initHistorique (id, residence) {
  const historique = {historique: []};

  // vérifie si le dossier de la résidence existe, si non, le créé
  const dirPath = path + 'historique/' + residence;
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // on écrit la modification
  fs.writeFileSync(dirPath + '/' + 'historique_' + id + '.json', JSON.stringify(historique, null, 2));
}

// ajout à l'historique
export function addHistorique (modification, id, residence, nom, prenom, chambre, jour, heure) {
  // on récupère la date actuelle
  const time = new Date(Date());

  // on récupère l'historique
  const historique = JSON.parse(fs.readFileSync(path + 'historique/' + residence + '/' + 'historique_' + id + '.json'));

  // options pour l'enregistrement de la date
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  historique.historique.push({
    modification: modification,
    dateModif: time.toLocaleDateString('fr-FR', options),
    nom: nom,
    prenom: prenom,
    chambre: chambre,
    jour: jour,
    heure: heure
  });

  // on enregistre les modifications
  fs.writeFileSync(path + 'historique/' + residence + '/' + 'historique_' + id + '.json', JSON.stringify(historique, null, 2));
}

// créer la nouvelle résidence
export function createResidence (id, name, res) {
  try {
    // on récupère la liste de plannings / résidences
    const liste = JSON.parse(fs.readFileSync(path + 'listPlannings.json'));
    liste.residences.push({
      residence: id,
      name: name,
      liste: []
    });

    // on enregistre les modifications
    fs.writeFileSync(path + 'listPlannings.json', JSON.stringify(liste, null, 2));

    try {
      fs.mkdirSync(path + 'historique/' + id);
      fs.mkdirSync(path + 'plannings/' + id);
      if (res !== undefined) res.status(200).send('ok');
    } catch {
      if (res !== undefined) res.status(200).send('ok mais la résidence existe déjà');
    }
  } catch {
    if (res !== undefined) res.status(201).send('Erreur dans l\'écriture de la liste');
  }
}

// créer la nouvelle résidence
export function supprResidence (id, name, res) {
  const logSuppr = JSON.parse(fs.readFileSync(path + '/log/logSuppr.json'));
  let resultat = '';

  try {
    // on récupère la liste de plannings / résidences
    let liste = JSON.parse(fs.readFileSync(path + 'listPlannings.json'));
    const indSuppr = liste.residences.findIndex(res => res.name === name);
    liste.residences = liste.residences.slice(0, indSuppr).concat(liste.residences.slice(indSuppr + 1, liste.residences.length))

    // on enregistre les modifications
    fs.writeFileSync(path + 'listPlannings.json', JSON.stringify(liste, null, 2));

    resultat = 'success';

    try {
      fs.rmdirSync(path + 'historique/' + id);
      fs.rmdirSync(path + 'plannings/' + id);
      if (res !== undefined) res.status(200).send('ok');
    } catch {
      if (res !== undefined) res.status(200).send('erreur dans la suppression des dossiers');
    }
  } catch {
    resultat = 'fail';
    if (res !== undefined) res.status(201).send('Erreur dans l\'écriture de la liste');
  }

  // options pour l'enregistrement de la date
  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  // on ajoute au log le succès
  logSuppr.log.push({
    dateModif: new Date(Date()).toLocaleDateString('fr-FR', options),
    modification: resultat
  });

  // on enregistre les modifications
  fs.writeFileSync(path + '/log/logSuppr.json', JSON.stringify(logSuppr, null, 2));
}
