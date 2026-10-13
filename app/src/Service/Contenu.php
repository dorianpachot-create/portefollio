<?php

namespace App\Service;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Yaml\Yaml;

/**
 * Lit les textes du site, rangés dans le dossier contenu/ au format YAML.
 *
 * Idée : le code (gabarits Twig) décrit la MISE EN PAGE, les fichiers YAML
 * contiennent les TEXTES. Pour changer un texte, on modifie le YAML, sans
 * toucher au HTML.
 *
 * Exemple dans un contrôleur :
 *     $this->contenu->get('parcours')   // lit contenu/parcours.yaml
 */
class Contenu
{
    /** @var array<string, array> Fichiers déjà lus (on ne relit pas deux fois le même) */
    private array $cache = [];

    public function __construct(private string $dossierContenu)
    {
    }

    /**
     * Renvoie le contenu d'un fichier YAML sous forme de tableau.
     *
     * @param string $fichier nom du fichier sans l'extension, ex. "projets"
     */
    public function get(string $fichier): array
    {
        if (!isset($this->cache[$fichier])) {
            $chemin = $this->dossierContenu.'/'.$fichier.'.yaml';
            if (!is_file($chemin)) {
                throw new \RuntimeException(sprintf('Fichier de contenu introuvable : %s', $chemin));
            }
            $this->cache[$fichier] = Yaml::parseFile($chemin);
        }

        return $this->cache[$fichier];
    }

    /** Liste des projets (réalisations), dans l'ordre du fichier. */
    public function projets(): array
    {
        return $this->get('projets')['projets'];
    }

    /**
     * Un projet précis, retrouvé par son slug (ex. "syncro").
     *
     * @throws NotFoundHttpException si aucun projet ne porte ce slug (page 404)
     */
    public function projet(string $slug): array
    {
        foreach ($this->projets() as $projet) {
            if ($projet['slug'] === $slug) {
                return $projet;
            }
        }

        throw new NotFoundHttpException(sprintf('Aucun projet "%s" dans contenu/projets.yaml', $slug));
    }

    /**
     * Les tuiles "Première année" de l'accueil : une par matière.
     * Le nombre de travaux et le lien (vers le premier travail) sont calculés,
     * donc ajouter un TP dans cours.yaml met la tuile à jour toute seule.
     */
    public function tuilesMatieres(string $idAnnee): array
    {
        foreach ($this->get('cours')['annees'] as $annee) {
            if ($annee['id'] !== $idAnnee) {
                continue;
            }

            return array_map(fn (array $groupe) => [
                'matiere' => $groupe['matiere'],
                'nombre' => count($groupe['travaux']),
                'ancre' => $groupe['travaux'][0]['id'],
            ], $annee['groupes']);
        }

        return [];
    }

    /** Les travaux de deuxième année qui ont une carte sur l'accueil (clé "accueil"). */
    public function cartesCoursAccueil(): array
    {
        $cartes = [];
        foreach ($this->get('cours')['annees'][0]['groupes'] as $groupe) {
            foreach ($groupe['travaux'] as $travail) {
                if (isset($travail['accueil'])) {
                    $cartes[] = $travail;
                }
            }
        }

        return $cartes;
    }
}
