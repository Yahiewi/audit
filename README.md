README:

-Instructions:
cd audit
npm install
npm run dev

-Stack Utilisé:
Vue.js - Pour le frontend
Vite - Pour un build rapide.
JavaScript - Langage principal utilisé.

-Raisonnement:
Quand j'ai lu le sujet, j'ai eu plusieurs idées différentes sur qu'est-ce que je vais faire exactement. Faire des script Python et avoir des inputs simples et des outputs simples (Juste des fichiers JSONs), était l'idée la plus simple à implémenter mais je savais que je pouvais faire mieux en une heure et demi, surtout que j'avais déjà une idée sur les audits énergétiques et j'ai pas perdu trop de temps à découvrir qu'est-ce que c'est. Une autre idée que j'ai eu c'était de développer un modèle d'IA qui prend en input les informations pertinentes et retourne les scores demandés, et même si je pense que c'est totalement faisable, avec la contrainte de temps, c'est compliqué de trouver une dataset en ligne avec assez d'information, puis faire du data engineering, entrainer le modèle et valider les résultats et après ce n'était pas vraiment ce qui a été demandé dans l'exercice. L'idée pour laquelle j'ai opté était de développer une appli web simple pour rendre l'expérience utilisateur avec mon programme plus agréable et si jamais je n'arrive pas à le faire, je peux laisser tomber et juste travailler sur les scripts du backend où les algorithmes demandés sont écrits, mais avec Vite, j'avais confiance que c'étais faisable donc je suis partie sur cette idée là.

\*Tout d'abord, puisque j'ai fait le choix d'utiliser JavaScript, j'ai décidé de convertir les csv en des fichiers .js et les mettre dans le dossier data pour rendre leur accès plus facile.

\*En fait, j'ai parlé de backend mais puisqu'il n'y a pas vraiment une base de données à gérer et la contrainte de temps ne permet pas vraiment d'en créer une, tout le logique métier est dans le dossier "services" côté front end aussi, et puisque ce n'était pas forcément l'un des intérêts de l'exercice, j'ai concentré mes efforts sur la conception et les algorithmes qu'il fallait écrire et j'ai délégué la tâche de générer le frontend à Claude en lui donnant mon code du backend. (En fait, j'étais confiant que je pourrais réaliser une appli web avec une telle contrainte car je savais que j'avais juste à coder la partie back moi-même, surtout que le frontend était un bonus).

\*Bien sur, je n'ai pas eu assez de temps pour écrire des tests unitaires ou valider les résultats que j'ai obtenu.

\*Pour les infos qui me semblaient pertinents de demander à l'utilisateur, j'étais principalement inspiré par votre simulateur d'audit, mais forcément c'est une version beaucoup plus simpliste avec beaucoup moins d'input.

\*Pour le bilan de l'audit, j'ai aussi regardé ce que retourne la simulation de votre site web, et j'ai choisi d'implémenter les indicateurs qui étaient possibles à retourner à partir de nos données (les déperditions par ventilation et l'économie en CO2 par exemple n'étaient pas possibles). Le calcul d'une note pour la performance énergétique et climatique semble être trop compliqué pour le moment donc j'ai décidé d'utiliser juste les données que retournent nos services de calcul.

\*Faut noter que la structure du projet ne suit pas toujours les meilleurs conventions du développement web et logiciel (notamment des fonctions du logique métier qui sont écrits dans les composants Vue) et j'aurais aimé mettre les fonctions.

Ces notes là représentent en gros quel était mon raisonnement lors du développement de ce petit projet, et si vous voulez je peux détailler encore plus pourquoi j'ai fait certains choix, mais en gros je veux dire que même s'il reste beaucoup de travail à faire pour que ce soit exploitable (je pense que pour le moment, les valeurs retournés par l'audit ne sont pas réalistes et c'est très possible qu'il y ait des bugs dans le calcul aussi), je suis plutôt satisfait par ce que j'ai pu produire en une heure et demi (ou une heure et 35 minutes pour être exacte) et j'attends vos retours avec impatience.
