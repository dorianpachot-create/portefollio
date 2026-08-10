# Tests

Vérifient que les composants interactifs de `js/main.js` fonctionnent, sans navigateur.
Le DOM est simulé avec jsdom, les vraies pages du site sont chargées.

## Lancer les tests

```powershell
cd C:\Users\doria\Desktop\Rangement\Boulot\portefollio
npm install jsdom
node tests/dom.test.js
```

Sortie attendue : `26 reussis, 0 echecs`. Le script renvoie un code d'erreur
si un test échoue, ce qui permet de le brancher sur une intégration continue.

## Ce qui est couvert

| Composant | Vérifications |
|---|---|
| Thème | valeur par défaut, bascule, mémorisation, `aria-pressed` |
| Palette | ouverture au clic et au Ctrl+K, recherche, insensibilité aux accents, message si vide, fermeture par Échap |
| Filtres | comptage par technologie, état des boutons, retour à « Tout » |
| Carrousel | génération des pastilles, pastille active |
| Copie e-mail | présence et valeur copiée |
| Chemins relatifs | la palette fonctionne aussi depuis `pages/` |

`node_modules/` n'est pas versionné : `npm install jsdom` le recrée.
