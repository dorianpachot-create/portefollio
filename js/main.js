/**
 * Portfolio Dorian Pachot
 *
 * 1. Thème clair / sombre    5. Filtre des projets par technologie
 * 2. Menu repliable          6. Carrousel de captures
 * 3. Section en cours        7. Copie de l'e-mail
 * 4. Palette de commandes    8. Retour en haut + apparition au défilement
 *
 * Aucune dépendance. Chaque bloc sort proprement si son HTML est absent,
 * ce qui permet de charger le même fichier sur toutes les pages.
 */
(function () {
  'use strict';

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =======================================================
     1. Thème clair / sombre
     Le thème initial est déjà posé par le script inline du <head>
     pour éviter le flash. Ici on ne gère que la bascule.
     ======================================================= */
  (function theme() {
    const btn = $('[data-theme-toggle]');
    if (!btn) return;

    const apply = (mode) => {
      document.documentElement.setAttribute('data-theme', mode);
      btn.setAttribute('aria-pressed', String(mode === 'dark'));
      btn.setAttribute(
        'aria-label',
        mode === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'
      );
      const meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', mode === 'dark' ? '#0f1318' : '#1d4ed8');
    };

    apply(document.documentElement.getAttribute('data-theme') || 'light');

    btn.addEventListener('click', () => {
      const next =
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* navigation privée */ }
    });

    // Suit le réglage système tant que l'utilisateur n'a pas choisi lui-même.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      let chosen = null;
      try { chosen = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
      if (!chosen) apply(e.matches ? 'dark' : 'light');
    });
  })();

  /* =======================================================
     2. Menu repliable
     ======================================================= */
  (function nav() {
    const toggle = $('[data-nav-toggle]');
    const menu = $('[data-nav]');
    if (!toggle || !menu) return;

    const mq = window.matchMedia('(max-width: 760px)');
    const sync = () => {
      menu.hidden = mq.matches;
      toggle.setAttribute('aria-expanded', String(!mq.matches));
    };
    sync();
    mq.addEventListener('change', sync);

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });

    menu.addEventListener('click', (e) => {
      if (mq.matches && e.target.closest('a')) {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  /* =======================================================
     3. Surlignage de la section en cours de lecture
     ======================================================= */
  (function scrollSpy() {
    const links = $$('.nav__link[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    const sections = links
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!seen) return;
        links.forEach((a) =>
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + seen.target.id)
        );
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  })();

  /* =======================================================
     4. Palette de commandes (Ctrl+K / Cmd+K)
     ======================================================= */
  (function palette() {
    const box = $('[data-palette]');
    if (!box) return;

    const input = $('[data-palette-input]', box);
    const list = $('[data-palette-list]', box);
    const empty = $('[data-palette-empty]', box);
    const base = box.dataset.base || '';

    const ENTRIES = [
      { label: 'Qui je suis',                kind: 'Section',  href: base + 'index.html#profil' },
      { label: 'Compétences techniques',     kind: 'Section',  href: base + 'index.html#competences' },
      { label: 'Stage chez Suitime',         kind: 'Section',  href: base + 'index.html#stage' },
      { label: 'Projets',                    kind: 'Section',  href: base + 'index.html#projets' },
      { label: 'Projets encadrés du BTS',    kind: 'Section',  href: base + 'index.html#cours' },
      { label: 'Documents',                  kind: 'Section',  href: base + 'index.html#documents' },
      { label: 'Ce site : les coulisses',    kind: 'Section',  href: base + 'index.html#ce-site' },
      { label: 'Contact',                    kind: 'Section',  href: base + 'index.html#contact' },
      { label: 'Le code du site sur GitHub', kind: 'Lien',     href: 'https://github.com/dorianpachot-create/portefollio' },
      { label: 'Journal de stage détaillé',  kind: 'Page',     href: base + 'pages/stage.html' },
      { label: 'CV en grand',                kind: 'Page',     href: base + 'pages/cv.html' },
      { label: 'Tous les documents',         kind: 'Page',     href: base + 'pages/documents.html' },
      { label: 'Projets personnels',         kind: 'Page',     href: base + 'pages/projets-perso.html' },
      { label: 'Toutes les fiches de cours', kind: 'Page',     href: base + 'pages/projets-cours.html' },
      { label: 'Jouer à Mission Orion',      kind: 'Page',     href: base + 'pages/mini-jeu.html' },
      { label: 'Mentions légales',           kind: 'Page',     href: base + 'pages/mentions-legales.html' },
      { label: 'Télécharger le CV (PDF)',    kind: 'Document', href: base + 'assets/cv/CV_Dorian_Pachot.pdf' },
      { label: 'Lettre de recommandation (PDF)', kind: 'Document', href: base + 'assets/recommandation/Lettre_recommandation_Suitime.pdf' },
      { label: 'Bulletin de 1re année (PDF)', kind: 'Document', href: base + 'assets/bulletin/Bulletin_1ere_annee_Dorian_Pachot.pdf' },
      { label: 'Lettre de motivation (PDF)', kind: 'Document', href: base + 'assets/lettre-motivation/LM_Dorian_Pachot.pdf' },
      { label: 'SYNCRO sur l’App Store', kind: 'Lien', href: 'https://apps.apple.com/fr/app/syncro/id6787898930' },
      { label: 'SYNCRO sur Google Play',     kind: 'Lien',     href: 'https://play.google.com/store/apps/details?id=fr.appsyncro.mobile' },
      { label: 'appsyncro.fr',               kind: 'Lien',     href: 'https://appsyncro.fr' },
      { label: 'CRP-Assurance.com',          kind: 'Lien',     href: 'https://crp-assurance.com' },
      { label: 'LinkedIn',                   kind: 'Lien',     href: 'https://www.linkedin.com/in/dorian-pachot-81299930a/' },
      { label: 'M’envoyer un e-mail',    kind: 'Contact',  href: 'mailto:dorianpachot@gmail.com' }
    ];

    // Retire les accents pour que « recommandation » trouve « récupération ».
    const norm = (s) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let shown = [];
    let cursor = 0;
    let lastFocus = null;

    function render(query) {
      const q = norm(query.trim());
      shown = q
        ? ENTRIES.filter((e) => norm(e.label + ' ' + e.kind).includes(q))
        : ENTRIES;
      cursor = 0;
      list.innerHTML = '';
      shown.forEach((e, i) => {
        const li = document.createElement('li');
        li.className = 'palette__item';
        li.setAttribute('role', 'option');
        li.id = 'palette-opt-' + i;
        li.setAttribute('aria-selected', String(i === 0));
        li.innerHTML =
          '<span></span><span class="palette__kind"></span>';
        li.firstChild.textContent = e.label;
        li.lastChild.textContent = e.kind;
        li.addEventListener('click', () => go(e));
        list.appendChild(li);
      });
      empty.hidden = shown.length > 0;
      input.setAttribute('aria-activedescendant', shown.length ? 'palette-opt-0' : '');
    }

    function move(step) {
      if (!shown.length) return;
      const items = $$('.palette__item', list);
      items[cursor].setAttribute('aria-selected', 'false');
      cursor = (cursor + step + shown.length) % shown.length;
      const active = items[cursor];
      active.setAttribute('aria-selected', 'true');
      active.scrollIntoView({ block: 'nearest' });
      input.setAttribute('aria-activedescendant', active.id);
    }

    function go(entry) {
      close();
      if (/^https?:/.test(entry.href)) window.open(entry.href, '_blank', 'noopener');
      else window.location.href = entry.href;
    }

    function open() {
      lastFocus = document.activeElement;
      box.hidden = false;
      input.value = '';
      render('');
      input.focus();
    }

    function close() {
      box.hidden = true;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener('keydown', (e) => {
      const combo = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
      if (combo) { e.preventDefault(); box.hidden ? open() : close(); return; }
      if (box.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter' && shown[cursor]) { e.preventDefault(); go(shown[cursor]); }
    });

    input.addEventListener('input', () => render(input.value));
    box.addEventListener('mousedown', (e) => { if (e.target === box) close(); });
    $$('[data-palette-open]').forEach((b) => b.addEventListener('click', open));
  })();

  /* =======================================================
     5. Filtre des projets par technologie
     ======================================================= */
  (function filters() {
    const bar = $('[data-filters]');
    if (!bar) return;

    const cards = $$('[data-tech]');
    const empty = $('[data-filters-empty]');
    if (!cards.length) return;

    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter');
      if (!btn) return;

      $$('.filter', bar).forEach((b) =>
        b.setAttribute('aria-pressed', String(b === btn))
      );

      const want = btn.dataset.filter;
      let visible = 0;
      cards.forEach((card) => {
        const techs = (card.dataset.tech || '').split('|');
        const ok = want === 'all' || techs.indexOf(want) !== -1;
        card.classList.toggle('is-hidden', !ok);
        if (ok) visible++;
      });
      if (empty) empty.hidden = visible > 0;
    });
  })();

  /* =======================================================
     6. Carrousel
     ======================================================= */
  (function carousel() {
    $$('[data-carousel]').forEach((root) => {
      const track = $('[data-carousel-track]', root);
      const dots = $('[data-carousel-dots]', root);
      const slides = $$('.carousel__slide', track);
      if (!track || !slides.length) return;

      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'carousel__dot';
        b.setAttribute('aria-label', 'Aller à la capture ' + (i + 1));
        b.setAttribute('aria-current', String(i === 0));
        b.addEventListener('click', () => scrollTo(i));
        dots.appendChild(b);
      });

      const step = () => slides[0].offsetWidth + 16;

      function scrollTo(i) {
        track.scrollTo({ left: i * step(), behavior: reduced ? 'auto' : 'smooth' });
      }

      function sync() {
        const i = Math.round(track.scrollLeft / step());
        $$('.carousel__dot', dots).forEach((d, k) =>
          d.setAttribute('aria-current', String(k === i))
        );
      }

      let raf;
      track.addEventListener('scroll', () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(sync);
      });

      $$('[data-carousel-prev]', root).forEach((b) =>
        b.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' }))
      );
      $$('[data-carousel-next]', root).forEach((b) =>
        b.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' }))
      );
    });
  })();

  /* =======================================================
     7. Copie de l'e-mail
     ======================================================= */
  (function copy() {
    $$('[data-copy]').forEach((btn) => {
      const original = btn.querySelector('[data-copy-label]');
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const text = btn.dataset.copy;
        try {
          await navigator.clipboard.writeText(text);
        } catch (err) {
          // Repli pour les navigateurs sans API presse-papiers.
          const tmp = document.createElement('textarea');
          tmp.value = text;
          tmp.setAttribute('readonly', '');
          tmp.style.position = 'absolute';
          tmp.style.left = '-9999px';
          document.body.appendChild(tmp);
          tmp.select();
          try { document.execCommand('copy'); } catch (e2) { /* abandon silencieux */ }
          document.body.removeChild(tmp);
        }
        btn.classList.add('is-done');
        if (original) original.textContent = 'Copié';
        btn.setAttribute('aria-live', 'polite');
        setTimeout(() => {
          btn.classList.remove('is-done');
          if (original) original.textContent = 'Copier';
        }, 2000);
      });
    });
  })();

  /* =======================================================
     8. Retour en haut, apparition au défilement, compteurs
     ======================================================= */
  (function motion() {
    const top = $('[data-to-top]');
    if (top) {
      const onScroll = () => top.classList.toggle('is-visible', window.scrollY > 600);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      top.addEventListener('click', () =>
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
      );
    }

    if (!('IntersectionObserver' in window)) {
      // Sans IntersectionObserver, on affiche tout immédiatement.
      $$('.reveal').forEach((el) => el.classList.add('is-in'));
      $$('[data-chart]').forEach((el) => el.classList.add('is-in'));
      return;
    }

    // Histogramme : les barres poussent quand le bloc arrive à l'écran.
    const charts = $$('[data-chart]');
    if (charts.length) {
      const ioChart = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add('is-in');
            obs.unobserve(e.target);
          });
        },
        { threshold: 0.25 }
      );
      charts.forEach((c) => ioChart.observe(c));
    }

    const targets = $$('.reveal');
    if (targets.length) {
      if (reduced) {
        targets.forEach((el) => el.classList.add('is-in'));
      } else {
        const io = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              e.target.classList.add('is-in');
              obs.unobserve(e.target);
            });
          },
          { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
        );
        targets.forEach((el) => io.observe(el));
      }
    }

    // Compteurs : la valeur finale est déjà dans le HTML, on ne fait
    // qu'animer l'affichage. Sans JS, le bon chiffre reste lisible.
    const counters = $$('[data-count]');
    if (!counters.length || reduced) return;

    const io2 = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          obs.unobserve(el);
          const final = el.textContent.trim();
          const target = parseFloat(final.replace(',', '.'));
          if (isNaN(target)) return;
          const decimals = (final.split(',')[1] || '').length;
          const start = performance.now();
          const dur = 900;
          const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = (target * eased).toFixed(decimals);
            el.textContent = decimals ? val.replace('.', ',') : String(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = final;
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => io2.observe(c));
  })();
})();
