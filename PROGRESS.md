# Etat d'avancement

Dernière mise à jour : 2026-08-07

## Mise à jour du 2026-08-07 — CV neutre, page Documents, SYNCRO en production

### CV remplacé

`assets/cv/CV_Dorian_Pachot.pdf` + `cv.png` régénérés à partir du CV du 28/07/2026.
Le PDF source (`alternance/CV/CV_Dorian_Pachot_SDIS76.pdf`) était personnalisé pour une
entreprise ; deux phrases ont été réécrites directement dans le flux du PDF pour le
rendre neutre :

- « …utile au service informatique du SDIS 76. » → « …utile aux équipes qui m'accueilleront. »
- « Site vitrine de l'application mobile, en bêta fermée sur Google Play et l'App Store. »
  → « Site vitrine de l'application mobile, publiée sur l'App Store et Google Play. »

**Si tu regénères le CV depuis ton outil de mise en page**, remplace simplement les deux
fichiers, il n'y a rien d'autre à refaire. Le PNG est un rendu 160 DPI :
`pdftoppm -png -r 160 CV_Dorian_Pachot.pdf cv`.

### Nouvelle page `pages/documents.html`

Regroupe trois pièces, chacune en image + bouton de téléchargement PDF :

1. **Lettre de recommandation Suitime** (20/07/2026, Valentin Javelaud) —
   `assets/recommandation/`
2. **Bulletin de 1re année** (IRIS MediaSchool, 22/06/2026, moyenne 15,55 contre 12,50
   pour la promotion) — `assets/bulletin/`, avec 4 chiffres clés en encadré et
   l'appréciation générale en citation
3. **Lettre de motivation** — déplacée depuis `cv.html`, qui renvoie maintenant vers
   cette page

### Caviardage des données personnelles

Les documents publiés ne sont pas les originaux. Trois éléments ont été retirés :

| Document | Retiré | Méthode |
|---|---|---|
| Bulletin | Date de naissance | Rectangle blanc sur le PNG |
| Bulletin | Signature de la directrice | Sélection des pixels bleus (`b - r > 30` et `b > 80`), dilatation 3 px, mise en blanc. Le tampon MediaSchool est conservé |
| Lettre de reco | Signature de Valentin Javelaud | XObject `/Image19` supprimé du PDF et son opérateur `Do` retiré du flux |

**Le caviardage est réel, pas un cache visuel.** Pour la lettre, l'image JPEG n'est plus
dans le fichier (`DCTDecode` absent) ; le texte reste sélectionnable. Pour le bulletin,
le PDF a été reconstruit depuis le PNG masqué avec `img2pdf` — c'était déjà un scan, il
n'y avait donc pas de couche texte à perdre.

**Les originaux non caviardés** restent dans `alternance/` :
`Bulletin 1ère année_DP.pdf` et `LETTRE RECO DORIAN.pdf`. Ce sont eux à envoyer aux
recruteurs qui les demandent. Le nom des enseignants a été conservé sur le bulletin
(ce sont des mentions professionnelles, pas des données privées).

Les deux pages du site le mentionnent explicitement sous chaque document, pour qu'un
recruteur ne prenne pas l'absence de signature pour un document douteux.

La page est ajoutée au nav des 6 pages et une carte « Documents » a été ajoutée sur
l'accueil.

### SYNCRO — publiée sur les deux stores

