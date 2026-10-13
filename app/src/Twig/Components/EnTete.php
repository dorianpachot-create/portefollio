<?php

namespace App\Twig\Components;

use App\Service\Contenu;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

/**
 * Composant <twig:EnTete /> : la barre de menu fixée en haut de chaque page.
 *
 * C'est un composant "avec classe" : la classe PHP prépare les liens du menu,
 * le gabarit templates/components/EnTete.html.twig les affiche.
 *
 * Utilisation :
 *     <twig:EnTete />                         menu des pages secondaires
 *     <twig:EnTete actif="Projets" />         idem, avec "Projets" en surbrillance
 *     <twig:EnTete :accueil="true" />         menu de l'accueil (liens vers les sections)
 */
#[AsTwigComponent]
class EnTete
{
    /** true sur l'accueil : les liens pointent vers les sections de la page (#parcours...) */
    public bool $accueil = false;

    /** Texte du lien à mettre en surbrillance, ex. "Projets" */
    public string $actif = '';

    public function __construct(private Contenu $contenu)
    {
    }

    /**
     * Liens du menu principal (écran large).
     * Chaque lien : ['texte' => ..., 'cible' => ...]. La cible est écrite depuis
     * la racine du site ; le gabarit la passe dans lien() pour la rendre relative.
     */
    public function liens(): array
    {
        $profil = $this->contenu->get('profil');

        if ($this->accueil) {
            return array_map(
                fn (array $l) => ['texte' => $l['texte'], 'cible' => '#'.$l['ancre']],
                $profil['menu_accueil']
            );
        }

        return $profil['menu_pages'];
    }

    /** Liens du menu mobile (bouton "Menu" sur petit écran). */
    public function liensMobile(): array
    {
        $profil = $this->contenu->get('profil');

        if ($this->accueil) {
            return array_map(
                fn (array $l) => ['texte' => $l['texte'], 'cible' => '#'.$l['ancre']],
                $profil['menu_accueil_mobile']
            );
        }

        return $profil['menu_pages'];
    }
}
