# Etat d'avancement

Dernière mise à jour : 2026-08-10

## Mise à jour du 2026-08-10, cadre du portrait et cohérence du thème

### Le cadre du portrait était mal posé

Le cadre décalé était un pseudo-élément de la `<figure>` entière, or celle-ci contient
l'image **et** la légende. Le cadre descendait donc jusque sous le texte.

Il est maintenant sur un `.portrait__frame` qui n'entoure que l'image, avec un décalage
en `transform` plutôt qu'en `inset` négatif, ce qui évite qu'il déborde du conteneur.
La photo est en plus contrainte en carré avec `object-fit: cover`.

### La bascule de thème avait perdu son sens

Remarque de Dorian, et elle est juste : avec deux sections sombres en permanence, changer
de thème ne modifiait qu'une partie du site. Sur ces deux sections, la bascule ne faisait
rien.

**En thème sombre, l'inversion s'inverse.** Le principe de ces sections est de rompre avec
le reste, pas d'être sombres. En thème clair, rompre veut dire passer au sombre ; en thème
sombre, passer au clair.

La règle tient en un bloc : `[data-theme="dark"] .section--invert` redéfinit les mêmes
variables avec des valeurs claires. Rien d'autre à écrire.

Les valeurs ne sont pas le blanc pur du thème clair : un aplat blanc au milieu d'une page
sombre est agressif. C'est un gris très clair légèrement bleuté, qui tranche sans éblouir.

### Contraste vérifié sur ce nouveau cas

Deux valeurs ne passaient pas au premier jet : le texte tertiaire à 4,25 et l'ambre à 4,44.
Corrigés en `#5d6880` et `#92400e`. Les 19 combinaisons de ce mode sont maintenant
au-dessus de 4,5, la plus basse à 4,60.

La section « Ce site » mentionne le comportement, puisqu'elle invite justement à essayer
la bascule.

## Mise à jour du 2026-08-10, largeurs et portrait

Question de Dorian : pourquoi laisser des marges sur les côtés plutôt que prendre toute
la page.

### Deux largeurs, pas une

Réponse courte : parce que le texte et les grilles n'ont pas les mêmes besoins.

Au-delà d'environ 75 caractères par ligne, l'œil perd le début de la ligne suivante en
revenant à la ligne. Un paragraphe étalé sur 1900 px est objectivement plus pénible à
lire, même si l'écran le permet. C'est la raison pour laquelle les journaux et les livres
sont en colonnes.

En revanche, une grille de cartes, une frise ou un histogramme n'ont aucune longueur de
ligne à respecter. Les brider n'apporte rien.

D'où deux variables :

| | Avant | Après | Pour quoi |
|---|---|---|---|
| `--maxw` | 1080 px | **1240 px** | Le texte courant |
| `--maxw-wide` | néant | **1560 px** | Grilles, frise, histogramme, documents |

Les sections Compétences, Stage, Projets, Cours et Documents passent en large. Les blocs
de texte gardent une limite en `ch`, donc en caractères et non en pixels : la contrainte
suit la taille de police.

La largeur gagnée sert à afficher **plus de colonnes**, pas des cartes géantes. Les seuils
des grilles ont été relevés en conséquence.

### Portrait

La section Qui je suis passe à trois colonnes : portrait, texte, repères. C'est ce qui
occupe le mieux la largeur gagnée, et une photo sur un dossier de candidature n'a rien
d'anecdotique.

La photo vient de `alternance/profil.jpg`, réduite à 720 px, en WebP avec repli JPEG,
30 Ko. Elle figure déjà sur le CV publié, donc elle était de toute façon en ligne.

Le cadre coloré décalé derrière la photo est un pseudo-élément CSS, pas une image : rien
de plus à charger.

Pour la retirer : supprimer le bloc `<figure class="portrait">` dans `index.html`. La
grille repasse d'elle-même à deux colonnes.

## Mise à jour du 2026-08-10, section Projets et mini-jeu

### Le carrousel affichait des timbres-poste

Les captures font 1080x1920, soit du 9/16. Elles étaient posées dans un cadre large en
`object-fit: contain` : l'image occupait environ un tiers de la surface, le reste était du
vide. Le cadre lui-même est maintenant en 9/16 et limité à 260 px de large, l'image le
remplit entièrement.

### Le badge « En production » masquait les vignettes

Il était posé en haut à gauche de l'image de couverture, en plein sur le visuel. Il
descend au ras du bas du cadre, sur la zone la moins chargée, avec un fond opaque et une
pastille verte pour rester lisible quelle que soit l'image derrière.

### Vrais badges de magasins

Les trois liens deviennent de vrais badges : fond noir, coins arrondis, logo à gauche,
petite ligne au-dessus du nom du magasin. Le triangle Google Play est dessiné en SVG avec
ses quatre faces colorées.

Les trois ont la même hauteur de 54 px et sont alignés sur la même rangée, y compris celui
d'appsyncro.fr, qui garde la forme mais reste aux couleurs du site : c'est un lien maison,
pas un badge de magasin.

**À savoir :** ce sont des reproductions en SVG, pas les fichiers officiels d'Apple et de
Google. Pour un usage commercial il faudrait télécharger les visuels sur leurs pages de
ressources presse. Pour un portfolio personnel, ça ne pose pas de problème.

### Le mini-jeu se fond dans la page

Avant : un cadre de 860 px au milieu d'une page blanche. La fenêtre paraissait minuscule
et le jeu semblait collé là sans raison.

Maintenant, la page entière passe en fond sombre, comme une borne d'arcade, et le jeu
occupe presque tout l'écran. Sa hauteur suit celle de la fenêtre,
`clamp(420px, 100vh - barre - marges, 780px)`, donc il ne devient jamais minuscule ni
démesuré. Le cadre n'a plus de bordure nette mais une lueur bleutée, ce qui le pose dans
la page au lieu de le coller dessus.

Là encore, la page bascule en sombre juste en redéfinissant les variables de couleur sur
le `<body>`, sans réécrire un seul composant.

Un mot sous le jeu prévient que le chargement prend quelques secondes, puisque c'est
Python entier qui est téléchargé dans le navigateur.

### Les flèches

Il n'y en avait déjà plus dans le code : `content: "→"` avait été supprimé au commit
précédent. Ce que Dorian voyait venait du cache de son navigateur.

## Mise à jour du 2026-08-10, parti pris visuel

Demande : oser, sortir du rendu générique, et retirer les flèches des boutons.

### Les flèches sont parties

Le `→` après chaque libellé de carte est supprimé. À la place, un soulignement épais qui
suffit à dire que c'est cliquable et qui alourdit moins la grille.

### Une deuxième police, monospace

**JetBrains Mono**, récupérée via npm comme Inter, 42 Ko pour deux graisses. Elle est
réservée à ce qui est technique : libellés de section, chiffres clés, étiquettes de
technologies, numéros de semaine, valeurs de l'histogramme, badges.

