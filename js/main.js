/**
 * PORTFOLIO DORIAN PACHOT
 * Tout le JavaScript du site tient dans ce fichier. Aucune dependance.
 *
 * COMMENT C'EST ORGANISE
 * Chaque fonctionnalite est une fonction anonyme qui s'execute tout de
 * suite, dans son propre bloc numerote. Elles ne se parlent pas entre
 * elles, donc on peut en supprimer une sans toucher aux autres.
 *
 *   1. Theme clair / sombre .... bouton lune, memorise dans le navigateur
 *   2. Menu repliable .......... bouton Menu en dessous de 760px
 *   3. Section en cours ........ surligne le lien de la section lue
 *   4. Palette de commandes .... la recherche, au clic ou au Ctrl+K
 *   5. Filtre des projets ...... les puces Flutter, Python, etc.
 *   6. Carrousel ............... les captures de SYNCRO
 *   7. Copie de l'e-mail ....... bouton Copier de la section Contact
 *   8. Animations .............. progression, retour en haut, apparition,
 *                              cascade, compteurs
 *
 * LE PRINCIPE A RETENIR
 * Chaque bloc commence par chercher son HTML et s'arrete tout de suite
 * s'il ne le trouve pas. C'est ce qui permet de charger le meme fichier
 * sur les 8 pages : la palette existe partout, les filtres seulement
 * sur l'accueil, et rien ne casse.
 *
 * Le site doit rester lisible meme si ce fichier ne se charge pas. Les
 * animations sont donc desactivees par defaut en CSS et n'apparaissent
 * que si la classe "js" est posee sur <html>, ce que fait le petit
 * script en haut de chaque page.
 */
