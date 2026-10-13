/* =====================================================================
   Portfolio de Dorian Pachot, JavaScript commun à toutes les pages.
   Rien d'indispensable ici : sans JS, tout reste lisible et cliquable.
   ===================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Suivi de défilement : barre fine en haut de l'écran ---------- */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress'; bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<span></span>';
  document.body.appendChild(bar);
  var barFill = bar.firstChild, barTick = false;
  function paintBar() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    barFill.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0).toFixed(4) + ')';
    barTick = false;
  }
  window.addEventListener('scroll', function () { if (!barTick) { barTick = true; requestAnimationFrame(paintBar); } }, { passive: true });
  window.addEventListener('resize', paintBar);
  paintBar();

  /* ---------- Barre du haut : fond flouté une fois qu'on a défilé ---------- */
  var topbar = document.querySelector('[data-topbar]');
  function onScroll() {
    if (topbar) topbar.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('[data-menu-label]').textContent = open ? 'Fermer' : 'Menu';
    };
    toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Halo doré qui suit le curseur ----------
     On déplace un disque déjà dessiné (transform), on ne redessine pas
     de dégradé : c'est ce qui garde 60 images par seconde. */
  var spot = document.querySelector('[data-spotlight]');
  if (spot && finePointer && !reduceMotion) {
    var tx = window.innerWidth / 2, ty = window.innerHeight / 3, x = tx, y = ty, raf = 0;
    var loop = function () {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      spot.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      raf = (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) ? requestAnimationFrame(loop) : 0;
    };
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      spot.classList.add('is-on');
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { spot.classList.remove('is-on'); });
  }

  /* ---------- Apparition des blocs au défilement ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Lien actif dans le menu ---------- */
  var navLinks = document.querySelectorAll('[data-nav] a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    navLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
        var link = map[entry.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Frise horizontale ----------
     Défilement natif (doigt, trackpad, Maj + molette), plus les flèches,
     le clavier et le glisser à la souris. */
  document.querySelectorAll('[data-rail-wrap]').forEach(function (wrap) {
    var rail = wrap.querySelector('[data-rail]');
    var prev = wrap.querySelector('[data-rail-prev]');
    var next = wrap.querySelector('[data-rail-next]');
    var bar = wrap.querySelector('[data-rail-progress]');
    if (!rail) return;

    var step = function () {
      var first = rail.querySelector('li');
      return first ? first.getBoundingClientRect().width : 300;
    };
    var update = function () {
      var max = rail.scrollWidth - rail.clientWidth;
      var ratio = max > 0 ? rail.scrollLeft / max : 1;
      if (bar) bar.style.transform = 'scaleX(' + Math.max(0.08, ratio).toFixed(3) + ')';
      if (prev) prev.disabled = rail.scrollLeft <= 4;
      if (next) next.disabled = rail.scrollLeft >= max - 4;
    };
    var go = function (dir) {
      rail.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    rail.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });

    // Glisser à la souris (le doigt, lui, fait déjà défiler nativement)
    var down = false, moved = false, startX = 0, startLeft = 0;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) { moved = true; rail.classList.add('is-drag'); }
      if (moved) rail.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      if (moved) {
        rail.classList.remove('is-drag');
        // On se recale proprement sur l'étape la plus proche
        var s = step();
        rail.scrollTo({ left: Math.round(rail.scrollLeft / s) * s, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });

    // Au chargement, on se place sur la fin (le plus récent), sans animation
    if (wrap.hasAttribute('data-rail-start-end')) {
      requestAnimationFrame(function () { rail.scrollLeft = rail.scrollWidth; update(); });
    }
    update();
  });

  /* ---------- Copier l'adresse e-mail ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var label = btn.querySelector('[data-copy-label]') || btn;
      var done = function () {
        var old = label.textContent;
        label.textContent = 'Copié';
        setTimeout(function () { label.textContent = old; }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { window.location.href = 'mailto:' + text; });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { window.location.href = 'mailto:' + text; }
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------- Ouvrir la matière visée dans la page des cours ---------- */
  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target && target.tagName === 'DETAILS') target.open = true;
  }

  /* ---------- Année du pied de page ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