Le texte courant reste en Inter. C'est ce contraste entre les deux qui donne au site son
air de chose faite par quelqu'un qui code, plutôt que par un modèle. Le rôle sous le nom
devient `// Développeur full-stack`, en monospace, comme un commentaire de code.

### Le nom occupe l'écran

De 3,2 rem au maximum à **8,5 rem**, avec un interlignage à 0,88 et un crénage négatif.
L'accroche ne contient rien d'autre, autant que le nom en profite.

### Numéros de section géants

Chaque section porte un `data-num` de 01 à 08, affiché en filigrane à droite, en monospace,
jusqu'à 22 rem. Posé en `::after` avec `attr()`, donc invisible pour les lecteurs d'écran :
c'est du repérage visuel, pas du contenu.

### Deux sections entièrement inversées

Stage et Ce site passent sur fond bleu nuit profond avec texte clair.

**C'est là que la discipline des variables paye.** La classe `.section--invert` ne restyle
rien : elle redéfinit `--bg`, `--text`, `--border` et les cinq teintes à l'intérieur de la
section. Tout suit automatiquement, cartes, bordures, textes secondaires, sans une seule
règle supplémentaire. Sans cette rigueur depuis le début, il aurait fallu réécrire chaque
composant.

Les teintes y sont remplacées par leurs versions éclaircies, sinon les couleurs pâles
seraient illisibles sur fond sombre.

### Grain

Un bruit fin sur toute la page, en SVG inline dans le CSS, donc aucune requête réseau.
En `position: fixed` et `pointer-events: none` : le navigateur le peint une fois et le
garde, ça ne coûte rien au défilement. À 3,5 % d'opacité, ça ne se voit pas
consciemment, mais ça casse l'aspect trop lisse.

### Contraste revérifié

Les sections inversées ont été mesurées séparément. Les 20 combinaisons testées sont
au-dessus de 4,5, la plus basse étant le texte tertiaire à 6,09.

## Mise à jour du 2026-08-10, couleur assumée et scroll corrigé pour de bon

### Le scroll qui accélère selon la section

Cause trouvée : `backdrop-filter` sur la barre du haut et sur la barre de contact.

Cette propriété oblige le navigateur à reflouter **tout ce qui passe derrière la barre**,
à chaque image. Et le coût dépend de ce qu'il y a dessous : flouter du texte est léger,
flouter des images est lourd. C'est exactement pour ça que la vitesse changeait d'une
section à l'autre, les sections Documents et Projets contenant des images.

Les deux `backdrop-filter` sont supprimés. Les fonds de barre passent de 88 à 97 %
d'opacité : visuellement c'est le même résultat, sans le coût.

Deuxième correction : le `mask-image` sur la grille animée plein écran. Masquer un élément
animé oblige à recomposer le masque à chaque image. Le fondu des bords est maintenant fait
par une couche fixe posée par-dessus, qui ne bouge jamais.

Il reste un `mask-image` sur le défilé de technologies. Celui-là est conservé : la bande
fait 40 px de haut et le masque lui-même ne bouge pas.

### La couleur, vraiment cette fois

La version précédente ne colorait que des détails, libellés et filets, ce qui ne se voyait
pas. Cette fois la couleur est sur les **fonds** :

- le fond de chaque section est teinté de sa couleur, en dégradé très dilué, au lieu de
  l'ancienne alternance blanc et gris ;
- les titres de section sont en dégradé vers la couleur du bloc ;
- les cartes de compétences, les chiffres clés, les preuves, les matières, les étapes de
  la frise, les tuiles de documents et de contact ont toutes un fond teinté, une bordure
  colorée et un liseré de 4 px ;
- les boutons pleins passent en dégradé bleu vers violet ;
- les étiquettes du défilé sont colorées en permanence, plus seulement au survol.

### Le contraste a été mesuré, pas estimé

J'ai calculé le ratio WCAG de chaque combinaison texte sur fond, dans les deux thèmes.

Le turquoise d'origine, `#0d9488`, ne passait pas : 3,38 sur son fond pâle et 3,74 pour du
blanc dessus, là où il faut 4,5. Remplacé par `#0f766e`, qui donne 4,95 et 5,47.

Après correction, les 25 combinaisons vérifiées sont au-dessus de 4,5. La plus basse est
l'ambre sur son fond pâle, à 4,57.

## Mise à jour du 2026-08-10, palette élargie

Une seule couleur d'accent, c'était sobre mais un peu pauvre. Cinq teintes ont été
ajoutées : bleu, turquoise, violet, ambre et rose, chacune avec une version de fond très
pâle pour poser du texte dessus sans perdre en contraste. Le thème sombre a ses propres
valeurs, éclaircies.

### Le mécanisme

Chaque composant lit une variable locale `--c`, qui vaut l'accent par défaut :

```css
.stat__value { color: var(--c, var(--accent)); }
```

Il suffit alors de poser `--c` sur un parent pour recolorer tout ce qu'il contient. Les
attributions se font au `:nth-child`, donc **sans toucher au HTML**.

### Où la couleur sert à quelque chose

Elle différencie, elle ne décore pas. Une matière, une famille de compétences ou une
section garde la même teinte d'un bout à l'autre du site :

| Bloc | Ce qui change |
|---|---|
| Sections | Le libellé et le filet du haut prennent la teinte de la section |
| Compétences | Une couleur par famille : développement, frameworks, outils, systèmes |
| Chiffres clés | Les quatre valeurs alternent, plus lisible qu'un bloc uniforme |
| Frise du stage | Les cinq mois vont du bleu au rose, ce qui donne un sens de lecture |
| Matières du BTS | Une couleur par domaine, reprise de la section correspondante |
| Cartes projet | Icône, lien et halo au survol suivent la teinte de la carte |
| Documents | Un liseré coloré par type de document |

### Ce qui n'a pas bougé

**L'accent reste la couleur des liens et des boutons.** C'est ce qui permet de continuer à
repérer d'un coup d'œil ce sur quoi on peut cliquer : si tout était coloré, on perdrait ce
repère.

Le fond animé reprend les nouvelles teintes et gagne une quatrième tache, ambre.

## Mise à jour du 2026-08-10, défilement corrigé et fond animé

### Le défilement qui saute, c'était un vrai défaut

Symptôme décrit par Dorian : « des fois on descend beaucoup plus vite ». Deux causes,
toutes les deux de mon fait.

**1. Une lecture de `scrollHeight` à chaque événement de défilement.** La barre de
progression calculait `document.documentElement.scrollHeight - window.innerHeight` dans
son gestionnaire. Lire `scrollHeight` force le navigateur à recalculer toute la mise en
page immédiatement, avant de rendre la main. À plusieurs dizaines d'événements par
seconde, des images sont perdues et le défilement devient irrégulier.