`pages/projets-perso.html` : la carte pointait vers un APK de 74 Mo
(`assets/syncro/app-release.apk`), qui n'était probablement jamais monté sur GitHub
(limite de 25 Mo via l'interface web). Remplacé par une ancre vers une nouvelle section
détaillée `#syncro` en bas de page, avec trois boutons vérifiés en ligne le 07/08 :

- App Store — https://apps.apple.com/fr/app/syncro/id6787898930
- Google Play — https://play.google.com/store/apps/details?id=fr.appsyncro.mobile
- Site vitrine — https://appsyncro.fr

Quatre captures d'écran ajoutées dans `assets/syncro/screens/`, redimensionnées à 720 px
de large depuis `syncro/medias/image 1-4.jpg`.

L'APK reste dans le dossier mais n'est plus lié nulle part — il peut être supprimé.

### CSS

Nouveaux blocs en fin de `css/style.css`, avant la section « Lecteur d'écran » :
`.doc-intro`, `.stat-list` / `.stat`, `.doc-quote`, `.store-links` / `.store-link`,
`.hero__highlight`, `.screens`.

### Restructuration : `gradient/` remonté à la racine

Le dépôt GitHub avait été créé en uploadant **le contenu** de `gradient/`, pas le dossier
lui-même : sa racine contient `index.html`, `css/`, `js/`, `assets/`, `pages/`. En local,
tout était encore sous `gradient/`. Pousser tel quel aurait cassé GitHub Pages, qui
n'aurait plus trouvé `index.html` à la racine.

Le contenu de `gradient/` a donc été remonté d'un niveau et le dossier supprimé. Local et
distant sont maintenant identiques — plus rien à déplacer avant un push. Les liens du
site étant tous relatifs, aucun n'a été affecté (vérifié : 0 lien cassé sur les 7 pages).

### Publier sur GitHub

Dépôt : https://github.com/dorianpachot-create/portefollio
Site : https://dorianpachot-create.github.io/portefollio/

Tout est déjà configuré : le dépôt local est initialisé, le remote `origin` est branché,
l'historique GitHub a été récupéré et **le commit est fait par-dessus**. Il ne reste
qu'une commande à lancer dans PowerShell :

```powershell
cd C:\Users\doria\Desktop\Rangement\Boulot\portefollio
git push -u origin main
```

Git demandera de s'authentifier au premier push (fenêtre GitHub qui s'ouvre dans le
navigateur, ou nom d'utilisateur + *personal access token* comme mot de passe — le mot de
passe du compte ne fonctionne plus depuis 2021).

Compter une à deux minutes avant que GitHub Pages redéploie. Puis vérifier :

- https://dorianpachot-create.github.io/portefollio/pages/documents.html doit exister
- « Documents » doit apparaître dans le menu de chaque page
- les trois boutons de stores doivent être en bas de « Projets personnels »

Les fois suivantes, c'est simplement :

```powershell
cd C:\Users\doria\Desktop\Rangement\Boulot\portefollio
git add -A
git commit -m "message"
git push
```

Aucun déplacement de fichier n'est nécessaire : depuis la restructuration, le dossier
local et le dépôt ont exactement la même arborescence.

**`.gitignore`** créé à la racine : il exclut `desktop.ini`, `Thumbs.db`, `.DS_Store` et
`assets/syncro/app-release.apk` (74 Mo, au-dessus de la limite de 25 Mo de l'interface
web GitHub — ce qui explique qu'il n'ait jamais été en ligne et que le bouton
« Télécharger l'APK » renvoyait un 404 — et devenu inutile maintenant que l'app est sur
les stores).

Le commit ajoute aussi `README.md` et `PROGRESS.md` au dépôt, qui n'y étaient pas.

## Mise à jour du 2026-07-01 (suite) — fiche GNS3 FortiGate HA

- **Nouveau TP publié dans la section Cyber-sécurité** de `pages/projets-cours.html` :
  compte rendu rédigé pour le lab GNS3 de Dorian (`Cours/SISR/GNS3/`, fichiers
  `lacestbon.gns3project` + `procedure.txt`) sur un cluster FortiGate HA + VLANs.
  Document Word source sauvegardé dans `Cours/SISR/GNS3/compte-rendu-gns3-fortigate-ha.docx`,
  PDF + schéma de topologie publiés dans
  `gradient/assets/fiches-cours/cyber-securite/compte-rendu-gns3-fortigate-ha.pdf`.
  Le fichier `.gns3project` (211 Mo, disques virtuels inclus) n'est volontairement
  pas publié sur le site, seul le compte rendu l'est.

## Mise à jour du 2026-07-01

