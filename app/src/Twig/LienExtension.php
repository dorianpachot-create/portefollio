<?php

namespace App\Twig;

use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * Fonction Twig lien() : écrit un lien relatif correct, quelle que soit la page.
 *
 * Pourquoi : le site est exporté en fichiers HTML et doit marcher sur GitHub Pages
 * comme en ouvrant le fichier en local. Les liens sont donc relatifs, et ils ne
 * s'écrivent pas pareil depuis index.html et depuis pages/syncro.html.
 *
 * Dans les gabarits et les fichiers YAML, on écrit toujours le chemin depuis la
 * racine du site, et lien() fait la conversion :
 *
 *     {{ lien('assets/cv/CV.pdf') }}
 *         depuis index.html         -> assets/cv/CV.pdf
 *         depuis pages/cv.html      -> ../assets/cv/CV.pdf
 *     {{ lien('pages/stage.html') }}
 *         depuis index.html         -> pages/stage.html
 *         depuis pages/syncro.html  -> stage.html
 *
 * Les adresses externes (https://, mailto:, tel:) et les ancres (#contact)
 * sont laissées telles quelles.
 */
class LienExtension extends AbstractExtension
{
    public function __construct(private RequestStack $requestStack)
    {
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('lien', $this->lien(...)),
            new TwigFunction('dans_pages', $this->estDansPages(...)),
        ];
    }

    public function lien(string $cible): string
    {
        // Adresse externe ou ancre : rien à changer
        if (preg_match('~^(https?:|mailto:|tel:|#)~', $cible)) {
            return $cible;
        }

        if (!$this->estDansPages()) {
            return $cible;
        }

        // On est dans pages/ : une autre page du même dossier, ou on remonte d'un cran
        return str_starts_with($cible, 'pages/') ? substr($cible, strlen('pages/')) : '../'.$cible;
    }

    /** Vrai si la page en cours de calcul est dans le dossier pages/. */
    public function estDansPages(): bool
    {
        $requete = $this->requestStack->getMainRequest();

        return $requete !== null && str_starts_with($requete->getPathInfo(), '/pages/');
    }
}