**2. Trois écouteurs de défilement séparés**, un par fonctionnalité, chacun faisant son
travail sans coordination.

Corrigé par un bloc unique, `scrollEngine` :

- un seul `addEventListener('scroll')` pour tout le site ;
- le travail est repoussé dans `requestAnimationFrame`, donc au plus une fois par image
  affichée, quel que soit le nombre d'événements ;
- la hauteur du document est mesurée au chargement, au redimensionnement et à la fin du
  chargement des images, jamais pendant le défilement.

**3. Le flou du fond de l'accroche.** `filter: blur(18px)` sur un élément de la taille de
l'écran, avec une animation infinie, oblige le navigateur à le repeindre en continu. Le
flou a été retiré : les `radial-gradient` sont déjà doux, la différence visuelle est
minime et le coût disparaît.

### Fond animé sur tout le site

Une couche fixe derrière le contenu, sur les 8 pages : trois taches de couleur qui
dérivent sur 24 à 30 secondes, et une grille fine qui glisse en boucle.

**La règle qui rend ça gratuit :** tout ce qui couvre l'écran n'anime que `transform`.
Cette propriété est traitée par la carte graphique, le processeur n'a rien à recalculer.
`will-change: transform` prévient le navigateur, et `contain: strict` isole la couche du
reste de la mise en page.

Deux animations font exception, `shine` sur le titre et `pulse-dot` sur la pastille : elles
touchent `background-position` et `box-shadow`, qui demandent un repaint. C'est assumé,
elles s'appliquent à un titre et à un point de 7 px.

Les sections sont devenues légèrement transparentes pour laisser voir le fond, mais à 86
et 90 % seulement : le contraste du texte ne doit pas bouger quand une couleur passe
derrière.

### Défilé de technologies

Une bande qui glisse en continu sous les compétences, en pause au survol. La liste est
écrite deux fois dans le HTML : quand la première moitié sort de l'écran, la seconde est
exactement à sa place de départ, donc la boucle est invisible. La copie est en
`aria-hidden` pour ne pas être lue deux fois par un lecteur d'écran.

## Mise à jour du 2026-08-10, police locale et effets renforcés

### Plus aucun appel à un service tiers

La police Inter est maintenant servie depuis `assets/fonts/`. Les fichiers viennent du
paquet npm `@fontsource/inter`, pas d'un téléchargement à la main, ce qui garantit la
bonne version et la licence qui va avec (SIL Open Font License, copiée dans le dossier).

Huit fichiers woff2, 248 Ko au total : quatre graisses en deux jeux de caractères. Le
`unicode-range` fait que le navigateur ne télécharge que ce dont la page a besoin, donc
en pratique il en charge la moitié. Les deux graisses les plus utilisées sont préchargées
dans le `<head>`.

`font-display: swap` affiche le texte immédiatement avec une police système, puis bascule
sur Inter. Sans ça, le texte reste invisible une fraction de seconde au premier
chargement.

Les mentions légales sont mises à jour : elles annoncent maintenant qu'aucun service tiers
n'est appelé, ce qui est vérifiable en ouvrant l'onglet réseau du navigateur.

### Effets ajoutés

| Effet | Comment |
|---|---|
| Halos qui dérivent | Animation de 26 s sur le pseudo-élément de l'accroche |
| Reflet sur le nom | `background-size: 220%` et position animée, aucune couche en plus |
| Pastille qui respire | `box-shadow` qui s'étend puis disparaît, 2,4 s |
| Soulignement du menu | `transform: scaleX` depuis le centre, pas de recalcul de mise en page |
| Reflet sur les boutons | Bande claire qui traverse au survol |
| Halo qui suit la souris | Deux variables CSS posées par le JavaScript, le CSS place le dégradé |
| Ombre de la barre du haut | Classe `is-stuck` dès qu'on quitte le haut de page |

**Le point de performance :** pour le halo qui suit le curseur, c'est l'opacité qui est
animée, pas le dégradé. Animer un `background` force le navigateur à repeindre en continu.
Les écritures passent par `requestAnimationFrame`, et l'effet est coupé sur les écrans
tactiles où il n'a aucun sens.

Tout est neutralisé sous `prefers-reduced-motion`, y compris le reflet du titre et le halo
au curseur.

## Mise à jour du 2026-08-10, habillage visuel

Demande : rendre le visuel plus marqué, sans toucher au contenu. Niveau retenu, marqué
mais maîtrisé. **Uniquement `css/style.css`, `js/main.js` et des classes ajoutées dans le
HTML.**

### Halos derrière l'accroche

Trois `radial-gradient` très diffus posés en pseudo-élément derrière le nom, avec un flou.
C'est du CSS pur, aucune image, donc zéro octet de plus au chargement. Les teintes
viennent de deux variables `--halo-2` et `--halo-3`, déclinées en clair et en sombre.

Deux précautions : `pointer-events: none` sur le pseudo-élément, sinon il intercepterait
les clics des boutons posés au-dessus, et un `@supports` de repli pour les navigateurs
sans `color-mix`.

### Nom en dégradé

`background-clip: text` peint le titre avec un dégradé. La couleur normale est déclarée
d'abord et `color: transparent` seulement dans un `@supports` : un navigateur qui ne
comprend pas la propriété affiche un titre noir lisible, pas un titre invisible.

### Cartes plus vivantes

Au survol : la carte se soulève un peu plus qu'avant, sa bordure prend la couleur d'accent
via `color-mix`, l'ombre se teinte, et l'image de couverture zoome de 6 % dans son cadre.
Le cadre étant en `overflow: hidden`, l'image ne déborde jamais.

Les icônes de matières pivotent légèrement, les chiffres clés passent en couleur d'accent,
et les puces de compétences réagissent au survol. Le projet mis en avant reçoit un liseré
dégradé en haut de carte.

### Barre de progression

Un trait de 3 px en haut de l'écran, en dégradé. Le JavaScript ne touche qu'à une variable
CSS `--p` entre 0 et 1, et le CSS s'en sert dans un `transform: scaleX()`. Pas de
recalcul de mise en page à chaque pixel de défilement.

### Apparitions en cascade

Nouvelle classe `.stagger` posée sur neuf grilles. Le JavaScript pose un retard croissant
dans une variable `--d` sur chaque enfant, plafonné à six : au-delà, une grille de dix
cartes met deux secondes à finir d'apparaître et on croit que la page rame.

### Ce qui n'a pas changé

`prefers-reduced-motion` reste respecté : tout est neutralisé, y compris le flou des halos.
Sans JavaScript, la page reste entièrement lisible, la cascade étant elle aussi sous la
classe `js`. Trois tests ajoutés, total 42.

## Mise à jour du 2026-08-10, carrousel refait, barre de contact, mentions légales

### Le carrousel ne marchait pas