- **Nouveau thème visuel "Hextech"** inspiré de l'identité graphique de League of
  Legends (bleu nuit + or, ornements géométriques, typo Rajdhani + Inter, tailles et
  contrastes renforcés pour la lisibilité), sans aucun logo ni visuel officiel Riot
  Games. Remplace le thème "Candy" précédent. Tout est dans `gradient/css/style.css`.
- **Page `pages/mentions-legales.html` ajoutée**, liée dans le nav et le footer de
  toutes les pages. **À FAIRE avant mise en ligne définitive** : compléter le
  paragraphe "Hébergement" avec le nom/adresse réels de l'hébergeur choisi
  (obligatoire légalement, LCEN art. 6-III) — repéré par un encart `.callout`
  bien visible dans la page.
- **Lettre de motivation affichée sur `pages/cv.html`**, en image (comme le CV),
  en plus du bouton de téléchargement PDF. Image générée depuis
  `assets/lettre-motivation/LM_Dorian_Pachot.pdf` → `lm.png`.
- **Fiches de cours ajoutées** dans `pages/projets-cours.html` : un lien "Voir la
  fiche" par TP quand un document correspondant existe, fichiers dans
  `gradient/assets/fiches-cours/<matière>/`. Sources converties depuis le dossier
  Cours de Dorian (docx/pptx → PDF via LibreOffice, PDF déjà existants copiés tels
  quels, scripts Python laissés en `.py`).
  **Point de vigilance** : `systemes/parc-informatique.pdf` et le rendu Pafalan
  mentionnent des camarades de classe par leur prénom (travaux de groupe/binôme).
  À vérifier avec eux avant publication définitive si besoin.
  Pas de fiche trouvée pour "Sécurisation des accès réseau", "Pafalan" (projet
  source, non publié) et "Jeu spatial en Python avec Pygame" (aucun fichier
  correspondant identifié dans le dossier Cours).

## Phase actuelle

**Phase 2 — Contenu intégré, thème PIXEL/ESPACE validé, attente de 2 livrables de Dorian.**

