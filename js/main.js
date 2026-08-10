/**
 * Portfolio Dorian Pachot
 * 1. Menu repliable en dessous de 760px.
 * 2. Surlignage de la section en cours de lecture sur l'accueil.
 */
(function () {
  'use strict';

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');

  if (toggle && nav) {
    const mq = window.matchMedia('(max-width: 760px)');

    const sync = () => {
      const mobile = mq.matches;
      nav.hidden = mobile;
      toggle.setAttribute('aria-expanded', String(!mobile));
    };
    sync();
    mq.addEventListener('change', sync);

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.hidden = expanded;
    });

    // Referme le menu après un clic sur un lien, en mobile uniquement.
    nav.addEventListener('click', (e) => {
      if (mq.matches && e.target.closest('a')) {
        nav.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Section active pendant le défilement ---------- */
  const anchors = Array.from(
    document.querySelectorAll('.nav__link[href^="#"]')
  );
  if (!anchors.length || !('IntersectionObserver' in window)) return;

  const sections = anchors
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    anchors.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
})();
