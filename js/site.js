/* Portfolio de Dorian Pachot, script des pages secondaires.
   Rien d'indispensable : sans JavaScript, tout reste lisible. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Barre du haut */
  var bar = document.querySelector('[data-topbar]');
  var onScroll = function () { if (bar) bar.classList.toggle('is-scrolled', scrollY > 10); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Menu mobile */
  var tg = document.querySelector('[data-menu-toggle]'), menu = document.querySelector('[data-menu]');
  if (tg && menu) {
    var setMenu = function (o) { menu.classList.toggle('is-open', o); tg.setAttribute('aria-expanded', o); tg.textContent = o ? 'Fermer' : 'Menu'; };
    tg.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* Suivi de défilement : barre de progression */
  var prog = document.querySelector('[data-progress]'), tick = false;
  var paint = function () {
    var max = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0).toFixed(4) + ')';
    tick = false;
  };
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(paint); } }, { passive: true });
  addEventListener('resize', paint); paint();

  /* Sommaire : lien de la partie en cours de lecture */
  var toc = [].slice.call(document.querySelectorAll('[data-toc] a'));
  if (toc.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        toc.forEach(function (a) { if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    toc.forEach(function (a) { var el = document.getElementById(a.getAttribute('href').slice(1)); if (el) spy.observe(el); });
  }

  /* Apparitions */
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: .08, rootMargin: '0px 0px -5% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('is-in'); }); }

  /* Ouvrir la matière ou le TP visé par l'adresse */
  var openTarget = function () {
    if (!location.hash) return;
    var t = document.getElementById(location.hash.slice(1));
    if (!t) return;
    var d = t.tagName === 'DETAILS' ? t : t.closest('details');
    if (d) d.open = true;
    t.scrollIntoView({ block: 'start' });
  };
  openTarget(); addEventListener('hashchange', openTarget);

  /* Copier l'adresse e-mail */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var label = b.querySelector('[data-copy-label]') || b, old = label.textContent;
      var ok = function () { label.textContent = 'Adresse copiée'; setTimeout(function () { label.textContent = old; }, 1600); };
      if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(b.dataset.copy).then(ok, function () { location.href = 'mailto:' + b.dataset.copy; });
      else location.href = 'mailto:' + b.dataset.copy;
    });
  });
})();
