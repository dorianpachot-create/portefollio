# Historique du portfolio

Le détail de chaque modification est dans l'historique Git (`git log`). Ici, l'essentiel.

| Date | Ce qui a changé |
|---|---|
| Juillet 2026 | Première version : HTML écrit à la main, page Documents, fiches de cours |
| Août 2026 | Refontes du design, journal de stage, mini-jeu Mission Orion jouable en ligne, SYNCRO en production |
| Septembre 2026 | Veille technologique, Pla'Net, nouvelle identité visuelle |
| 13 octobre 2026 | Design sombre et rouge ; une page par projet ; **passage à Symfony 7.4 et aux composants Twig**, textes sortis dans `app/contenu/*.yaml`, export HTML pour GitHub Pages |
| 14 octobre 2026 | Pla'Net recentré sur la planification et la base de données ; premier clic toujours vers la présentation ; mode présentation (touche P) |
| 23 octobre 2026 | Veille PHP2Shell ; projet « Gestion de cabinet » ; nouvelle capture de CRP-Assurance ; **mode clair** ; recherche dans le menu ; vraies captures de SYNCRO ; présentation de l'oral refaite (15 diapos, PowerPoint téléchargeable) ; numéros 01, 02… retirés ; **nettoyage du code mort** et annexes ajoutées |

## Ce qui a été retiré, et pourquoi

- **Section « En dehors du travail »** (centres d'intérêt) : retirée de l'accueil le 14 octobre, son
  fichier et son code ont été supprimés le 23 octobre.
- **Radar des compétences** et jauges chiffrées : retirés (« pas de notes ni de niveaux »).
- **Pastille « Disponible pour une alternance »** dans le menu : retirée à la demande.
- **Images inutilisées** (anciennes couvertures, aperçus, fond étoilé) et notes `README.txt` obsolètes.

## Points ouverts

- La capture de Pla'Net montre la maquette de conception (choix gardé).
- `php bin/console app:export` n'a pas pu être lancé depuis l'environnement de Claude (pas d'accès à
  Packagist) : les pages HTML ont été mises à jour en même temps que les YAML et les gabarits. Le
  lancer une fois sur un poste avec PHP permet de vérifier que l'export redonne le même résultat.

## 4 novembre 2026 : TP, fiches de cours et gestion de cabinet à jour

- Gestion de cabinet : nouvelles versions des cahiers (tout le catalogue pour chaque mandataire), MCD,
  MLD, schéma relationnel et script SQL (19 tables) en annexes, section « La base de données » sur la
  page du projet, fiche E5, diapo 11 et PowerPoint mis à jour.
- Nouveaux TP : Le Fournil (BDD), PowerShell TP1, PrivaMilk et agents IA (anglais), les faussaires
  (culture générale), jeu de Bataille (1re année). VitaSport : réponses des parties 1 à 5 en PDF.
- Annexes : le type de chaque compte rendu (PDF, Python, SQL) est déduit de l'extension du fichier.
- Schéma relationnel corrigé (nouvelle version du PC) : image de la page projet et PDF des annexes.
- Présentation de l'oral recentrée sur deux réalisations : la gestion de cabinet et SYNCRO (qui
  couvrent à elles deux les six compétences). La diapo Pla'Net est remplacée par une seconde diapo
  SYNCRO sur les incidents en production ; le tableau de synthèse complet reste en annexe.
