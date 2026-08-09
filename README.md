# Portfolio BTS SIO — Dorian Pachot

Site vitrine personnel développé dans le cadre du BTS SIO option SLAM à IRIS Mediaschool.
Présente le CV, les documents de candidature (bulletin, lettre de recommandation, lettre
de motivation), les projets de développement personnels, les projets de cours et un
mini-jeu en Python jouable dans le navigateur.

## Structure

La racine du dossier est directement la racine du site, pour que GitHub Pages serve
`index.html` sans configuration.

```
portefollio/
├── README.md
├── PROGRESS.md          Etat d'avancement et points de reprise
├── .gitignore
├── index.html           Accueil
├── css/style.css        Tout le style (variables en tête de fichier)
├── js/main.js           Toggle du menu mobile (vanilla JS)
├── assets/
│   ├── stars.svg                 Champ d'étoiles tilable
│   ├── cv/
│   │   ├── cv.png                Image du CV (rendu 160 DPI du PDF)
│   │   └── CV_Dorian_Pachot.pdf  CV au format PDF (bouton télécharger)
│   ├── bulletin/
│   │   ├── bulletin.png
│   │   └── Bulletin_1ere_annee_Dorian_Pachot.pdf
│   ├── recommandation/
│   │   ├── reco.png
│   │   └── Lettre_recommandation_Suitime.pdf
│   ├── lettre-motivation/
│   │   ├── lm.png
│   │   └── LM_Dorian_Pachot.pdf
│   ├── fiches-cours/             Fiches PDF par matière (projets encadrés)
│   ├── mission-orion/web/        Build pygbag du mini-jeu
│   └── syncro/
│       ├── screens/              Captures de l'app (galerie)
│       └── app-release.apk       Ancien APK — non versionné, plus lié dans le site
└── pages/
    ├── cv.html              CV en image + bouton télécharger
    ├── stage.html           Stage chez Suitime, semaine par semaine
    ├── documents.html       Recommandation, bulletin, lettre de motivation
    ├── projets-cours.html   TP du BTS, avec fiches PDF
    ├── projets-perso.html   CRP-Assurance, SYNCRO, agent IA, Mission Orion
    ├── mini-jeu.html        Mission Orion jouable en WebAssembly
    └── mentions-legales.html
```

## Contenu à jour au 9 août 2026

- **CV** : version neutre (sans nom d'entreprise), à jour au 28/07/2026, mentionnant
  SYNCRO, CRP-Assurance.com et appsyncro.fr.
- **Stage** : les cinq semaines chez Suitime, semaine par semaine. Page réécrite à
  partir du journal de stage, sans les éléments techniques internes au client — voir
  `PROGRESS.md` pour le détail de ce qui a été retiré et pourquoi.
- **Documents** : lettre de recommandation Suitime (stage du 6 juillet au 7 août 2026),
  bulletin de 1<sup>re</sup> année (moyenne 15,55 pour 12,50 de promotion), lettre de
  motivation type.
- **SYNCRO** : l'application est publiée sur les deux stores, le site vitrine est en
  production. Les trois liens sont dans `pages/projets-perso.html` :
  - App Store — https://apps.apple.com/fr/app/syncro/id6787898930
  - Google Play — https://play.google.com/store/apps/details?id=fr.appsyncro.mobile
  - Site — https://appsyncro.fr

## Comment ouvrir le site

Un serveur local est nécessaire (Mission Orion en pygbag ne tourne pas en `file://`) :

```powershell
cd c:\Users\doria\Desktop\Rangement\Boulot\portefollio
python -m http.server 8000
```

Puis ouvrir [http://localhost:8000/](http://localhost:8000/).

## Design

- Thème **Hextech** (bleu nuit + or), inspiré de l'identité graphique de League of
  Legends, sans aucun logo ni visuel officiel Riot Games.
- Palette : `--navy-0/1/2/3` pour les fonds, `--gold` et `--gold-light` pour les accents,
  `--cyan` et `--bronze` en secondaire. Toutes les variables sont en tête de `style.css`.
- Polices Google Fonts : **Rajdhani** (titres) et **Inter** (texte courant).
- Cartes avec bordure or, losanges en coin, ombres dures.
- Pas de framework CSS, JavaScript vanilla uniquement.

## Technologies

HTML5 sémantique, CSS3 (variables, grid, flex), JavaScript vanilla. Aucun framework.
Compatibilité navigateurs modernes.

## Accessibilité

- HTML sémantique (`header`, `nav`, `main`, `section`, `article`, `footer`)
- `lang="fr"` partout
- Skip link (`Aller au contenu`)
- `aria-current="page"` sur le lien de la page active
- `aria-label` sur les éléments décoratifs ou compacts
- Focus visible (outline 2px sur tous les éléments interactifs)
- Contraste WCAG AA respecté

## Mise en ligne

Publié sur GitHub Pages : **https://dorianpachot-create.github.io/portefollio/**
Dépôt : https://github.com/dorianpachot-create/portefollio

Pour mettre à jour :

```powershell
cd C:\Users\doria\Desktop\Rangement\Boulot\portefollio
git add -A
git commit -m "message"
git push
```

GitHub Pages redéploie tout seul en une à deux minutes.

## Reprise du travail

Voir `PROGRESS.md` pour l'état détaillé et ce qui reste à faire.