L'ancienne version affichait plusieurs images côte à côte dans une bande défilante, et
calculait la position à partir de `scrollLeft`. Dans la carte du projet mis en avant, la
colonne était plus étroite que la bande : on voyait des morceaux d'images, elles
débordaient du cadre, et les flèches tombaient à côté.

Refait sur un principe volontairement bête : une fenêtre qui coupe ce qui dépasse, une
bande d'images larges de 100 % chacune, et un `translateX(-index * 100%)` au clic. Il est
donc impossible d'en voir deux à moitié. La hauteur est fixe et l'image en
`object-fit: contain` : une capture de 720x1280 ne peut plus faire déborder la carte.

Ajouté au passage : un compteur « 2 / 4 », les flèches du clavier, `aria-hidden` sur les
images masquées pour que la tabulation ne parte pas dessus. Sans JavaScript, la fenêtre
reste défilable à la main.

Six tests couvrent ce composant, dont le bouclage à la fin et le retour en arrière.

### Barre de contact permanente

Une barre fixe en bas des 8 pages : « Une alternance à proposer ? », puis trois boutons,
m'écrire, téléphoner, voir le CV. Le `body` a une marge basse de la même hauteur pour
qu'elle ne recouvre pas le pied de page, et le bouton retour en haut a été remonté.

Sur mobile, la phrase disparaît et les trois boutons prennent toute la largeur.

### Header aéré

Hauteur de 64 à 76 px, écart entre les groupes doublé, liens du menu un peu plus larges.
La hauteur est devenue une variable `--topbar-h` : les sections plein écran, le
`scroll-padding` et les ancres s'en servent, donc une seule valeur à changer.

### Mentions légales refaites

L'ancienne version datait du thème League of Legends et laissait un encadré « à compléter »
à la place de l'hébergeur. Réécrites avec les informations réelles :

- éditeur, avec e-mail et téléphone, et la raison pour laquelle l'adresse postale n'est pas
  publiée ;
- hébergeur GitHub Pages, avec l'adresse complète de GitHub, Inc. et le lien vers le dépôt ;
- données personnelles : aucun cookie, aucune mesure d'audience, seul le choix du thème est
  stocké localement. **Google Fonts est signalé** parce que le navigateur y envoie l'adresse
  IP du visiteur, ce qui doit être dit ;
- documents publiés : caviardage assumé, procédure de retrait pour toute personne citée ;
- propriété intellectuelle : SYNCRO appartient à SUITIME SAS, CRP-Assurance au Cabinet
  Romain Pachot, les fiches de cours s'appuient sur des supports d'IRIS MediaSchool ;
- crédits techniques et liens externes.

**Piste d'amélioration :** héberger la police Inter dans le dépôt supprimerait le seul
appel à un tiers, et la page pourrait alors annoncer zéro service externe.

## Mise à jour du 2026-08-10, ouverture des domaines et correctifs

### Le portfolio n'est plus limité au développement

Dorian ne se ferme pas aux systèmes, aux réseaux ni à la cybersécurité. Le site le disait
implicitement, il le dit maintenant clairement, à cinq endroits :

- le rôle sous le nom devient « Développeur full-stack, ouvert aux systèmes et réseaux » ;
- l'accroche ajoute une phrase sur les trois domaines ;
- la présentation gagne un paragraphe qui s'appuie sur un fait vérifiable, sa meilleure
  note de l'année est un 20 en administration systèmes et réseaux ;
- la preuve sur les résultats scolaires met ce 20 en avant plutôt que la moyenne seule ;
- les sections Compétences et Cours rappellent que le BTS couvre les deux versants.

Les métadonnées suivent, y compris le JSON-LD.

### Plus de date de rentrée affichée

« Septembre 2026 » disparaît du site. La formulation devient « je cherche une alternance
pour poursuivre mes études ». Afficher une date passée ou proche fait perdre des
opportunités, et Dorian a jusqu'à décembre.

L'objectif d'études est précisé : au minimum un bachelor DevOps, davantage si l'entreprise
le souhaite.

### La lettre de recommandation n'est pas un avis client

La carte de preuve disait « Un client satisfait ». C'est faux : Valentin Javelaud est le
responsable de stage de Dorian chez Suitime, pas un client. Corrigé en « Une lettre de
recommandation », avec la mention « écrite par mon responsable de stage ».

### La ligne e-mail sort de la grille

Le correctif précédent posait `grid-column: 1 / -1` sur la tuile e-mail, dans une grille
en `repeat(auto-fit, minmax(230px, 1fr))`. Cette combinaison donne un résultat imprévisible
selon la largeur : l'adresse continuait de passer à la ligne.

La ligne e-mail est maintenant un bloc `.mail-row` **au-dessus** de la grille, pas dedans.
Icône, libellé, adresse, puis le bouton poussé à droite, le tout sur une ligne. Plus aucune
interaction avec la grille. Sous 560 px, le bouton passe en dessous.

Deux tests ajoutés pour verrouiller ça : la ligne e-mail existe bien hors de la grille, et
la grille contient exactement trois tuiles. Total : 33 tests.

## Mise à jour du 2026-08-10, code rangé et commenté

Demande : retirer les tirets longs, ranger le code pour qu'il soit facile à reprendre,
commenter au maximum sans tournures artificielles ni emoji, et corriger le bloc contact.

### Le bloc e-mail tenait sur trois lignes

La tuile e-mail avait la même largeur que les autres, mais elle contient une adresse
longue et un bouton copier. Tout se cassait en trois lignes.

Elle occupe maintenant toute la largeur de la grille (`.contact__item--full`), l'adresse
est en `white-space: nowrap` et le bouton se pose au bout. Sous 560 px, l'adresse ne rentre
plus : le bouton repasse en dessous plutôt que de laisser le texte déborder.

### Tirets longs supprimés

Les 71 tirets longs du site et des documents ont été remplacés au cas par cas, par une
virgule, un deux-points, un point ou des parenthèses selon le contexte. Aucune
substitution automatique, chaque phrase a été relue.

### Code rangé

**`css/style.css`** : un en-tête explique où trouver quoi, avec un sommaire en neuf
parties et la convention de nommage. Les neuf parties sont balisées dans le fichier, dans
l'ordre de lecture d'une page. Le tout reste dans un seul fichier, mais on s'y repère.

**`js/main.js`** : l'en-tête liste les huit blocs et explique le principe à retenir, à
savoir que chaque bloc s'arrête tout seul s'il ne trouve pas son HTML, ce qui permet de
charger le même fichier sur les 8 pages. Les commentaires disent pourquoi une chose est
faite, pas ce que le code fait déjà lire.

**`index.html`** : chaque section a un commentaire encadré qui la nomme et signale les
pièges, par exemple qu'une nouvelle carte projet doit renseigner son `data-tech` sinon les
filtres l'ignorent.

