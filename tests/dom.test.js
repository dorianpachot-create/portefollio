const { JSDOM } = require('jsdom');
const fs = require('fs');
const ROOT = require('path').resolve(__dirname, '..');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  OK   ' + name); }
  else { fail++; console.log('  ECHEC ' + name + (extra ? ' -> ' + extra : '')); }
};

function boot(file) {
  const dom = new JSDOM(fs.readFileSync(ROOT + '/' + file, 'utf8'), {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://example.org/' + file
  });
  const w = dom.window;
  w.matchMedia = w.matchMedia || ((q) => ({
    matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}
  }));
  if (!w.IntersectionObserver) {
    w.IntersectionObserver = class { constructor(cb){this.cb=cb;} observe(){} unobserve(){} disconnect(){} };
  }
  const el = w.document.createElement('script');
  el.textContent = fs.readFileSync(ROOT + '/js/main.js', 'utf8');
  w.document.body.appendChild(el);
  return w;
}

console.log('\n--- index.html ---');
const w = boot('index.html');
const d = w.document;

// Theme
const themeBtn = d.querySelector('[data-theme-toggle]');
ok('theme : clair au depart', d.documentElement.getAttribute('data-theme') === 'light',
   d.documentElement.getAttribute('data-theme'));
themeBtn.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
ok('theme : bascule en sombre', d.documentElement.getAttribute('data-theme') === 'dark');
ok('theme : memorise', w.localStorage.getItem('theme') === 'dark');
ok('theme : aria-pressed suit', themeBtn.getAttribute('aria-pressed') === 'true');
themeBtn.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
ok('theme : retour au clair', d.documentElement.getAttribute('data-theme') === 'light');

// Palette
const box = d.querySelector('[data-palette]');
const input = d.querySelector('[data-palette-input]');
ok('palette : fermee au depart', box.hidden === true);
d.querySelector('[data-palette-open]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
ok('palette : ouverte au clic', box.hidden === false);
const total = d.querySelectorAll('.palette__item').length;
ok('palette : 26 entrees listees', total === 26, String(total));
input.value = 'bulletin';
input.dispatchEvent(new w.Event('input', { bubbles: true }));
ok('palette : recherche filtre', d.querySelectorAll('.palette__item').length === 1);
input.value = 'recommandation';
input.dispatchEvent(new w.Event('input', { bubbles: true }));
ok('palette : trouve malgre les accents', d.querySelectorAll('.palette__item').length === 1);
input.value = 'zzzz';
input.dispatchEvent(new w.Event('input', { bubbles: true }));
ok('palette : message si vide', d.querySelector('[data-palette-empty]').hidden === false);
d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
ok('palette : Echap ferme', box.hidden === true);
d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
ok('palette : Ctrl+K ouvre', box.hidden === false);
d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

// Filtres
const cards = () => Array.from(d.querySelectorAll('[data-tech]'));
const visible = () => cards().filter(c => !c.classList.contains('is-hidden')).length;
ok('filtres : 3 cartes visibles', visible() === 3, String(visible()));
d.querySelector('[data-filter="python"]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
ok('filtres : Python en garde 1', visible() === 1, String(visible()));
ok('filtres : bouton actif', d.querySelector('[data-filter="python"]').getAttribute('aria-pressed') === 'true');
d.querySelector('[data-filter="flutter"]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
ok('filtres : Flutter en garde 1', visible() === 1, String(visible()));
d.querySelector('[data-filter="all"]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
ok('filtres : Tout remet les 3', visible() === 3);
ok('filtres : message masque', d.querySelector('[data-filters-empty]').hidden === true);

// Carrousel
ok('carrousel : 4 pastilles generees', d.querySelectorAll('.carousel__dot').length === 4,
   String(d.querySelectorAll('.carousel__dot').length));
ok('carrousel : 1re pastille active', d.querySelector('.carousel__dot').getAttribute('aria-current') === 'true');

// Copie
const copyBtn = d.querySelector('[data-copy]');
ok('copie : bouton present', !!copyBtn && copyBtn.dataset.copy === 'dorianpachot@gmail.com');
ok('contact : e-mail hors de la grille', !!d.querySelector('.mail-row') && !d.querySelector('.contact .mail-row'));
ok('contact : 3 tuiles dans la grille', d.querySelectorAll('.contact .contact__item').length === 3,
   String(d.querySelectorAll('.contact .contact__item').length));

// Retour en haut
ok('retour en haut : present', !!d.querySelector('[data-to-top]'));

// Section Cours
ok('cours : 8 matieres listees', d.querySelectorAll('.subject-card').length === 8,
   String(d.querySelectorAll('.subject-card').length));
ok('cours : agent IA retire', !d.body.textContent.includes('Agent IA'));

// Presentation
ok('presentation : 6 reperes', d.querySelectorAll('.facts div').length === 6,
   String(d.querySelectorAll('.facts div').length));
ok('presentation : 4 preuves', d.querySelectorAll('.proof li').length === 4);
ok('presentation : 8 sections ancrees', d.querySelectorAll('main > section[id]').length === 8,
   String(d.querySelectorAll('main > section[id]').length));

console.log('\n--- pages/stage.html (chemins relatifs) ---');
const w2 = boot('pages/stage.html');
const d2 = w2.document;
d2.querySelector('[data-palette-open]').dispatchEvent(new w2.MouseEvent('click', { bubbles: true }));
const first = d2.querySelector('.palette__item');
ok('palette : ouverte sur une sous-page', d2.querySelector('[data-palette]').hidden === false);
ok('palette : 26 entrees aussi', d2.querySelectorAll('.palette__item').length === 26);
ok('theme : bouton present', !!d2.querySelector('[data-theme-toggle]'));

console.log('\n' + pass + ' reussis, ' + fail + ' echecs');
process.exit(fail ? 1 : 0);
