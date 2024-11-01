import {env} from '../../env.js';

// pour vérifier que le mot de passe est bon pour les applications RP et des plannings
export function checkMdp (req, res) {
  const mdp = env.mdp.rps;

  if (req.body.mdp === mdp) {
    res.status(200).send({message: 'Mot de passe valide'});
  } else {
    res.status(403).send({message: 'Mot de passe invalide'});
  }
}

export function checkMdpAll (req, res) {
  const mdp = env.mdp.all;

  if (req.body.mdp === mdp) {
    res.status(200).send({message: 'Mot de passe valide'});
  } else {
    res.status(403).send({message: 'Mot de passe invalide'});
  }
}
