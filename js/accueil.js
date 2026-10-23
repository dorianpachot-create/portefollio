/*
 * JavaScript de l'ACCUEIL (index.html).
 * ---------------------------------------------------------------------------
 * Les pages secondaires utilisent js/site.js. Ici, en plus du menu et de la
 * barre de défilement, on trouve ce qui n'existe que sur l'accueil :
 *   - la carte de profil qui s'incline à la souris
 *   - le filtre des projets (Tous / Livrés / En cours)
 *   - la frise du parcours (flèches, clavier, glisser à la souris)
 *   - le suivi de défilement (lien actif du menu et repères sur le côté)
 * Aucun framework : du JavaScript simple, exécuté une fois la page chargée.
 */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  var bar = document.querySelector('[data-topbar]');
  var onScroll = function () { bar.classList.toggle('is-scrolled', scrollY > 10); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var tg = document.querySelector('[data-menu-toggle]'), menu = document.querySelector('[data-menu]');
  var setMenu = function (o) { menu.classList.toggle('is-open', o); tg.setAttribute('aria-expanded', o); tg.textContent = o ? 'Fermer' : 'Menu'; };
  tg.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* Apparitions et jauges */
  var fill = function (root) { root.querySelectorAll('[data-w]').forEach(function (s) { s.style.width = s.dataset.w + '%'; }); };
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); fill(e.target); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('is-in'); }); fill(document); }

  /* Légère inclinaison de la carte de profil, à la souris uniquement */
  var card = document.querySelector('[data-tilt]');
  if (card && fine && !reduce) {
    var raf = 0;
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        card.style.transform = 'rotateX(' + ((.5 - py) * 7).toFixed(2) + 'deg) rotateY(' + ((px - .5) * 8).toFixed(2) + 'deg)';
        card.style.setProperty('--mx', px * 100 + '%'); card.style.setProperty('--my', py * 100 + '%');
        raf = 0;
      });
    });
    card.addEventListener('pointerleave', function () { card.style.transform = ''; });
  }

  /* Filtre des projets */
  var projects = document.querySelectorAll('#projets [data-status]');
  document.querySelectorAll('[data-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(function (x) { x.setAttribute('aria-pressed', x === btn); });
      projects.forEach(function (p) { p.hidden = !(f === 'all' || p.dataset.status === f); });
    });
  });

  /* Frise horizontale : flèches, clavier et glisser à la souris */
  document.querySelectorAll('[data-rail-wrap]').forEach(function (wrap) {
    var rail = wrap.querySelector('[data-rail]'), prev = wrap.querySelector('[data-rail-prev]'), next = wrap.querySelector('[data-rail-next]'), prog = wrap.querySelector('[data-rail-progress]');
    var step = function () { var li = rail.querySelector('li'); return li ? li.getBoundingClientRect().width : 300; };
    var update = function () {
      var max = rail.scrollWidth - rail.clientWidth, ratio = max > 0 ? rail.scrollLeft / max : 1;
      prog.style.transform = 'scaleX(' + Math.max(.08, ratio).toFixed(3) + ')';
      prev.disabled = rail.scrollLeft <= 4; next.disabled = rail.scrollLeft >= max - 4;
    };
    var go = function (d) { rail.scrollBy({ left: d * step(), behavior: reduce ? 'auto' : 'smooth' }); };
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    rail.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    rail.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    var down = false, moved = false, sx = 0, sl = 0;
    rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    addEventListener('pointermove', function (e) {
      if (!down) return; var dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 5) { moved = true; rail.classList.add('is-drag'); }
      if (moved) rail.scrollLeft = sl - dx;
    });
    addEventListener('pointerup', function () {
      if (!down) return; down = false;
      if (moved) { rail.classList.remove('is-drag'); var st = step(); rail.scrollTo({ left: Math.round(rail.scrollLeft / st) * st, behavior: reduce ? 'auto' : 'smooth' }); }
    });
    update();
  });


  /* Suivi de défilement : barre de progression, lien actif et repères latéraux */
  var progress = document.querySelector('[data-progress]');
  var ticking = false;
  var paint = function () {
    var max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0).toFixed(4) + ')';
    ticking = false;
  };
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
  addEventListener('resize', paint); paint();

  var spyLinks = [].slice.call(document.querySelectorAll('[data-spy] a, [data-dots] a'));
  /* Les sections suivies : celles des repères latéraux (#top correspond à la présentation) */
  var ids = [].map.call(document.querySelectorAll('[data-dots] a'), function (a) {
    var id = a.getAttribute('href').slice(1); return id === 'top' ? 'top-hero' : id;
  });
  var setCurrent = function (id) {
    spyLinks.forEach(function (a) {
      if (a.getAttribute('href') === '#' + (id === 'top-hero' ? 'top' : id)) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  };
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) setCurrent(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* Copier l'adresse e-mail */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var label = b.querySelector('[data-copy-label]'), old = label.textContent;
      var ok = function () { label.textContent = 'Adresse copiée'; setTimeout(function () { label.textContent = old; }, 1600); };
      if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(b.dataset.copy).then(ok, function () { location.href = 'mailto:' + b.dataset.copy; });
      else location.href = 'mailto:' + b.dataset.copy;
    });
  });

  // Touche P : ouvre le mode présentation caché (pages/presentation.html), pour l'oral
  addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || !(e.key === 'p' || e.key === 'P')) return;
    var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    location.href = (/\/pages\//.test(location.pathname) ? '' : 'pages/') + 'presentation.html';
  });
})();
