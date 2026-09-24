# Portfolio BTS SIO, Dorian Pachot

Site vitrine personnel développé dans le cadre du BTS SIO option SLAM à IRIS MediaSchool.
L'accueil est une page unique qui déroule : présentation, compétences, stage chez Suitime,
projets personnels, projets encadrés du BTS, veille technologique, documents de candidature, coulisses
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
├── index.html           Accueil, 9 sections : présentation, compétences, stage,
│                        projets, cours, veille, documents, coulisses, contact
├── css/style.css        Tout le style (variables en tête de fichier)
├── js/main.js           Menu, palette Ctrl+K, carrousel de projets (vanilla JS)
├── sitemap.xml
├── robots.txt
├── tests/dom.test.js    55 tests des composants interactifs (jsdom)
├── assets/
│   ├── fonts/                    DM Sans en woff2, servie localement
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
│       └── app-release.apk       Ancien APK, non versionné, plus lié dans le site
└── pages/
    ├── cv.html              CV en image + bouton télécharger
    ├── stage.html           Stage chez Suitime, semaine par semaine
    ├── documents.html       Recommandation, bulletin, lettre de motivation
    ├── projets-cours.html   TP du BTS, avec fiches PDF
    ├── projets-perso.html   CRP-Assurance, SYNCRO, Pla'Net, Mission Orion
    ├── mini-jeu.html        Mission Orion en plein écran, sans en-tête ni pied de page
    └── mentions-legales.html
```

## Contenu à jour au 24 septembre 2026

- **Titre** : « Étudiant en BTS SIO SLAM » sous le nom (et dans le `<title>`, l'Open Graph
  et le JSON-LD), à la place de « Développeur full-stack ».
- **Pla'Net** : application web de planning pour les écoles MediaSchool (IRIS, ECS, IEJ),
  commencée en septembre 2026. Prototype HTML/CSS/JS (dossier `Bureau/mediaschool-planning`)
  puis application Symfony + Twig sur MariaDB (dossier `Bureau/planet-app`, 11 tables).
  Diapositive dans le carrousel, étape dans la frise, fiche détaillée sur
  `pages/projets-perso.html#planet`. Capture du prototype : `assets/meta/shot-planet.*`.
- **Veille technologique** : nouvelle section 06 de l'accueil (`#veille`). Méthode en trois
  temps, six thèmes rattachés chacun à un projet ou un cours, et les derniers articles
  repérés via les alertes Google. **À tenir à jour** : copier un `<li>` dans `.watch-feed`
  et changer la date « Mis à jour le ».