**`README.md`** : nouveau tableau « Où toucher pour changer quoi », qui répond
directement à la question « je veux modifier ça, je vais où ».

## Mise à jour du 2026-08-10, accroche remise au propre

Retour de Dorian : « moi + SYNCRO à côté, c'est brouillon ». L'accroche mettait en
concurrence deux messages sur la même ligne, qui il est, et son projet phare, et le
lecteur ne savait pas où regarder en premier.

### Accroche sur une seule colonne, centrée

`.hero--center` passe la grille à deux colonnes en `flex` centré, avec un
`.hero__inner` limité à 660 px. Le nom, le rôle, l'accroche, les repères et les deux
boutons sont désormais seuls à l'écran d'arrivée. Un seul message : qui il est et ce
qu'il cherche.

Les autres sections restent alignées à gauche : l'accroche est la seule exception, ce qui
la distingue naturellement du reste sans effet particulier.

### SYNCRO devient le projet mis en avant

La carte n'est pas supprimée, elle est déplacée en tête de la section Projets, en pleine
largeur (`.promo--wide`) : le texte et les liens des stores à gauche, le carrousel à
droite sur toute la hauteur. Elle y gagne de la place, et c'est sa place logique, juste
avant les filtres et les autres projets.

**Le piège de la grille :** `.promo` a quatre enfants (en-tête, description, liens,
carrousel). En laissant le placement automatique, la description partait en colonne 2 et
se retrouvait sous le carrousel. Les trois premiers enfants sont donc explicitement en
colonne 1, et le carrousel occupe la colonne 2 sur trois lignes.

Sous 860 px, la carte repasse sur une seule colonne.

## Mise à jour du 2026-08-10, vraie présentation

Le site présentait des projets mais pas la personne : trois lignes de profil, puis
directement les compétences. Pour une recherche d'alternance, c'est ce qui manquait le
plus.

### Deux sections au lieu d'une

`#profil` devient **« Qui je suis »** et ne contient plus les compétences, qui partent
dans une section `#competences` dédiée. On passe de sept à huit sections sur l'accueil,
et l'alternance des fonds a été refaite en conséquence.

### Structure de la présentation

Choix retenu avec Dorian : parcours précédent évoqué brièvement, et un ton en deux
temps, un récit personnel puis des blocs factuels.

1. **Quatre paragraphes** en colonne large. Le premier explique d'où vient sa façon de
   travailler sans détailler les postes précédents. Le deuxième liste ce qu'il a livré.
   Le troisième raconte un problème concret, la connexion cassée en production qui
   bloquait la validation App Store, et le réflexe d'ajouter un test à chaque déploiement
   plutôt que de se contenter de réparer. Le quatrième dit ce qu'il cherche.
2. **Six repères** en colonne étroite (`.facts`) : formation, résultats, recherche,
   localisation, langues, certifications en cours.
3. **Quatre preuves** (`.proof`) sous le texte : une application installable, un client
   qui recommande, des résultats scolaires vérifiables, du code public. Chaque affirmation
   renvoie à quelque chose de consultable sur le site.

L'accroche du haut a aussi été durcie : « pas des exercices : une application publiée sur
l'App Store et Google Play, et deux sites web utilisés au quotidien par leurs clients ».

**Tout est vérifiable.** Les chiffres viennent du bulletin (15,55 contre 12,50, 17 en
anglais), de la lettre de recommandation et du dépôt Git. Rien n'a été inventé pour
enjoliver.

La palette passe à 26 entrées, les tests à 31.

## Mise à jour du 2026-08-10, agent IA retiré, section Cours créée

### Agent IA de candidature retiré

Supprimé de `index.html` et de `pages/projets-perso.html`, ainsi que des textes
d'introduction qui le mentionnaient. Il ne figurait déjà pas sur le CV du 28/07, donc
aucun PDF n'est à refaire.

### Les cours ont leur propre section

`pages/projets-cours.html` n'était qu'une carte perdue au milieu des projets personnels,
alors que le contenu n'a rien à voir : d'un côté des réalisations, de l'autre des travaux
scolaires. Nouvelle section `#cours` sur l'accueil, entre Projets et Documents, avec les
huit matières en tuiles compactes, leur nombre de travaux et une icône.

Chaque tuile pointe vers l'ancre de sa matière : des `id` ont été ajoutés aux huit
`<details>` de `projets-cours.html` (`matiere-developpement`, `matiere-systemes`, etc.).
Un clic depuis l'accueil ouvre donc la bonne matière directement.

### Conséquences

- Les projets passent de 5 à 3 cartes. Les filtres React et « Réseaux & systèmes »
  n'auraient plus rien renvoyé : ils sont retirés, le compteur « Tout » passe à 3.
- L'alternance des fonds a été refaite sur les sept sections pour rester régulière :
  gris, blanc, gris, blanc, gris, blanc, gris.
- « Cours » ajouté au menu des 8 pages et à la palette, qui passe à 25 entrées.
- Les tests passent de 26 à 28 : ajout d'une vérification des 8 matières et d'un contrôle
  que l'agent IA a bien disparu de la page.

## Aération du 2026-08-10, une section par écran

Demande : « rends le tout moins lourd, aère le site », en gardant le contenu intact.
**Aucun texte n'a été modifié, uniquement `css/style.css`.**

### Chaque section occupe la hauteur d'un écran

```css
.section {
  min-height: calc(100vh - 64px);   /* 64px = hauteur de la barre du haut */
  display: flex;
  align-items: center;              /* contenu centré verticalement */
  border-top: 1px solid var(--border);
}
```

C'est un `min-height`, pas un `height` : une section plus riche que l'écran, la section
Stage, avec sa frise et son histogramme, s'étire naturellement au lieu de déborder. Une
section courte se centre au milieu de l'écran plutôt que de coller au haut.

Le trait `border-top` remplace le `border-block` : chaque section est nettement séparée de
la précédente, sans doubler les traits entre deux sections voisines.

### Espaces augmentés

| | Avant | Après |
|---|---|---|
| Padding vertical des sections | 4,5 rem | 5,5 rem |
| Espace sous l'en-tête de section | 2,25 rem | 3 rem |
| Écart entre les cartes | 1,1 rem | 1,6 rem |
| Écart des documents | 1,1 rem | 1,6 rem |
| Colonnes de l'accroche | 3,5 rem | 4 rem |

Les ombres ont été adoucies (`--shadow` passe de deux couches à une, très légère) pour que
la séparation vienne des espaces et des traits, pas de la profondeur.

### Le point important : le mobile

Forcer `100vh` sur un petit écran créerait de grands vides autour de contenus courts. Sous
900 px, `min-height` retombe donc à `0` et chaque section reprend sa hauteur naturelle. La
frise passe à deux colonnes, puis une seule sous 520 px, et l'histogramme se resserre.