Pivot esthétique : portfolio refondé en thème pixel art / espace rétro pour matcher
le mini-jeu **Mission Orion** que Dorian développe en Python. Toutes les pages utilisent
maintenant les polices **Press Start 2P** (titres) et **VT323** (texte) via Google Fonts.
Fond étoilé tilable (`gradient/assets/stars.svg`), palette spatiale (bleu nuit → mauve)
avec accents jaune doré (#ffe66d) et cyan rétro (#5dccfc).

Identité Dorian Pachot intégrée, canard mascotte en place, trois designs alternatifs
supprimés, LinkedIn dans le footer, CV en mode image, section SYNCRO préparée pour
démo live Flutter Web.

## Etat par page

| Page                     | Etat                                                        |
|--------------------------|-------------------------------------------------------------|
| index.html               | Terminé                                                     |
| pages/cv.html            | Code prêt — attend `gradient/assets/cv/cv.png`              |
| pages/projets-cours.html | Placeholder (projets BTS publiés au fur et à mesure)        |
| pages/projets-perso.html | Cartes terminées — attend build Flutter Web dans `gradient/assets/syncro/web/` |
| pages/mini-jeu.html      | **Mission Orion intégré** : build pygbag jouable dans le cadre arcade |

## Actions Dorian — à faire

### 1. Générer l'image du CV — `cv.png`

Convertir le PDF `CV_Dorian_Pachot.pdf` en PNG :
- Outil rapide : **ilovepdf.com → "PDF en JPG"** (drag & drop)
- Ou Adobe Acrobat Reader → Exporter en image
- Ou Photoshop / GIMP : ouvrir le PDF, exporter en PNG
- Qualité : **150 DPI minimum**, idéalement 200 DPI

Déposer le fichier ici sous le nom exact `cv.png` :
```
gradient/assets/cv/cv.png
```

Le PDF original peut être conservé à côté pour le bouton "Télécharger le PDF" :
```
gradient/assets/cv/CV_Dorian_Pachot.pdf
```

Voir `gradient/assets/cv/README.txt` pour le détail.

### 2. Générer la démo SYNCRO — build Flutter Web

Depuis le projet SYNCRO en local :
```bash
flutter build web --release
```

Copier ensuite **tout le contenu** de `build/web/` dans :
```
gradient/assets/syncro/web/
```

Tu dois te retrouver avec `gradient/assets/syncro/web/index.html` et tous les fichiers à côté.

**Important** : Flutter Web ne fonctionne pas en `file://` à cause des règles CORS. Pour tester la démo localement il FAUT un serveur :
```powershell
cd c:\Users\doria\Desktop\Rangement\Boulot\portefollio
python -m http.server 8000
```
Puis ouvrir http://localhost:8000/gradient/pages/projets-perso.html

Voir `gradient/assets/syncro/README.txt` pour le détail.

### 3. Mission Orion — FAIT

Le build pygbag est en place dans `gradient/assets/mission-orion/web/`,
intégré via iframe dans `mini-jeu.html`, dans un cadre arcade 16:9 jaune.

**Pour ré-actualiser le build après une modification du jeu** :
1. Cd dans le projet Mission Orion
2. `pygbag --build .` (génère build/web/)
3. `Copy-Item -Path "C:\Users\doria\Desktop\Rangement\Boulot\Mission Orion\build\web\*" -Destination "C:\Users\doria\Desktop\Rangement\Boulot\portefollio\gradient\assets\mission-orion\web\" -Recurse -Force`
4. **IMPORTANT** : réappliquer les fixes cosmétiques dans index.html de pygbag
   (sinon les bandes grises + barres de chargement reviennent). Voir le bloc
   `<style>` modifié — c'est ce qui rend le fond noir et masque le terminal.

Test : ouvrir la page via Live Server VS Code (pas file://) car pygbag CORS.

## Ce qui est désormais en place

- **Identité** : Dorian Pachot, BTS SIO SLAM 2025-2027, IRIS Mediaschool
- **Logo** : canard pixel jaune dans le brand mark (`gradient/assets/duck.svg`)
- **CV (cv.html)** : balise `<img>` qui charge `cv.png` + bouton "Télécharger le PDF"
- **Projets perso** :
  - Carte CRP-Assurance.com — bouton vers https://crp-assurance.com
  - Carte SYNCRO + section "Démonstration interactive" avec **device-frame** (cadre téléphone CSS) contenant l'iframe Flutter Web
- **Footer** : nom + LinkedIn + email (présent sur les 5 pages)
- **LinkedIn** : https://www.linkedin.com/in/dorian-pachot-81299930a/

## Décisions de conception finales

- **Thème pixel art / espace rétro** (inspiré du jeu Mission Orion)
- Palette spatiale : `#07091c → #11164a → #1f1340` (dégradé bleu nuit → mauve nébuleuse)
- Accents arcade : `#ffe66d` jaune doré (principal), `#5dccfc` cyan, `#ff6ec7` magenta
- Champ d'étoiles tilable (`gradient/assets/stars.svg`) — 1-2 px de blanc/jaune/cyan
- Polices Google Fonts : **Press Start 2P** (titres) + **VT323** (texte courant, body 22px)
- Bordures pixel (3px solid) sans border-radius, ombres dures sans flou ("stepped")
- Header HUD bleu nuit avec bordure jaune dorée + footer même style
- Canard mascotte (jaune lunettes de soleil) posé sur le HUD, sort sur fond sombre
- CV en mode image (plus de visualiseur PDF embarqué)
- SYNCRO en démo live via Flutter Web build dans un cadre CSS "téléphone"
- Pas de framework CSS, vanilla JS uniquement
- `image-rendering: pixelated` sur body et images pour préserver l'aspect 8-bit

## Reprise rapide

1. Lire ce fichier
2. Lire `README.md` à la racine pour la vue d'ensemble
3. Lancer un serveur local : `python -m http.server 8000` depuis le dossier `portefollio/`
4. Ouvrir http://localhost:8000/gradient/ — c'est la version live
5. Vérifier les 3 livrables Dorian listés ci-dessus