- **CV** : version neutre (sans nom d'entreprise), à jour au 28/07/2026, mentionnant
  SYNCRO, CRP-Assurance.com et appsyncro.fr.
- **SYNCRO** : projet développé d'avril à août 2026 pour Suitime, dont cinq semaines de
  stage à temps plein (6 juillet au 7 août). Frise du projet et histogramme des 84 commits
  sur l'accueil ; journal détaillé du stage sur `pages/stage.html`, réécrit sans les
  éléments techniques internes au client, voir `PROGRESS.md`.
- **Documents** : lettre de recommandation Suitime (stage du 6 juillet au 7 août 2026),
  bulletin de 1<sup>re</sup> année (moyenne 15,55 pour 12,50 de promotion), lettre de
  motivation type.
- **SYNCRO** : l'application est publiée sur les deux stores, le site vitrine est en
  production. Les trois liens sont dans `pages/projets-perso.html` :
  - App Store, https://apps.apple.com/fr/app/syncro/id6787898930
  - Google Play, https://play.google.com/store/apps/details?id=fr.appsyncro.mobile
  - Site, https://appsyncro.fr

## Où toucher pour changer quoi

Le tableau ci-dessous répond à la question « je veux modifier ça, je vais où ».

| Ce que je veux changer | Fichier | Où exactement |
|---|---|---|
| Une couleur, la largeur du site, les coins arrondis | `css/style.css` | Le bloc `:root` tout en haut |
| Le style général (accroche, boutons, survols) | `css/style.css` | Le bloc « 10. IDENTITE VISUELLE », tout en bas |
| Un texte de l'accueil | `index.html` | Chaque section a un gros commentaire qui la nomme |
| Une étape du parcours | `index.html` | Un `<li class="path__step">` dans le bloc `#parcours`, avec sa famille de couleur : `--tech`, `--sport`, `--terrain` ou `--now` |
| Ajouter un projet | `index.html` | Copier un `<li class="carousel__slide">` dans la section Projets, ajouter son onglet avec le bon `data-carousel-go` (index à partir de 0) et mettre à jour le total du compteur |
| Ajouter une destination à la recherche | `js/main.js` | Une ligne dans le tableau `ENTRIES`, bloc 4 |
| Ajouter une matière | `index.html` + `pages/projets-cours.html` | Une tuile `.subject-card` sur l'accueil, un bloc `<details>` avec un `id` sur la page des fiches |
| Le CV, le bulletin, les lettres | `assets/` | Remplacer le PDF et son image. Les vignettes allégées sont dans `assets/meta/` |

### Bon à savoir avant de modifier

- **Ne pas déplacer le script en haut des pages HTML.** Il pose la classe `js` avant le
  premier affichage, ce qui évite un saut des blocs animés au chargement.
- **Les animations sont désactivées par défaut en CSS** et ne s'activent qu'avec la
  classe `js`. C'est volontaire : si le JavaScript plante, le site reste lisible au lieu
  de devenir à moitié invisible.
- **Un seul fichier de style et un seul fichier de script** pour les 8 pages. Chaque bloc
  de `main.js` s'arrête tout seul s'il ne trouve pas son HTML.
- **Un seul écouteur de défilement** pour tout le site, dans le bloc `scrollEngine`. Ne
  jamais en ajouter un autre, et ne jamais lire `scrollHeight` ou `getBoundingClientRect`
  pendant le défilement : ça force un recalcul complet de la mise en page et fait sauter
  le scroll.
- **Ce qui couvre l'écran n'anime que `transform`.** Animer une couleur, une position de
  fond ou une taille sur un grand élément coûte un repaint par image.
- **Après une modification, lancer les tests** (voir plus bas). Ils prennent deux
  secondes et attrapent les liens cassés et les composants qui ne répondent plus.

## Comment ouvrir le site

Un serveur local est nécessaire (Mission Orion en pygbag ne tourne pas en `file://`) :

```powershell
cd c:\Users\doria\Desktop\Rangement\Boulot\portefollio
python -m http.server 8000
```

Puis ouvrir [http://localhost:8000/](http://localhost:8000/).

## Design

- **Sobre mais coloré, en aplats.** Cinq couleurs, jamais de dégradé, de halo ni de flou :
  papier `#f9fbfc`, marine `#203961`, menthe `#a2cdb8`, corail `#e1755e`, taupe `#5d554b`
  (variables `--c-paper`, `--c-navy`, `--c-mint`, `--c-coral`, `--c-taupe`). La bande des
  cinq couleurs sous l'accroche et au-dessus du pied de page sert de signature.
- Liens en marine, boutons pleins en corail avec texte encre (`--ink`), boutons secondaires
  en contour. Au survol, les cartes se décalent avec une ombre franche de leur couleur,
  sans flou.
- Les teintes `--c-blue`, `--c-teal`, `--c-violet`, `--c-amber`, `--c-rose` gardent leurs
  noms historiques mais sont dérivées de la palette (marine, menthe foncée, taupe, corail
  foncé) pour rester lisibles en texte. Elles différencient sections, matières et
  familles de compétences.
- Chaque composant lit une variable locale `--c` : poser `--c` sur un parent recolore tout
  ce qu'il contient, sans toucher au HTML.
- **Deux largeurs** : `--maxw` (1240 px) pour le texte, `--maxw-wide` (1560 px) pour les
  grilles et les visuels. Les blocs de texte sont en plus limités en `ch`, donc en nombre
  de caractères par ligne, ce qui reste lisible quelle que soit la taille d'écran.
- Toutes les variables sont dans `:root`, en tête de `css/style.css`.
- Une seule police, **DM Sans** (400 à 700), servie depuis `assets/fonts/`, aucun appel à
  un service tiers. Pas de police « code » : tout le site parle la même langue.
- Pas de thème sombre : la palette est pensée pour un seul fond clair.
- Pas d'icônes décoratives ni de séparateurs typographiques (`//`, `/`, tirets). Les
  seules icônes restantes sont fonctionnelles : loupe de recherche, flèches du carrousel,
  retour en haut, et les logos des badges App Store et Google Play.
- Numéros de section de 01 à 09 en filigrane, posés par `data-num` et `attr()`.
- L'accroche et deux sections (Stage, Ce site) en marine plein. La
  classe `.section--invert` ne fait que redéfinir les variables de couleur : tout le
  contenu suit sans règle supplémentaire.
- Une section sur deux prend un aplat très clair de sa couleur, l'autre reste sur le fond
  de page.
- Tout le parti pris visuel est regroupé dans le bloc « 10. IDENTITE VISUELLE », à la fin
  de `css/style.css`.
- Chaque section de l'accueil occupe au moins la hauteur d'un écran, contenu centré
  verticalement (`min-height: calc(100vh - 64px)`), et retombe à sa hauteur naturelle
  sous 900 px pour éviter les grands vides sur mobile.
- Pas de framework CSS, JavaScript vanilla uniquement.

## Fonctionnalités

- **Recherche** dans l'en-tête ou au `Ctrl+K` : 29 destinations, recherche insensible aux
  accents, navigation entièrement au clavier.
- **Frise du projet** et **histogramme d'activité** en CSS pur, sans bibliothèque.
- **Frise du parcours** dans la section « Qui je suis » : quinze étapes de 2017 à
  l'alternance recherchée, colorées par famille (technique, sport, terrain, aujourd'hui).
- **Carrousel de projets** : les quatre projets partagent le même gabarit (ce que c'est,
  pourquoi, avec quoi, où aller voir). Navigation par onglets nommés, flèches ou clavier,
  et repli en `scroll-snap` si le JavaScript ne se charge pas.
- Section **« Ce site est aussi un projet »** qui détaille les choix techniques et invite
  à essayer les composants.
- **Copie de l'e-mail** en un clic, avec repli pour les navigateurs anciens.
- **Barre de contact fixe** en bas de chaque page : e-mail, téléphone et CV toujours
  accessibles.
- **Barre de progression** de lecture en haut de l'écran.
- **Défilé de technologies** sous les compétences, en pause au survol.
- Apparition au défilement en cascade et compteurs animés, désactivés si
  `prefers-reduced-motion`.
- Mini-jeu Python jouable dans le navigateur (build pygbag en WebAssembly).

## Technologies

HTML5 sémantique, CSS3 (variables, grid, flex), JavaScript vanilla. Aucun framework,
aucune dépendance au chargement. jsdom sert uniquement aux tests.

## Tests

```powershell
npm install jsdom
node tests/dom.test.js
```

55 vérifications sur les composants interactifs, sans navigateur. Voir `tests/README.md`.

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
- Contraste WCAG AA respecté
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