(function () {
  'use strict';

  // Deux raccourcis pour eviter d'ecrire querySelector partout.
  // $ renvoie le premier element trouve, $$ renvoie un vrai tableau.
  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  // Certaines personnes reglent leur systeme pour limiter les animations,
  // souvent pour des raisons de sante. On respecte ce choix partout.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =======================================================
     1. THEME CLAIR / SOMBRE

     Attention : ce n'est pas ici que le theme est choisi au
     chargement. Le petit script en haut de chaque page s'en
     charge, parce qu'il doit s'executer avant le premier
     affichage. Sinon, quelqu'un en mode sombre verrait un
     eclair blanc a chaque changement de page.

     Ce bloc ne gere que le clic sur le bouton.
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

    // Tant que personne n'a clique sur le bouton, on suit le reglage du
    // systeme, meme s'il change pendant la visite. Des qu'un choix est
    // enregistre, il prend le dessus.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      let chosen = null;
      try { chosen = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
      if (!chosen) apply(e.matches ? 'dark' : 'light');
    });
  })();

  /* =======================================================
     2. MENU REPLIABLE
     En dessous de 760px le menu est cache derriere un bouton.
     Au-dessus il est toujours visible.
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
     3. SECTION EN COURS DE LECTURE

     Surligne dans le menu le lien de la section qu'on est en
     train de lire. Ne s'active que sur l'accueil, puisque les
     autres pages n'ont pas de liens en #ancre.
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
      // On retrecit volontairement la zone de detection a une bande
      // au milieu de l'ecran. Sans ca, deux sections seraient
      // considerees comme visibles en meme temps et le surlignage
      // sauterait d'un lien a l'autre.
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  })();

  /* =======================================================
     4. PALETTE DE COMMANDES

     La recherche du site. S'ouvre au clic sur le bouton
     Rechercher ou au Ctrl+K (Cmd+K sur Mac).

     POUR AJOUTER UNE DESTINATION : une ligne dans le tableau
     ENTRIES ci-dessous, et c'est tout. Le reste suit.
     ======================================================= */
  (function palette() {
    const box = $('[data-palette]');
    if (!box) return;

    const input = $('[data-palette-input]', box);
    const list = $('[data-palette-list]', box);
    const empty = $('[data-palette-empty]', box);
    // data-base vaut "" sur l'accueil et "../" sur les pages du dossier
    // pages/. C'est ce qui permet au meme fichier de construire des liens
    // corrects depuis les deux niveaux.
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

    // On retire les accents des deux cotes de la comparaison. Comme ca
    // "recommandation" trouve "recommandation" qu'on tape avec ou sans
    // accent, et personne ne rate un resultat pour un accent oublie.
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
     5. FILTRE DES PROJETS

     Chaque carte porte un attribut data-tech du genre
     "flutter|nextjs|sql". Un clic sur une puce compare cette
     liste au filtre demande et masque les cartes qui ne
     correspondent pas.

     On se contente d'ajouter ou d'enlever une classe : le DOM
     n'est jamais reconstruit, donc rien ne clignote.
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
     6. CARROUSEL

     Une image a la fois. Le principe est volontairement bete :
     on garde un index, et on fait glisser la bande d'images de
     -index * 100%. Comme chaque image occupe exactement la
     largeur de la fenetre, on ne peut jamais en voir deux a
     moitie.

     L'ancienne version reposait sur le defilement natif et la
     position se calculait a partir de scrollLeft. Ca donnait des
     resultats faux des que la largeur changeait.
     ======================================================= */
  (function carousel() {
    $$('[data-carousel]').forEach((root) => {
      const track = $('[data-carousel-track]', root);
      const slides = $$('.carousel__slide', track || root);
      const count = $('[data-carousel-count]', root);
      if (!track || slides.length < 2) return;

      let index = 0;

      function show(i) {
        // On boucle : apres la derniere image on revient a la premiere.
        index = (i + slides.length) % slides.length;
        track.style.transform = 'translateX(' + (-index * 100) + '%)';
        if (count) count.textContent = (index + 1) + ' / ' + slides.length;

        // Les images masquees sont retirees de l'ordre de tabulation,
        // sinon le clavier navigue vers des liens qu'on ne voit pas.
        slides.forEach((slide, k) => {
          slide.setAttribute('aria-hidden', String(k !== index));
        });
      }

      $$('[data-carousel-prev]', root).forEach((b) =>
        b.addEventListener('click', () => show(index - 1))
      );
      $$('[data-carousel-next]', root).forEach((b) =>
        b.addEventListener('click', () => show(index + 1))
      );

      // Fleches du clavier quand le carrousel a le focus.
      const viewport = $('[data-carousel-viewport]', root);
      if (viewport) {
        viewport.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
          if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
        });
      }

      show(0);
    });
  })();

  /* =======================================================
     7. COPIE DE L'E-MAIL
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
          // L'API presse-papiers n'existe pas partout, et elle est bloquee
          // sur les pages servies en http simple. On retombe alors sur la
          // vieille methode : un champ texte invisible qu'on selectionne.
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
     8. ANIMATIONS

     Quatre choses ici : la barre de progression en haut de
     l'ecran, le bouton retour en haut, l'apparition des blocs
     au defilement avec effet de cascade, et les compteurs.

     Toutes sont desactivees si la personne a demande moins
     d'animations dans les reglages de son systeme.
     ======================================================= */
  (function motion() {
    // Barre de progression de lecture. On ne touche qu'a une variable CSS,
    // le navigateur s'occupe du reste : pas de recalcul de mise en page.
    const bar = $('[data-progress]');
    if (bar) {
      const update = () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const p = h > 0 ? window.scrollY / h : 0;
        bar.style.setProperty('--p', Math.min(Math.max(p, 0), 1).toFixed(4));
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
    }

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

    // Apparition au defilement. On ajoute .is-in une seule fois, puis on
    // arrete d'observer : inutile de rejouer l'effet a chaque passage.
    const targets = $$('.reveal, .stagger');
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

    // Cascade : chaque enfant d'un bloc .stagger recoit un retard croissant.
    // Plafonne a 6 enfants, sinon une grille de dix cartes met deux secondes
    // a finir d'apparaitre et on a l'impression que la page rame.
    $$('.stagger').forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        child.style.setProperty('--d', Math.min(i, 6) * 70 + 'ms');
      });
    });

    // Les compteurs : le chiffre final est deja ecrit dans le HTML, on ne
    // fait que le remplacer temporairement pendant l'animation. Sans
    // JavaScript, le bon chiffre s'affiche quand meme.
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
