<?php

/*
 * Point d'entrée web, pour voir le site en direct pendant qu'on le modifie.
 *
 * Lancer depuis le dossier app/ :
 *     php -S 127.0.0.1:8000 -t .. public/index.php
 * puis ouvrir http://127.0.0.1:8000
 *
 * Le dossier servi (-t ..) est la racine du dépôt : les fichiers css/, js/ et assets/
 * y sont lus directement. Les pages .html, elles, sont toujours calculées par Symfony,
 * donc une modification d'un gabarit ou d'un fichier de contenu se voit en rechargeant la page.
 */

use App\Kernel;
use Symfony\Component\HttpFoundation\Request;

$chemin = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Serveur intégré de PHP : on lui laisse servir les fichiers statiques (images, CSS, JS, PDF).
if (PHP_SAPI === 'cli-server' && !preg_match('~(\.html|/)$~', $chemin) && is_file(dirname(__DIR__, 2).$chemin)) {
    return false;
}

require dirname(__DIR__).'/vendor/autoload.php';

$kernel = new Kernel('dev', true);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