## Mise à jour du 2026-08-10 (fin), durée du projet corrigée et visuels

### La durée de SYNCRO était fausse

Le site laissait croire que l'application avait été faite en cinq semaines de stage. C'est
inexact, et c'était même contre-productif : un recruteur technique n'y croit pas.

Dates vérifiées dans `syncro/code/syncro/.git` :

| | |
|---|---|
| Premier commit | 2 avril 2026 |
| Dernier commit | 7 août 2026 |
| Total | 84 commits |
| Répartition | 6 en avril, 14 en mai, 9 en juin, **37 en juillet**, 18 en août |
| Stage | 6 juillet au 7 août, soit la phase la plus dense |

Aucun fichier antérieur au 2 avril dans `Boulot`, la piste « février ou mars » n'est pas
étayée. Le CV indique aussi « Avril 2026 ». C'est donc avril qui est retenu.

Formulation adoptée partout : le projet court d'avril à août 2026, **dont** cinq semaines
de stage à temps plein, période pendant laquelle l'application est passée en production.
Le titre de la section devient « SYNCRO, d'avril à août 2026 ». La statistique
« 5 semaines de développement » devient « 5 mois de développement ».

`pages/stage.html` gagne un encadré qui précise ce que couvre le journal : les cinq
semaines de stage, les bases ayant été posées depuis avril.

### Visuels ajoutés

- **Frise du projet** (`.timeline`) dans la section Stage : cinq colonnes d'avril à août,
  les deux colonnes de stage sur fond teinté avec un badge. C'est ce qui raconte la durée
  réelle d'un seul coup d'œil.
- **Histogramme d'activité** (`.chart`) : les 84 commits par mois, en barres CSS pures
  (aucune bibliothèque). Les barres poussent quand le bloc entre à l'écran, via un
  `IntersectionObserver` qui pose `.is-in`. Juillet et août sont en couleur d'accent.
  La hauteur passe par une variable `--h` en ligne, donc les valeurs restent lisibles
  dans le HTML.
- **Vignettes sur les cartes projet** : les cinq cartes ont maintenant un bandeau visuel
  de 132 px. Trois portent une vraie capture (SYNCRO, CRP-Assurance, Mission Orion), en
  WebP avec repli JPEG ; les deux autres un aplat teinté avec leur icône, pour rester
  homogènes. Badge « En production » sur les deux projets en ligne.

Sans JavaScript, les barres et les vignettes s'affichent normalement, la règle
`.js .bar__fill { height: 0 }` suit le même principe que `.reveal`.

## Correctifs du 2026-08-10 (tard), visibilité et robustesse

Retour de Dorian : « à quoi sert le Ctrl+K ? », « le bouton n'est pas beau », « je ne vois
pas de carrousel ni d'éléments qui servent de démo ». Trois problèmes réels derrière.

### Défaut corrigé : la page pouvait devenir invisible

`.reveal { opacity: 0 }` était appliqué dans tous les cas, et c'est le JavaScript qui
révélait les blocs. **Si `main.js` échouait ou était bloqué, 18 blocs de l'accueil
restaient invisibles**, dont le carrousel, les compétences, les projets et le contact.
C'est probablement ce que Dorian a vu.

Le script inline du `<head>` pose maintenant une classe `js` sur `<html>`, et la règle est
devenue `.js .reveal { opacity: 0 }`. Sans JavaScript, la page s'affiche entièrement,
simplement sans animation. C'est le principe de l'amélioration progressive : la
fonctionnalité de confort ne doit jamais pouvoir casser le contenu.

### Le Ctrl+K était invisible

Un raccourci clavier ne se découvre pas, et un recruteur RH ne le connaît pas. Le bouton
`icon-btn kbd-btn` avec ses deux touches empilées est remplacé par un **faux champ de
recherche** (`.search-btn`) : loupe, texte « Rechercher », et la mention `Ctrl K`
discrète à droite. C'est un `<button>`, pas un `<input>`, il en a seulement l'apparence,
pour que la fonction se comprenne sans connaître le raccourci.

### Les démos n'étaient pas visibles

- Le **carrousel** était en bas de la section Projets, après cinq cartes. Il remonte dans
  la carte SYNCRO de l'accroche, visible sans défiler, en version compacte
  (`.carousel--compact`, diapositives de 118 px).
- Nouvelle section **« Ce site est aussi un projet »** (`#ce-site`) avant le contact :
  quatre chiffres, une colonne « ce que vous pouvez essayer » qui invite explicitement à
  tester le thème, la recherche, les filtres et le carrousel, une colonne sur les
  décisions techniques, et un lien vers le dépôt GitHub.

Le but est de transformer un travail invisible en argument lisible : sans cette section,
personne ne remarque qu'il n'y a aucune dépendance ni que les images sont optimisées.

La palette passe à 24 entrées (ajout de « Ce site » et du dépôt GitHub). Les 26 tests
passent toujours.

## Mise à jour du 2026-08-10 (soir), interactions et finitions

Le site devient lui-même une démonstration de développement, sans casser le design sobre.

### Thème clair / sombre

Le thème sombre est un simple bloc `[data-theme="dark"]` qui redéfinit les variables de
`:root`. Aucune règle en double, aucune couleur écrite en dur, tout ce qui l'était
(`#fff` des boutons, le vert du badge « En production », le fond de la barre du haut) est
passé en variable au préalable.

**Le point délicat, c'est le flash blanc.** Si le thème est appliqué par `main.js`, qui se
charge en fin de page, un utilisateur en mode sombre voit un éclair blanc à chaque
navigation. Un petit script inline est donc placé dans le `<head>` de chacune des 8 pages,
avant la feuille de style : il lit `localStorage`, retombe sur `prefers-color-scheme` et
pose l'attribut avant le premier rendu. Le `try/catch` est nécessaire, `localStorage`
lève une exception en navigation privée sur certains navigateurs.

Tant que l'utilisateur n'a pas cliqué sur le bouton, le site suit le réglage du système,
même s'il change pendant la visite.

### Palette de commandes (Ctrl+K)

22 entrées : sections, pages, PDF, liens externes, contact. La recherche retire les
accents des deux côtés (`normalize('NFD')`), donc « recommandation » se trouve sans
accent et inversement. Navigation aux flèches, `Entrée` pour ouvrir, `Échap` pour fermer,
et le focus revient sur l'élément d'origine à la fermeture.

L'attribut `data-base` sur le conteneur vaut `""` sur l'accueil et `"../"` sur les pages
secondaires : c'est ce qui permet au même fichier JavaScript de construire des liens
corrects depuis les deux niveaux.

### Filtres, carrousel, micro-interactions

- **Filtres** : chaque carte porte `data-tech="flutter|nextjs|sql"`. Le filtrage est une
  simple bascule de classe, sans reconstruction du DOM.
