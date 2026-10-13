<?php

namespace App\Command;

use App\Service\Contenu;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Routing\RouterInterface;

/**
 * Commande : php bin/console app:export
 *
 * GitHub Pages ne sait pas exécuter de PHP : il ne sert que des fichiers.
 * Cette commande calcule donc chaque page avec Symfony, comme si un visiteur
 * la demandait, et enregistre le HTML obtenu à la racine du dépôt
 * (index.html, pages/syncro.html...). Ce sont ces fichiers que GitHub Pages publie.
 *
 * À lancer après chaque modification, avant de faire le commit.
 */
#[AsCommand(name: 'app:export', description: 'Génère les pages HTML du site pour GitHub Pages')]
class ExportCommand extends Command
{
    public function __construct(
        private HttpKernelInterface $kernel,
        private RouterInterface $router,
        private Contenu $contenu,
        private string $dossierExport,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Export du site en HTML');

        $erreurs = 0;
        foreach ($this->adressesAExporter() as $adresse) {
            // On "joue" la requête dans Symfony, sans serveur web
            $reponse = $this->kernel->handle(Request::create($adresse), HttpKernelInterface::MAIN_REQUEST, false);

            if ($reponse->getStatusCode() !== 200) {
                $io->error(sprintf('%s : erreur %d', $adresse, $reponse->getStatusCode()));
                ++$erreurs;
                continue;
            }

            $fichier = $this->dossierExport.$adresse;
            if (!is_dir(dirname($fichier))) {
                mkdir(dirname($fichier), 0777, true);
            }
            file_put_contents($fichier, $reponse->getContent());
            $io->writeln(sprintf('  <info>ok</info>  %s', ltrim($adresse, '/')));
        }

        if ($erreurs > 0) {
            $io->error(sprintf('%d page(s) en erreur, rien n\'a été écrit pour elles.', $erreurs));

            return Command::FAILURE;
        }

        $io->success('Toutes les pages sont à jour. Il reste à faire le commit.');

        return Command::SUCCESS;
    }

    /**
     * Liste des adresses à exporter, déduite des routes du contrôleur :
     * ajouter une route dans PageController suffit pour qu'elle soit exportée.
     *
     * @return string[]
     */
    private function adressesAExporter(): array
    {
        $adresses = [];
        foreach ($this->router->getRouteCollection() as $nom => $route) {
            $chemin = $route->getPath();
            if ($nom === 'accueil_racine' || str_starts_with($nom, '_')) {
                continue; // "/" est un doublon de /index.html ; les routes internes de Symfony sont ignorées
            }

            if (str_contains($chemin, '{slug}')) {
                // Route des projets : une page par projet de contenu/projets.yaml
                foreach ($this->contenu->projets() as $projet) {
                    $adresses[] = str_replace('{slug}', $projet['slug'], $chemin);
                }
                continue;
            }
            $adresses[] = $chemin;
        }

        return $adresses;
    }
}
