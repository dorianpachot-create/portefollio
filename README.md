# Portfolio BTS SIO, Dorian Pachot

Site personnel réalisé dans le cadre du BTS SIO option SLAM à IRIS MediaSchool Rouen.
En ligne sur https://dorianpachot-create.github.io/portefollio/

> **Pour l'oral :** les modifications qu'on peut me demander sont expliquées pas à pas dans
> [`GUIDE-MODIFICATIONS.md`](GUIDE-MODIFICATIONS.md) (avec la checklist « avant l'oral »).

## Comment le site est construit

Le code source est une application **Symfony 7.4** (dossier `app/`), organisée en
**composants Twig** (Symfony UX Twig Component). Les textes sont séparés du code,
dans des fichiers **YAML** (`app/contenu/`).

GitHub Pages ne sait pas exécuter de PHP. Une commande Symfony, `app:export`,
calcule donc chaque page et l'enregistre en HTML à la racine du dépôt
(`index.html`, `pages/*.html`). Ce sont ces fichiers que GitHub Pages publie.

```
Fichier YAML (texte)  +  Gabarit Twig (mise en page)  +  Composants (briques)
                    \            |            /
                     PageController (Symfony)
                               |
                  php bin/console app:export
                               |
               index.html, pages/*.html  ->  GitHub Pages
```

Pourquoi ce choix : un site statique est gratuit à héberger, rapide et sans faille côté
serveur (aucun PHP ne tourne en ligne), mais j'écris le code comme une vraie application
Symfony : routes, contrôleur, service, commande, composants réutilisables.

## Installation (une seule fois)

Il faut PHP 8.2 ou plus récent, et Composer (voir la checklist du guide).

```powershell
cd app
composer install
```

## Travailler sur le site

```powershell
cd app
php -S 127.0.0.1:8000 -t .. public/index.php   # voir le site en direct : http://127.0.0.1:8000
php bin/console app:export                      # régénérer les pages HTML
cd ..
node tests/dom.test.js                          # vérifier (40 tests)
git add -A && git commit -m "..." && git push   # mettre en ligne
```

Avec le serveur lancé, une modification d'un fichier YAML ou Twig se voit en
rechargeant la page.

## Où modifier quoi

| Je veux modifier...                              | Fichier                                         |
|--------------------------------------------------|-------------------------------------------------|
| La présentation, le bandeau, le contact, les menus | `app/contenu/profil.yaml`                     |
| Une étape de la frise du parcours                | `app/contenu/parcours.yaml`                     |
| Un projet (carte de l'accueil et page détaillée) | `app/contenu/projets.yaml`                      |
| Un TP des projets encadrés                       | `app/contenu/cours.yaml`                        |
| Les outils                                       | `app/contenu/outils.yaml`                       |
| Les qualités et la méthode de travail            | `app/contenu/competences.yaml`                  |
| La veille                                        | `app/contenu/veille.yaml`                       |
| Les vignettes de documents                       | `app/contenu/documents.yaml`                    |
| Le journal de stage                              | `app/contenu/stage.yaml`                        |
| Les annexes (cahiers, maquettes, fiches E5)      | `app/contenu/annexes.yaml`                      |
| L'ordre des sections de l'accueil                | `app/templates/accueil/index.html.twig`         |
| La mise en page d'une section de l'accueil       | `app/templates/accueil/_<section>.html.twig`    |
| La mise en page des pages projet                 | `app/templates/pages/projet.html.twig`          |
| Une brique réutilisée partout (bouton, étiquette)| `app/templates/components/<Nom>.html.twig`      |
| Le menu du haut                                  | `app/templates/components/EnTete.html.twig` (+ `src/Twig/Components/EnTete.php`) |
| Les couleurs                                     | `app/templates/base.html.twig` (`@theme`) et `css/site.css` |
| Le mode clair                                    | fin de `css/site.css` (`html[data-theme="light"]`) |
| La recherche du menu                             | `js/recherche.js` et `components/IndexRecherche.html.twig` |
| La présentation de l'oral (touche P)             | `pages/presentation.html` (écrit à la main) et le PowerPoint `assets/presentation/` |

## Organisation du dossier app/

```
app/
├── bin/console                  Ligne de commande Symfony
├── public/index.php             Point d'entrée web (serveur de développement)
├── config/                      Configuration (bundles, Twig, composants, services)
├── contenu/*.yaml               LES TEXTES DU SITE
├── src/
│   ├── Controller/PageController.php   Une méthode par page (une route = une page)
│   ├── Service/Contenu.php             Lit les fichiers YAML (avec un cache)
│   ├── Command/ExportCommand.php       La commande app:export
│   ├── Twig/LienExtension.php          Fonction lien() : liens relatifs corrects
│   └── Twig/Components/EnTete.php      Composant avec classe (le menu)
└── templates/
    ├── base.html.twig           Structure commune (en-tête HTML, menu, pied de page)
    ├── accueil/                 L'accueil, un fichier par section
    ├── pages/                   Les pages secondaires
    └── components/              Les composants : <twig:Bouton>, <twig:Tag>...
```

### Les composants

Un composant est une brique de page réutilisable, appelée comme une balise HTML :

```twig
<twig:Bouton texte="Me contacter" url="#contact" />
<twig:ListeTags :tags="projet.technos" />
<twig:Panneau id="contexte" titre="Le contexte">
  <p>Texte libre à l'intérieur.</p>
</twig:Panneau>
```

Le `:` devant un paramètre signifie « ceci est une variable Twig », sans `:` c'est
un texte. Chaque fichier de `templates/components/` commence par un commentaire
qui explique ses paramètres.

## Le reste du dépôt

```
index.html, pages/*.html   Pages générées par app:export (ne pas modifier à la main)
pages/presentation.html    Exception : le mode présentation, écrit à la main
css/site.css               Styles maison (le reste vient de Tailwind par CDN)
js/accueil.js              JavaScript de l'accueil (carte de profil, frise, filtre, suivi de défilement)
js/site.js                 JavaScript des pages secondaires (menu, sommaire, barre de progression)
js/recherche.js            Recherche du menu (Ctrl+K)
assets/                    Images, PDF, annexes, jeu Mission Orion compilé en WebAssembly
tests/dom.test.js          Tests des pages générées (jsdom) : node tests/dom.test.js
HISTORIQUE.md              Les grandes étapes du site
GUIDE-MODIFICATIONS.md     Les modifications courantes, pas à pas (pour l'oral)
```
