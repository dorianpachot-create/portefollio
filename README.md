# Portfolio BTS SIO — Dorian Pachot

Site vitrine personnel développé dans le cadre du BTS SIO option SLAM à IRIS MediaSchool.
L'accueil est une page unique qui déroule : profil et compétences, stage chez Suitime,
projets personnels, projets encadrés du BTS, documents de candidature, coulisses
techniques et contact. Les contenus longs (journal de stage,
documents en grand, fiches de cours, mini-jeu) ont leur propre page.

## Structure

La racine du dossier est directement la racine du site, pour que GitHub Pages serve
`index.html` sans configuration.

```
portefollio/
├── README.md
├── PROGRESS.md          Etat d'avancement et points de reprise
├── .gitignore
├── index.html           Accueil — page unique : profil, stage, projets, documents, contact
├── css/style.css        Tout le style (variables en tête de fichier)
├── js/main.js           Thème, menu, palette Ctrl+K, filtres, carrousel (vanilla JS)
├── sitemap.xml
├── robots.txt
├── tests/dom.test.js    28 tests des composants interactifs (jsdom)
├── assets/
│   ├── meta/                     Favicon, image de partage, vignettes WebP
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
    ├── projets-perso.html   CRP-Assurance, SYNCRO, Mission Orion
    ├── mini-jeu.html        Mission Orion jouable en WebAssembly
    └── mentions-legales.html
```

## Contenu à jour au 10 août 2026

- **CV** : version neutre (sans nom d'entreprise), à jour au 28/07/2026, mentionnant
  SYNCRO, CRP-Assurance.com et appsyncro.fr.
- **SYNCRO** : projet développé d'avril à août 2026 pour Suitime, dont cinq semaines de
  stage à temps plein (6 juillet au 7 août). Frise du projet et histogramme des 84 commits
  sur l'accueil ; journal détaillé du stage sur `pages/stage.html`, réécrit sans les
  éléments techniques internes au client — voir `PROGRESS.md`.
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

- Clair et sobre : fond blanc, une seule couleur d'accent (`--accent`, bleu `#1d4ed8`),
  bordures fines et beaucoup d'espace. Lisible aussi à l'impression.
- Toutes les variables sont dans `:root`, en tête de `css/style.css`.
- Une seule police Google Fonts : **Inter**.
- Les sections alternent `--bg` et `--bg-soft` pour donner du rythme sans ajouter de couleur.
- Chaque section de l'accueil occupe au moins la hauteur d'un écran, contenu centré
  verticalement (`min-height: calc(100vh - 64px)`), et retombe à sa hauteur naturelle
  sous 900 px pour éviter les grands vides sur mobile.
- Pas de framework CSS, JavaScript vanilla uniquement.

## Fonctionnalités

- **Thème clair / sombre** mémorisé, aligné par défaut sur le réglage du système, sans
  flash au chargement (script inline dans le `<head>`).
- **Recherche** dans l'en-tête ou au `Ctrl+K` : 25 destinations, recherche insensible aux
  accents, navigation entièrement au clavier.
- **Filtre des projets** par technologie.
- **Frise du projet** et **histogramme d'activité** en CSS pur, sans bibliothèque.
- **Carrousel** des captures de SYNCRO dans l'accroche, en `scroll-snap`, utilisable sans
  JavaScript.
- Section **« Ce site est aussi un projet »** qui détaille les choix techniques et invite
  à essayer les composants.
- **Copie de l'e-mail** en un clic, avec repli pour les navigateurs anciens.
- Apparition au défilement et compteurs animés, désactivés si `prefers-reduced-motion`.
- Mini-jeu Python jouable dans le navigateur (build pygbag en WebAssembly).

## Technologies

HTML5 sémantique, CSS3 (variables, grid, flex), JavaScript vanilla. Aucun framework,
aucune dépendance au chargement. jsdom sert uniquement aux tests.

## Tests

```powershell
npm install jsdom
node tests/dom.test.js
```

28 vérifications sur les composants interactifs, sans navigateur. Voir `tests/README.md`.

## SEO

Données structurées JSON-LD (`schema.org/Person`), balises Open Graph avec image
1200×630, favicon SVG, `sitemap.xml` et `robots.txt`.

## Accessibilité

- HTML sémantique (`header`, `nav`, `main`, `section`, `article`, `footer`)
- `lang="fr"` partout
- Skip link (`Aller au contenu`)
- `aria-current="page"` sur le lien de la page active
- `aria-label` sur les éléments décoratifs ou compacts
- Focus visible (outline 2px sur tous les éléments interactifs)
- Contraste WCAG AA respecté dans les deux thèmes
- `prefers-reduced-motion` respecté sur toutes les animations
- Palette de commandes entièrement utilisable au clavier

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
