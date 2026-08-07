Démo SYNCRO — Flutter Web

La page projets-perso.html intègre SYNCRO via une iframe pointant vers
gradient/assets/syncro/web/index.html.

Comment générer le build :

1. Dans le projet SYNCRO (Flutter), depuis le terminal :

       flutter build web --release

   Cela génère le dossier build/web/ avec tous les fichiers nécessaires
   (index.html, main.dart.js, assets, etc.).

2. Copier l'INTÉGRALITÉ du contenu de build/web/ dans :

       gradient/assets/syncro/web/

   Tu devrais te retrouver avec :
   gradient/assets/syncro/web/index.html
   gradient/assets/syncro/web/main.dart.js
   gradient/assets/syncro/web/assets/
   gradient/assets/syncro/web/canvaskit/
   etc.

3. Pour tester en local, lancer un serveur depuis la racine du portfolio :

       python -m http.server 8000

   Puis ouvrir http://localhost:8000/gradient/pages/projets-perso.html

   IMPORTANT : Flutter Web ne fonctionne PAS via le protocole file://
   à cause des restrictions CORS. Il FAUT un serveur local.

Conseils :

- Optimiser le build : `flutter build web --release --tree-shake-icons`
- Si l'app fait > 5 Mo, prévoir un loader visible (Flutter en met un par défaut)
- Tester l'app dans le navigateur AVANT de la copier pour valider qu'elle
  marche en mode web (plugins natifs Android/iOS non supportés)

Pour mettre à jour la démo plus tard :
- Re-build l'app (étape 1)
- Remplacer le contenu du dossier web/ (étape 2)
- Pas de modification HTML / CSS nécessaire
