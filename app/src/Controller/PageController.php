<?php

namespace App\Controller;

use App\Service\Contenu;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Toutes les pages du site.
 *
 * Chaque méthode = une page. Elle lit les textes nécessaires (service Contenu)
 * et les transmet au gabarit Twig qui fait la mise en page.
 *
 * Les adresses (routes) reprennent exactement les noms des fichiers exportés :
 * /index.html, /pages/syncro.html... L'export (src/Command/ExportCommand.php)
 * appelle chaque route et enregistre le résultat dans le fichier du même nom.
 */
class PageController extends AbstractController
{
    public function __construct(private Contenu $contenu)
    {
    }

    /** L'accueil : une seule longue page avec toutes les sections. */
    #[Route('/', name: 'accueil_racine')]
    #[Route('/index.html', name: 'accueil')]
    public function accueil(): Response
    {
        return $this->render('accueil/index.html.twig', [
            'profil' => $this->contenu->get('profil'),
            'parcours' => $this->contenu->get('parcours')['etapes'],
            'projets' => $this->contenu->projets(),
            'cartesCours' => $this->contenu->cartesCoursAccueil(),
            'tuilesPremiereAnnee' => $this->contenu->tuilesMatieres('annee-1'),
            'periodeDeuxiemeAnnee' => $this->contenu->get('cours')['annees'][0]['periode'],
            'outils' => $this->contenu->get('outils')['groupes'],
            'competences' => $this->contenu->get('competences'),
            'veille' => $this->contenu->get('veille'),
            'documents' => $this->contenu->get('documents')['documents'],
        ]);
    }

    /**
     * Page de présentation d'un projet : /pages/syncro.html, /pages/planet.html...
     * Le {slug} est le nom donné au projet dans contenu/projets.yaml.
     * priority: -1 : cette route passe après les autres pages de pages/,
     * pour que /pages/stage.html ne soit pas pris pour un projet "stage".
     */
    #[Route('/pages/{slug}.html', name: 'projet', requirements: ['slug' => '[a-z0-9-]+'], priority: -1)]
    public function projet(string $slug): Response
    {
        return $this->render('pages/projet.html.twig', [
            'projet' => $this->contenu->projet($slug),
        ]);
    }

    /** La liste des projets, avec un lien vers chaque présentation. */
    #[Route('/pages/projets-perso.html', name: 'projets')]
    public function projets(): Response
    {
        return $this->render('pages/projets.html.twig', [
            'projets' => $this->contenu->projets(),
        ]);
    }

    /** Tous les travaux pratiques du BTS, détaillés. */
    #[Route('/pages/projets-cours.html', name: 'cours')]
    public function cours(): Response
    {
        return $this->render('pages/cours.html.twig', [
            'annees' => $this->contenu->get('cours')['annees'],
        ]);
    }

    /** Le journal de stage, semaine par semaine. */
    #[Route('/pages/stage.html', name: 'stage')]
    public function stage(): Response
    {
        return $this->render('pages/stage.html.twig', [
            'stage' => $this->contenu->get('stage'),
        ]);
    }

    #[Route('/pages/documents.html', name: 'documents')]
    public function documents(): Response
    {
        return $this->render('pages/documents.html.twig');
    }

    /** Les annexes de l'épreuve E5, rangées par réalisation (contenu/annexes.yaml). */
    #[Route('/pages/annexes.html', name: 'annexes')]
    public function annexes(): Response
    {
        return $this->render('pages/annexes.html.twig', [
            'annexes' => $this->contenu->get('annexes'),
            'cours' => $this->contenu->get('cours')['annees'],
            'documents' => $this->contenu->get('documents')['documents'],
        ]);
    }

    #[Route('/pages/cv.html', name: 'cv')]
    public function cv(): Response
    {
        return $this->render('pages/cv.html.twig');
    }

    /** Le jeu Mission Orion, jouable dans la page. */
    #[Route('/pages/mini-jeu.html', name: 'mini_jeu')]
    public function miniJeu(): Response
    {
        return $this->render('pages/mini-jeu.html.twig');
    }

    #[Route('/pages/mentions-legales.html', name: 'mentions_legales')]
    public function mentionsLegales(): Response
    {
        return $this->render('pages/mentions-legales.html.twig');
    }
}
