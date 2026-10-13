<?php

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

/**
 * Noyau de l'application Symfony.
 *
 * Le trait MicroKernelTrait charge automatiquement :
 *  - les bundles listés dans config/bundles.php ;
 *  - la configuration du dossier config/packages/ ;
 *  - les services déclarés dans config/services.yaml ;
 *  - les routes, déclarées ici par des attributs #[Route] dans src/Controller/.
 */
class Kernel extends BaseKernel
{
    use MicroKernelTrait;
}
