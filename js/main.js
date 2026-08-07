/**
 * Design 4 — gradient
 * Topbar identique au design "modern" : toggle du menu en mobile (<720px).
 */
(function () {
  'use strict';

  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!toggle || !nav) return;

  const mq = window.matchMedia('(max-width: 720px)');
  const sync = () => {
    if (mq.matches) {
      nav.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      nav.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    }
  };
  sync();
  mq.addEventListener('change', sync);

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.hidden = expanded;
  });

  // Ferme le menu mobile au clic sur un lien.
  nav.addEventListener('click', (e) => {
    if (mq.matches && e.target.matches('a')) {
      nav.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
