# Guide des modifications (pour l'oral)

Chaque fiche dit **quel fichier ouvrir**, **quoi changer**, et **comment vérifier**.
Dans VS Code : `Ctrl+P` pour ouvrir un fichier par son nom, `Ctrl+F` pour chercher dans le
fichier, `Ctrl+Maj+F` pour chercher dans tout le dossier.

Sommaire : [Avant l'oral](#avant-loral) · [Le cycle](#le-cycle-modifier-voir-publier) ·
[Textes](#1-textes) · [Projets, TP, veille](#2-projets-tp-veille-documents) ·
[Mise en page](#3-mise-en-page-et-style) · [Twig et Symfony](#4-twig-et-symfony) ·
[Présentation](#5-présentation-de-loral) · [En cas de problème](#6-en-cas-de-problème)

---

## Avant l'oral

À faire **sur le PC de l'oral**, quelques jours avant :

- [ ] **PHP 8.2 ou plus** : `winget install PHP.PHP.8.3` (ou le zip de windows.php.net, ajouté au PATH). Vérifier : `php -v`.
- [ ] **Composer** : installeur sur getcomposer.org. Vérifier : `composer -V`.
- [ ] Dans le dossier `app` : `composer install` (télécharge Symfony dans `app/vendor`, il faut internet).
- [ ] Lancer le serveur une fois : `php -S 127.0.0.1:8000 -t .. public/index.php`, ouvrir http://127.0.0.1:8000.
- [ ] Lancer l'export une fois : `php bin/console app:export` → doit finir par « Toutes les pages sont à jour ».
- [ ] **Git** : `git pull` pour avoir la dernière version ; vérifier que `git push` marche (identifiants GitHub).
- [ ] **Node** (pour les tests, facultatif) : `npm install` puis `node tests/dom.test.js`.
- [ ] Ouvrir à l'avance : le site en ligne, `pages/annexes.html`, VS Code sur le dossier, un terminal dans `app/`.
- [ ] Passer le site en **mode clair** (bouton soleil) si la salle a un vidéoprojecteur.
- [ ] Copier sur une clé USB : le PowerPoint, les PDF des annexes (dossier `assets/annexes/`), le CV.
- [ ] Prévoir le partage de connexion du téléphone si le Wi-Fi de la salle ne marche pas.

Si PHP n'est pas installable sur le PC de l'oral : on peut quand même montrer une modification en
changeant directement `index.html` ou `pages/*.html` (ce sont des fichiers HTML normaux) ; il
faut alors dire que la bonne méthode est de modifier le YAML ou le Twig puis de relancer l'export.

---

## Le cycle : modifier, voir, publier

```powershell
cd app
php -S 127.0.0.1:8000 -t .. public/index.php    # 1. voir le site en direct (laisser tourner)
# 2. modifier un fichier YAML ou Twig, puis recharger la page dans le navigateur (F5)
php bin/console app:export                       # 3. régénérer les pages HTML
cd ..
git add -A
git commit -m "Ce que j'ai changé"               # 4. enregistrer
git push                                          # 5. en ligne en 1 à 2 minutes (GitHub Pages)
```

**À dire au jury :** « Symfony calcule les pages ; l'export les enregistre en HTML, parce que
GitHub Pages ne sait servir que des fichiers. En ligne, aucun PHP ne tourne. »

---

## 1. Textes

### Changer un texte de l'accueil
| Texte | Fichier |
|---|---|
| Bonjour, titre, paragraphes, carte de profil | `app/contenu/profil.yaml` → `presentation`, `carte_profil` |
| Bandeau qui défile | `app/contenu/profil.yaml` → `bandeau` |
| Contact (e-mail, téléphone, liens) | `app/contenu/profil.yaml` → en haut, puis `contact` |
| Pied de page | `app/contenu/profil.yaml` → `mention_pied` |
| Phrase sous un titre de section | `app/templates/accueil/_<section>.html.twig`, dans `<twig:EnTeteSection>` |

### Corriger une faute partout
`Ctrl+Maj+F`, taper le mot, remplacer dans les fichiers `app/contenu/` et `app/templates/`,
puis relancer l'export (les pages HTML se mettent à jour toutes seules).

### Le piège du YAML : l'apostrophe
Entre apostrophes, une apostrophe se **double** :
```yaml
titre: 'L''application de gestion'     # juste
titre: L'application de gestion        # juste aussi (pas d'apostrophe autour)
titre: 'L'application de gestion'      # FAUX : l'export plante
```
Le texte commence par un caractère spécial (`:`, `#`, `[`, `'`) ? Le mettre entre apostrophes.

---

## 2. Projets, TP, veille, documents

### Ajouter un projet
1. `app/contenu/projets.yaml` : copier un bloc entier, de `- slug:` jusqu'au `- slug:` suivant.
2. Changer `slug` (nom de la page : `slug: mon-projet` → `pages/mon-projet.html`), `nom`, `couleur`, les textes.
3. Image : déposer `assets/meta/shot-mon-projet.jpg` et `.webp`, et l'indiquer dans `media.image` et `accueil.image` (sans l'extension).
4. Export. La carte de l'accueil, la carte de « Mes réalisations », la page du projet et la recherche sont créées toutes seules.

### Changer l'ordre des projets
L'ordre des blocs dans `projets.yaml` = l'ordre d'affichage.

### Ajouter une ligne à la fiche d'un projet (encadré à droite)
`projets.yaml`, dans le projet, sous `fiche:` :
```yaml
  - libelle: Équipe
    valeur: 2 personnes
```

### Ajouter une étiquette (techno)
`projets.yaml` → `technos:` (page du projet) ou `accueil.tags:` (carte de l'accueil) : une ligne `- Docker`.

### Ajouter un bouton sur la page d'un projet
`projets.yaml`, sous `liens:` :
```yaml
  - texte: Voir le code
    url: https://github.com/...
    style: secondaire        # principal = rouge plein, secondaire = contour
```

### Ajouter une partie sur la page d'un projet
`projets.yaml`, sous `sections:` (une partie = `id`, `titre`, puis `paragraphes` et/ou `liste`) :
```yaml
  - id: tests
    titre: Les tests
    paragraphes:
    - Un test de connexion à chaque mise en ligne.
    liste:
    - Premier point.
```
Le sommaire de droite se met à jour tout seul.

### Ajouter un TP
`app/contenu/cours.yaml` : copier un bloc `- id: tp...` dans la bonne année et la bonne matière.
Avec une clé `accueil:`, le TP a aussi sa carte sur l'accueil (deuxième année). Le compteur
« 3 travaux » des tuiles de première année se calcule tout seul. Le compte rendu PDF va dans
`assets/fiches-cours/<matière>/` et se met dans `fichiers:` ; il apparaît aussi dans les annexes.

### Ajouter une étape au parcours
`app/contenu/parcours.yaml` : copier un bloc. `type:` donne la couleur du point
(`sport` orange, `tech` rouge, `work` gris, `now` rouge lumineux).

### Ajouter un article de veille
`app/contenu/veille.yaml` :
- un lien lu : copier un bloc sous `articles_reperes:` (`date_source`, `titre`, `url`) ;
- un article : copier un bloc dans une rangée de `articles:` (2 ou 3 par rangée, la grille s'adapte) ;
- l'article principal : `a_la_une:` ;
- la date « Mise à jour le » : `mise_a_jour:`.

### Ajouter un document ou une annexe
- Section « Mon dossier » de l'accueil : `app/contenu/documents.yaml` (PDF + vignette).
- Page Annexes : déposer le fichier dans `assets/annexes/`, puis copier une ligne dans `app/contenu/annexes.yaml`.

### Changer une image
Remplacer le fichier **en gardant le même nom** (et le `.webp` à côté du `.jpg` quand il existe) :
photo `assets/meta/portrait.jpg/.webp`, captures SYNCRO `assets/syncro/screens/screen-1.jpg`…,
images des projets `assets/meta/shot-*.jpg/.webp`. Pas besoin de toucher au code.

---

## 3. Mise en page et style

### Déplacer ou masquer une section de l'accueil
`app/templates/accueil/index.html.twig` : une ligne `{% include %}` par section, dans l'ordre.
Déplacer la ligne pour déplacer la section ; pour la masquer, la mettre en commentaire :
```twig
{# {% include 'accueil/_outils.html.twig' %} #}
```
Penser à retirer le lien du menu dans `profil.yaml` (`menu_accueil`, `menu_accueil_mobile`, `reperes`).

### Ajouter un lien dans le menu
`app/contenu/profil.yaml` : `menu_pages` (pages secondaires, `cible: pages/xxx.html`) et
`menu_accueil` (accueil, `ancre: id-de-la-section`).

### Changer la couleur rouge
1. `app/templates/base.html.twig` → `--color-blood: #EF4444;` (classes Tailwind `text-blood`, `bg-blood`…).
2. `css/site.css` → `Ctrl+H`, remplacer `#EF4444` par la nouvelle couleur (et `#DC2626` pour le mode clair).

### Changer une police
`app/templates/base.html.twig` : le lien Google Fonts (ajouter la police) et `--font-display`
(titres) ou `--font-sans` (texte).

### Ouvrir le site en mode clair par défaut
`app/templates/base.html.twig`, dans le petit script du `<head>` : remplacer
`if(t==='light')` par `if(t!=='dark')`.

### Changer la taille d'un titre, une marge, une couleur ponctuelle
Ce sont des classes **Tailwind** dans le Twig : `text-4xl` (taille), `mt-4` (marge en haut),
`text-ash` (gris), `font-bold`… Exemple : dans `components/EnTeteSection.html.twig`,
`text-4xl md:text-5xl` → `text-3xl md:text-4xl` pour des titres de section plus petits.

### Où est le style d'un élément ?
Clic droit → **Inspecter** dans le navigateur, lire la classe, puis `Ctrl+Maj+F` sur cette classe :
dans `css/site.css` si c'est une classe maison (`panel`, `btn`, `tag`, `annexe`…), sinon c'est Tailwind.

---

## 4. Twig et Symfony

### Afficher le nombre de projets automatiquement
`app/templates/accueil/_realisations.html.twig`, remplacer « Cinq projets » par :
```twig
{{ projets|length }} projets : ...
```

### Créer un composant (exemple : une pastille « Nouveau »)
1. Créer `app/templates/components/Badge.html.twig` :
```twig
{# Composant Badge : une petite pastille. Utilisation : <twig:Badge texte="Nouveau" /> #}
{% props texte %}
<span class="rounded-md bg-blood px-2 py-1 text-[11px] font-semibold text-white">{{ texte }}</span>
```
2. L'utiliser, par exemple dans `components/CarteProjetAccueil.html.twig`, à côté du nom :
```twig
{% if a.nouveau ?? false %}<twig:Badge texte="Nouveau" />{% endif %}
```
3. Dans `projets.yaml`, sous `accueil:` du projet : `nouveau: true`.

### Ajouter une page
1. `app/src/Controller/PageController.php` : copier la méthode `cv()` :
```php
#[Route('/pages/competences.html', name: 'competences')]
public function competences(): Response
{
    return $this->render('pages/competences.html.twig');
}
```
2. Créer `app/templates/pages/competences.html.twig` en copiant `pages/cv.html.twig` (garder
   `{% extends 'base.html.twig' %}` et les blocs `titre`, `description`, `chemin`, `contenu`).
3. Lien dans le menu : `profil.yaml` → `menu_pages`.
4. Export : la page est exportée toute seule (la commande lit toutes les routes).

### Passer une donnée du YAML à une page
Dans la méthode du contrôleur : `'stage' => $this->contenu->get('stage')`, puis dans le Twig
`{{ stage.titre }}` ou `{% for s in stage.semaines %}…{% endfor %}`.

### Notions à savoir expliquer
| Notion | Où la montrer |
|---|---|
| Route | `#[Route('/pages/cv.html')]` dans `PageController.php` |
| Contrôleur | `PageController` : une méthode = une page |
| Service et injection | `Contenu` (lit les YAML), injecté dans le constructeur du contrôleur |
| Commande console | `ExportCommand` : `php bin/console app:export` |
| Héritage Twig | `{% extends 'base.html.twig' %}` et les `{% block %}` |
| Composant Twig | `<twig:Bouton>`, `{% props %}` en haut de chaque composant |
| Composant avec classe PHP | `EnTete` : `src/Twig/Components/EnTete.php` + son gabarit |
| Extension Twig | `LienExtension` : la fonction `lien()` qui rend les liens relatifs |
| Filtres Twig | `|length`, `|join(', ')`, `|lower`, `|json_encode`, `|raw` |
| Échappement | Twig échappe tout par défaut ; `|raw` seulement sur nos propres textes |

---

## 5. Présentation de l'oral

- **Dans le navigateur** : `pages/presentation.html` (touche **P** depuis le site). Une diapo = un
  bloc `<section class="slide">`, avec un commentaire `<!-- 5. Le besoin -->` au-dessus. Les notes
  sont dans `data-notes="..."`. Touches : flèches, **N** notes, **F** plein écran, **L** clair/sombre.
- **PowerPoint** : `assets/presentation/Presentation_E5_Dorian_Pachot.pptx`, se modifie dans PowerPoint ;
  les notes sont sous chaque diapo. Penser à garder les deux versions identiques.
- Changer un point coché du tableau de synthèse : diapo 3 (`<table class="grille">`), puis la diapo 3
  du PowerPoint, puis `assets/annexes/tableau-de-synthese.pdf`.

---

## 6. En cas de problème

| Symptôme | Cause probable | Solution |
|---|---|---|
| L'export s'arrête sur une erreur YAML | Apostrophe non doublée, tabulation, mauvaise indentation | Lire la ligne indiquée ; indenter avec des espaces |
| `Variable "xxx" does not exist` | Nom de clé mal écrit dans le Twig ou le YAML | Comparer le nom dans les deux fichiers |
| `Unknown component "Xxx"` | Fichier du composant mal nommé | `templates/components/Xxx.html.twig`, majuscule comprise |
| La page ne change pas | Cache du navigateur | `Ctrl+F5` |
| Le site en ligne ne change pas | Pas de push, ou GitHub Pages pas encore à jour | `git status`, `git push`, attendre 1 à 2 minutes |
| J'ai cassé quelque chose | — | `git checkout -- chemin/du/fichier` (annule les changements du fichier), ou `git revert HEAD` (annule le dernier commit) |
| Les tests échouent | Une page ou un lien a changé | Lire le test en échec dans `tests/dom.test.js` |