- **Carrousel** : `scroll-snap` en CSS pour le défilement, le JavaScript ne sert qu'aux
  pastilles et aux flèches. Il reste utilisable au doigt et au clavier sans JavaScript.
- **Compteurs animés** : la valeur finale est écrite dans le HTML, l'animation ne fait que
  la remplacer temporairement. Sans JavaScript, le bon chiffre s'affiche quand même.
- **Copie de l'e-mail** : `navigator.clipboard` avec un repli `execCommand` pour les
  navigateurs anciens ou les contextes non sécurisés.
- `prefers-reduced-motion` est respecté partout : apparitions désactivées, défilements
  instantanés, compteurs non animés.

### SEO et partage

- **JSON-LD** `schema.org/Person` sur l'accueil : poste, e-mail, ville, école,
  technologies, LinkedIn, recherche d'alternance.
- **Open Graph** + image `assets/meta/og-image.png` en 1200×630, générée avec Pillow.
  Un lien partagé sur LinkedIn affiche maintenant une vraie carte.
- **Favicon** en SVG avec repli PNG 32 et 180 px.
- `sitemap.xml` (8 URL) et `robots.txt` à la racine.

### Images

Vignettes dédiées dans `assets/meta/`, en WebP avec repli JPEG via `<picture>`, et
`width`/`height` déclarés pour éviter les sauts de mise en page :

| Document | Avant | Après (WebP) |
|---|---|---|
| CV | 470 Ko | 24 Ko |
| Bulletin | 686 Ko | 14 Ko |
| Recommandation | 134 Ko | 13 Ko |
| Lettre de motivation | 420 Ko | 20 Ko |

Les images pleine taille restent utilisées sur les pages de détail.

### Tests

`tests/dom.test.js` charge les vraies pages dans jsdom et vérifie 26 comportements
(thème, palette, filtres, carrousel, copie, chemins relatifs depuis `pages/`).

```powershell
npm install jsdom
node tests/dom.test.js
```

`node_modules/` et `package-lock.json` sont dans le `.gitignore`.

### Le mini-jeu

`pages/mini-jeu.html` charge le build pygbag dans une `iframe` : il est indépendant du
reste du site et n'a pas été touché. Vérifié après la refonte, il tourne toujours.

## Mise à jour du 2026-08-10, refonte complète du design

Le thème « Hextech » (bleu nuit, or, losanges, ombres dures) est remplacé par un design
clair et sobre, et l'accueil devient une page unique qui déroule.

### Design

`css/style.css` a été entièrement réécrit. Toutes les variables sont dans `:root` :

| Rôle | Variable | Valeur |
|---|---|---|
| Fond | `--bg` / `--bg-soft` / `--bg-tint` | `#ffffff` / `#f7f8fa` / `#eef3ff` |
| Texte | `--text` / `--text-2` / `--text-3` | `#0f1419` / `#4a5568` / `#78849b` |
| Accent | `--accent` / `--accent-dark` | `#1d4ed8` / `#1740ae` |
| Traits | `--border` / `--border-2` | `#e4e8ee` / `#cdd5e0` |

Une seule police, **Inter** (Rajdhani supprimée). Une seule couleur d'accent. Les
sections alternent `--bg` et `--bg-soft` pour donner du rythme sans ajouter de couleur.
Ombres très légères, bordures fines, coins à 8-14 px.

### Structure

`index.html` est désormais une page unique avec cinq sections ancrées :
accroche, `#profil`, `#stage`, `#projets`, `#documents`, `#contact`. L'accroche est en
deux colonnes, pitch à gauche, carte SYNCRO avec les liens des stores à droite.

Les pages secondaires restent pour le contenu long : `stage.html`, `documents.html`,
`cv.html`, `projets-perso.html`, `projets-cours.html`, `mini-jeu.html`,
`mentions-legales.html`. Leur menu pointe vers les ancres de l'accueil
(`../index.html#stage`, etc.), identique sur les 7 pages.

### JavaScript

`js/main.js` réécrit : menu repliable sous 760 px (au lieu de 720), plus un
`IntersectionObserver` qui surligne dans le menu la section en cours de lecture
(classe `.is-active`). Le script sort proprement si les ancres n'existent pas, donc il
ne fait rien sur les pages secondaires.

### Vérifications passées

- 0 lien cassé et 0 ancre cassée sur les 8 pages
- HTML équilibré sur les 8 pages (parseur `html.parser`)
- 0 classe utilisée sans style correspondant dans le CSS
- CSS validé par WeasyPrint : aucune erreur de syntaxe
- Rendu contrôlé visuellement

### Points à savoir

- `.hero__actions` ne servait qu'à l'accroche mais avait été réutilisée dans la section
  Stage. Une classe `.actions` a été créée pour ce cas, les deux partagent le même
  style, mais seule `.hero__actions` est masquée à l'impression.
- `.card__icon--warm` et `.card__icon--violet` ont été retirées du HTML : dans le
  nouveau design toutes les icônes de cartes partagent la même teinte d'accent.
- Une feuille `@media print` masque le menu, le pied de page et les boutons de
  l'accroche, pour qu'un recruteur puisse imprimer la page proprement.

## Mise à jour du 2026-08-09

## Mise à jour du 2026-08-09, page Stage

Nouvelle page `pages/stage.html`, écrite à partir de `syncro/suivi/Suivi_stage_Syncro_journal.docx`
(186 lignes, jour par jour sur 5 semaines).

### Le journal brut n'est pas publiable tel quel

Ce n'est **pas** le document d'origine qui est en ligne, mais une réécriture. Le journal
contient des éléments qui appartiennent à Suitime, pas à Dorian :

| Élément | Où | Traitement |
|---|---|---|
| IP du serveur de production | `Suivi_stage_Syncro_semaine.docx` | non repris |
| Identifiant du projet Firebase | idem | non repris |
| Adresses e-mail du staff | journal, semaine 1 | non repris |
| Chemin du back-office `/admin` | les deux | remplacé par « back-office réservé à l'équipe » |
| Détail de failles corrigées en production | journal, semaines 2 et 3 | reformulé sans le mode opératoire |
| Nom de l'hébergeur | journal, semaine 1 | remplacé par « serveur Linux » |
| Écran d'abonnement et paliers tarifaires | journal, semaine 5 | anonymisé, feuille de route non annoncée |
| Nouveau mode de fonctionnement des groupes | journal, semaine 4 | décrit comme « une évolution importante », sans le nommer |

Ce qui est conservé : la méthode de travail, les diagnostics, les chiffres vérifiables
(53 routes migrées, 13 écrans maquettés, 259 lignes supprimées, 62 → 26 zones tactiles
sans libellé, 100 combinaisons testées) et une section « Ce que j'en retiens ».

**Un script d'audit** a été passé sur les 8 pages avant publication, cherchant : IP
publiques, e-mails non personnels, identifiants de projet, chemins d'administration,
mots-clés de failles, tarifs, identifiants techniques. Seuls deux résultats, tous deux
inoffensifs et laissés en place :

