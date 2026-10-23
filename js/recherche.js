/*
 * Barre de recherche du menu (toutes les pages).
 * ---------------------------------------------------------------------------
 * Ouverture : bouton « Rechercher » du menu, Ctrl+K (Cmd+K sur Mac) ou la touche /.
 * La liste des résultats possibles est écrite dans la page par le composant Twig
 * IndexRecherche (balise <script id="index-recherche">), à partir de contenu/*.yaml.
 * La recherche ignore les accents et les majuscules ; flèches pour choisir,
 * Entrée pour ouvrir, Échap pour fermer.
 */
(function () {
  'use strict';
  var source = document.getElementById('index-recherche');
  if (!source) return;
  var entrees = [];
  try { entrees = JSON.parse(source.textContent); } catch (e) { return; }

  // Les adresses de l'index partent de la racine du site ; depuis pages/, on remonte d'un cran
  var dansPages = /\/pages\//.test(location.pathname);
  var adresse = function (u) { return dansPages ? (u.indexOf('pages/') === 0 ? u.slice(6) : '../' + u) : u; };
  var simple = function (s) { return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  entrees.forEach(function (e) { e._t = simple(e.t); e._tout = simple(e.t + ' ' + e.s + ' ' + (e.k || '')); });

  // La fenêtre de recherche, créée une seule fois
  var dlg = document.createElement('div');
  dlg.className = 'search-dlg';
  dlg.hidden = true;
  dlg.setAttribute('role', 'dialog');
  dlg.setAttribute('aria-modal', 'true');
  dlg.setAttribute('aria-label', 'Rechercher dans le site');
  dlg.innerHTML =
    '<div class="search-dlg__box">' +
      '<div class="search-dlg__field"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
      '<input type="text" placeholder="Un projet, un TP, une techno, un document…" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="search-list" aria-autocomplete="list" />' +
      '<kbd>Échap</kbd></div>' +
      '<ul class="search-dlg__list" id="search-list" role="listbox" aria-label="Résultats"></ul>' +
      '<p class="search-dlg__empty" hidden>Aucun résultat.</p>' +
    '</div>';
  document.body.appendChild(dlg);
  var input = dlg.querySelector('input'), list = dlg.querySelector('ul'), vide = dlg.querySelector('.search-dlg__empty');
  var resultats = [], actif = 0, retour = null;

  function chercher() {
    var mots = simple(input.value).split(/\s+/).filter(Boolean);
    if (!mots.length) {
      resultats = entrees.filter(function (e) { return e.s === 'Projet' || e.s === 'Document'; });
    } else {
      resultats = entrees.filter(function (e) { return mots.every(function (m) { return e._tout.indexOf(m) !== -1; }); })
        .sort(function (a, b) { return (b._t.indexOf(mots[0]) !== -1) - (a._t.indexOf(mots[0]) !== -1); });
    }
    resultats = resultats.slice(0, 8);
    actif = 0;
    afficher();
  }
  function afficher() {
    list.innerHTML = '';
    resultats.forEach(function (e, i) {
      var li = document.createElement('li');
      li.id = 'search-opt-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', i === actif);
      var a = document.createElement('a');
      a.href = adresse(e.u);
      var t = document.createElement('span'); t.className = 'search-dlg__t'; t.textContent = e.t;
      var s = document.createElement('span'); s.className = 'search-dlg__s'; s.textContent = e.s;
      a.appendChild(t); a.appendChild(s); li.appendChild(a); list.appendChild(li);
      a.addEventListener('click', fermer);
      li.addEventListener('mousemove', function () { if (actif !== i) { actif = i; marquer(); } });
    });
    vide.hidden = resultats.length > 0;
    marquer();
  }
  function marquer() {
    [].forEach.call(list.children, function (li, i) { li.setAttribute('aria-selected', i === actif); });
    input.setAttribute('aria-activedescendant', resultats.length ? 'search-opt-' + actif : '');
    var el = list.children[actif]; if (el) el.scrollIntoView({ block: 'nearest' });
  }
  function ouvrir() {
    retour = document.activeElement;
    dlg.hidden = false;
    document.documentElement.classList.add('search-open');
    input.value = ''; chercher(); input.focus();
  }
  function fermer() {
    dlg.hidden = true;
    document.documentElement.classList.remove('search-open');
    if (retour && retour.focus) retour.focus();
  }

  input.addEventListener('input', chercher);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); actif = Math.min(resultats.length - 1, actif + 1); marquer(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); actif = Math.max(0, actif - 1); marquer(); }
    else if (e.key === 'Enter' && resultats[actif]) { e.preventDefault(); var u = adresse(resultats[actif].u); fermer(); location.href = u; }
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) fermer(); });
  document.addEventListener('click', function (e) { if (e.target.closest('[data-search-open]')) { e.preventDefault(); ouvrir(); } });
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !dlg.hidden) { e.preventDefault(); fermer(); return; }
    var t = e.target, saisie = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); dlg.hidden ? ouvrir() : fermer(); }
    else if (e.key === '/' && !saisie && dlg.hidden) { e.preventDefault(); ouvrir(); }
  });
})();
