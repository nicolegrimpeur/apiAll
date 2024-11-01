# apiAll

## A quoi sert ce repository ?

Ce repository a pour but de fournir une API RESTful afin d'afficher et manipuler les trois projets que j'avais créés pour ma résidence.

Ce repository contient tout ce qui est nécessaire au bon fonctionnement des trois projets.

## Repositories associés

[![App All](https://github-readme-stats-nicolegrimpeur.vercel.app/api/pin/?username=nicolegrimpeur&repo=appAll&theme=swift)](https://github.com/nicolegrimpeur/appAll)

[![Plannings](https://github-readme-stats-nicolegrimpeur.vercel.app/api/pin/?username=nicolegrimpeur&repo=Plannings&theme=swift)](https://github.com/nicolegrimpeur/Plannings)

[![Interface App All](https://github-readme-stats-nicolegrimpeur.vercel.app/api/pin/?username=nicolegrimpeur&repo=interfaceAppAll&theme=swift)](https://github.com/nicolegrimpeur/interfaceAppAll)

## Informations complémentaires

- env.js : Ce fichier contient les mots de passe des comptes RPs et All (RP étant pour les responsables de résidence, soit les administrateurs du site All Plannings, et ALl pour les membres du All qui doivent approuver les modifications réalisées par les RPs sur le site Interface App All)
- privacy : Ce dossier contient les politiques de confidentialité qui étaient utilisées sur le Google Play Store
- plannings / all / modificationsRP : Ces dossiers sont censés contenir le code compilé des applications Plannings, App All et Interface App All, respectivement
- modules : Ce dossier contient les modules utilisés par l'API ainsi que le stockage des informations nécessaires

## Utilisation

Cette API fonctionnant avec Node.JS, il est nécessaire d'installer Node.JS sur votre machine pour pouvoir l'utiliser.

Une fois installée, il suffit de lancer la commande `npm install` pour installer les dépendances nécessaires.

Ensuite, il suffit de lancer la commande `node server.js` pour lancer l'API.

Sur un serveur, il est recommandé d'utiliser PM2 pour lancer l'API en arrière-plan.

### Plannings

Le script permettant de réinitialiser les plannings tous les dimanches matin est présent dans le dossier `modules/ressourcesModels/planningsRessources` et se nomme `script.js`. 

Il est recommandé de lancer ce script avec PM2.

Celui-ci réinitialisera les plannings tous les dimanches à 1h du matin.
