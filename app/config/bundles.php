<?php

// Les "bundles" sont les briques de Symfony activées dans le projet.
return [
    Symfony\Bundle\FrameworkBundle\FrameworkBundle::class => ['all' => true], // le cœur de Symfony
    Symfony\Bundle\TwigBundle\TwigBundle::class => ['all' => true],           // les gabarits Twig
    Symfony\UX\TwigComponent\TwigComponentBundle::class => ['all' => true],   // les composants <twig:...>
];
