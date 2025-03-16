import { calculerDeperditionParoi, calculerConsommationTheorique } from './auditCalculator';
import { isolantsData } from '../data/isolants';
import { travauxData } from '../data/travaux';

// Cette foncion calcule l'économie potentielle après isolation d'une paroi
// Premier type de travaux possible: l'isolation des parois (murs, toiture, plancher)
export function calculerAmeliorationIsolation(paroi, isolant, deperditionsActuelles, rendementChauffage) {
  // Nouvelle résistance thermique (additionnée)
  const nouvelleResistance = paroi.resistance + isolant.resistance;
  const nouvelleDeperdition = calculerDeperditionParoi(paroi.surface, nouvelleResistance);
  const reductionDeperdition = calculerDeperditionParoi(paroi.surface, paroi.resistance) - nouvelleDeperdition;
  const nouvellesDeperditionsTotales = deperditionsActuelles - reductionDeperdition;
  
  // Consommations théoriques (avant/après)
  const consoAvant = calculerConsommationTheorique(deperditionsActuelles, rendementChauffage);
  const consoApres = calculerConsommationTheorique(nouvellesDeperditionsTotales, rendementChauffage);

  const economie = consoAvant - consoApres;
  const coutTravaux = paroi.surface * trouverCoutTravaux(paroi.type);
  
  // Temps de retour sur investissement (en années)
  // Hypothèse: 0.15€/kWh pour l'énergie
  const prixEnergie = 0.15;
  const economieAnnuelle = economie * prixEnergie;
  const tempsRetour = coutTravaux / economieAnnuelle;
  
  return {
    type: `Isolation ${paroi.type}`,
    materiau: isolant.type,
    economieEnergie: economie.toFixed(2),
    coutTravaux: coutTravaux.toFixed(2),
    tempsRetour: tempsRetour.toFixed(1),
    nouvelleResistance: nouvelleResistance.toFixed(2)
  };
}

// Trouver le coût des travaux pour un type de paroi donné
// Les autres types de travaux possibles
function trouverCoutTravaux(typeParoi) {
  // Mapping simplifié entre type de paroi et poste de travaux
  const mapping = {
    "Mur en béton": "Isolation murs",
    "Mur en brique": "Isolation murs",
    "Toiture en tuiles": "Isolation toiture",
    "Plancher en bois": "Isolation plancher",
    "Fenêtre simple vitrage": "Changement de fenêtre double vitrage",
    "Fenêtre double vitrage": "Changement de fenêtre triple vitrage"
  };
  
  const poste = mapping[typeParoi];
  const travail = travauxData.find(t => t.poste === poste);
  return travail ? travail.cout : 100; // Valeur par défaut si on ne trouve pas le poste
}

// Retourne une liste de suggestions de travaux à effectuer
//
export function suggererTravaux(parois, deperditionsTotales, rendementChauffage) {
  const suggestions = [];
  
  // Pour chaque paroi, on teste tous les isolants possibles
  parois.forEach(paroi => {
    isolantsData.forEach(isolant => {
      // Ignorer les fenêtres pour l'isolation standard
      if (paroi.type.includes("Fenêtre")) return;
      
      const amelioration = calculerAmeliorationIsolation(
        paroi, 
        isolant, 
        deperditionsTotales, 
        rendementChauffage
      );
      suggestions.push(amelioration);
    });
  });
  

  
  // Trier par temps de retour sur investissement (qui est toujours le même apparemment?)
  return suggestions.sort((a, b) => parseFloat(a.tempsRetour) - parseFloat(b.tempsRetour));
}