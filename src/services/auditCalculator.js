// Service de calcul pour l'audit énergétique

// On calcule d'abord la déperdition d'une paroi à partir de sa surface et de sa résistance thermique (inverse de la conductivité thermique)
export function calculerDeperditionParoi(surface, resistance) {
    // Conductivité thermique U = 1/R
    const conductivite = 1 / resistance;
    return surface * conductivite;
  }
  
// On calcule ensuite la déperdition totale en sommant les déperditions de toutes les parois
// Le paramètre parois est un tableau d'objets (props) où la surface est donnée par l'utilisateur et la résistance extraite à partir des fichiers csv
export function calculerDeperditionTotale(parois) {
  return parois.reduce((total, paroi) => {
    return total + calculerDeperditionParoi(paroi.surface, paroi.resistance);
  }, 0);
}
  
/* On calcule finalement la consommation théorique (en Kwh/an).
* Il n'y a pas de changement d'unité à faire. Puisqu'on calcule la consommation sur une année, il parait pertinent de prendre les température
* intérieure et extérieure moyennes en France sur une année (19°C et 14.1°C respectivement) comme valeurs par défaut, mais j'ai laissé la possibilité pour
* l'utilisateur de les changer .
*/
export function calculerConsommationTheorique(deperditions, rendementChauffage, tempInt = 19, tempExt = 14.1) {
  // Formule: C = (D * 24 * 365 * Δθ) / (η * 1000)
  const deltaTemp = tempInt - tempExt;
  return (deperditions * 24 * 365 * deltaTemp) / (rendementChauffage * 1000);
}