- `projets-cours.html` : plages RFC 1918 (`10.1.67.0/24` etc.) d'un TP GNS3, et le mot
  « faille » à propos d'une clé de contrôle ISBN en mathématiques ;
- `documents.html` : le nom de Valentin Javelaud, qui figure de toute façon sur la lettre
  de recommandation publiée.

### Autres changements

- « Stage » ajouté au menu des 8 pages et carte sur l'accueil.
- `documents.html` : la phrase « Lettre signée par Valentin Javelaud » était incohérente
  avec la signature retirée juste en dessous, reformulée, avec un lien vers la page Stage.
- CSS : frise `.weeks` / `.week` ajoutée avant l'encart d'actualité.

## Mise à jour du 2026-08-07

## Mise à jour du 2026-08-07, CV neutre, page Documents, SYNCRO en production

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

1. **Lettre de recommandation Suitime** (20/07/2026, Valentin Javelaud) :
   `assets/recommandation/`
2. **Bulletin de 1re année** (IRIS MediaSchool, 22/06/2026, moyenne 15,55 contre 12,50
   pour la promotion), `assets/bulletin/`, avec 4 chiffres clés en encadré et
   l'appréciation générale en citation
3. **Lettre de motivation**, déplacée depuis `cv.html`, qui renvoie maintenant vers
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
le PDF a été reconstruit depuis le PNG masqué avec `img2pdf`, c'était déjà un scan, il
n'y avait donc pas de couche texte à perdre.

**Les originaux non caviardés** restent dans `alternance/` :
`Bulletin 1ère année_DP.pdf` et `LETTRE RECO DORIAN.pdf`. Ce sont eux à envoyer aux
recruteurs qui les demandent. Le nom des enseignants a été conservé sur le bulletin
(ce sont des mentions professionnelles, pas des données privées).

Les deux pages du site le mentionnent explicitement sous chaque document, pour qu'un
recruteur ne prenne pas l'absence de signature pour un document douteux.

La page est ajoutée au nav des 6 pages et une carte « Documents » a été ajoutée sur
l'accueil.

### SYNCRO, publiée sur les deux stores

`pages/projets-perso.html` : la carte pointait vers un APK de 74 Mo
(`assets/syncro/app-release.apk`), qui n'était probablement jamais monté sur GitHub
(limite de 25 Mo via l'interface web). Remplacé par une ancre vers une nouvelle section
détaillée `#syncro` en bas de page, avec trois boutons vérifiés en ligne le 07/08 :

- App Store, https://apps.apple.com/fr/app/syncro/id6787898930
- Google Play, https://play.google.com/store/apps/details?id=fr.appsyncro.mobile
- Site vitrine, https://appsyncro.fr

Quatre captures d'écran ajoutées dans `assets/syncro/screens/`, redimensionnées à 720 px
de large depuis `syncro/medias/image 1-4.jpg`.

L'APK reste dans le dossier mais n'est plus lié nulle part, il peut être supprimé.

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
distant sont maintenant identiques, plus rien à déplacer avant un push. Les liens du
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
navigateur, ou nom d'utilisateur + *personal access token* comme mot de passe, le mot de
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
web GitHub, ce qui explique qu'il n'ait jamais été en ligne et que le bouton
« Télécharger l'APK » renvoyait un 404, et devenu inutile maintenant que l'app est sur
les stores).

Le commit ajoute aussi `README.md` et `PROGRESS.md` au dépôt, qui n'y étaient pas.

## Mise à jour du 2026-07-01 (suite), fiche GNS3 FortiGate HA

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
  (obligatoire légalement, LCEN art. 6-III), repéré par un encart `.callout`
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

**Phase 2, Contenu intégré, thème PIXEL/ESPACE validé, attente de 2 livrables de Dorian.**

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
| pages/cv.html            | Code prêt, attend `gradient/assets/cv/cv.png`              |
| pages/projets-cours.html | Placeholder (projets BTS publiés au fur et à mesure)        |
| pages/projets-perso.html | Cartes terminées, attend build Flutter Web dans `gradient/assets/syncro/web/` |
| pages/mini-jeu.html      | **Mission Orion intégré** : build pygbag jouable dans le cadre arcade |

## Actions Dorian, à faire

### 1. Générer l'image du CV, `cv.png`

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

### 2. Générer la démo SYNCRO, build Flutter Web

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

### 3. Mission Orion, FAIT

Le build pygbag est en place dans `gradient/assets/mission-orion/web/`,
intégré via iframe dans `mini-jeu.html`, dans un cadre arcade 16:9 jaune.

**Pour ré-actualiser le build après une modification du jeu** :
1. Cd dans le projet Mission Orion
2. `pygbag --build .` (génère build/web/)
3. `Copy-Item -Path "C:\Users\doria\Desktop\Rangement\Boulot\Mission Orion\build\web\*" -Destination "C:\Users\doria\Desktop\Rangement\Boulot\portefollio\gradient\assets\mission-orion\web\" -Recurse -Force`
4. **IMPORTANT** : réappliquer les fixes cosmétiques dans index.html de pygbag
   (sinon les bandes grises + barres de chargement reviennent). Voir le bloc
   `<style>` modifié, c'est ce qui rend le fond noir et masque le terminal.

Test : ouvrir la page via Live Server VS Code (pas file://) car pygbag CORS.

## Ce qui est désormais en place

- **Identité** : Dorian Pachot, BTS SIO SLAM 2025-2027, IRIS Mediaschool
- **Logo** : canard pixel jaune dans le brand mark (`gradient/assets/duck.svg`)
- **CV (cv.html)** : balise `<img>` qui charge `cv.png` + bouton "Télécharger le PDF"
- **Projets perso** :
  - Carte CRP-Assurance.com, bouton vers https://crp-assurance.com
  - Carte SYNCRO + section "Démonstration interactive" avec **device-frame** (cadre téléphone CSS) contenant l'iframe Flutter Web
- **Footer** : nom + LinkedIn + email (présent sur les 5 pages)
- **LinkedIn** : https://www.linkedin.com/in/dorian-pachot-81299930a/

## Décisions de conception finales

- **Thème pixel art / espace rétro** (inspiré du jeu Mission Orion)
- Palette spatiale : `#07091c → #11164a → #1f1340` (dégradé bleu nuit → mauve nébuleuse)
- Accents arcade : `#ffe66d` jaune doré (principal), `#5dccfc` cyan, `#ff6ec7` magenta
- Champ d'étoiles tilable (`gradient/assets/stars.svg`), 1-2 px de blanc/jaune/cyan
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
4. Ouvrir http://localhost:8000/gradient/, c'est la version live
5. Vérifier les 3 livrables Dorian listés ci-dessus
