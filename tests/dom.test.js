// Tests de structure du portfolio (version "Digital Jewelry", octobre 2026).
// Lancer avec : node tests/dom.test.js
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  OK    ' + name); }
  else { fail++; console.log('  ECHEC ' + name + (extra ? ' -> ' + extra : '')); }
};
const load = (f) => new JSDOM(fs.readFileSync(path.join(ROOT, f), 'utf8')).window.document;

console.log('\n--- index.html ---');
const d = load('index.html');
d.querySelectorAll('script').forEach((x) => x.remove());
const text = d.body.textContent;
ok('un seul h1', d.querySelectorAll('h1').length === 1);
['competences', 'projets', 'personnel', 'contact'].forEach((id) => ok('section #' + id, !!d.getElementById(id)));
ok('présentation simple en accroche', /Je m'appelle Dorian Pachot/.test(d.querySelector('h1').textContent));
ok('aucune moyenne ni note affichée', !/15,55|20\/20|\/ 100/.test(text));
ok('pas d\'émojis', !/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(text));
ok('liens externes en noopener', [...d.querySelectorAll('a[target="_blank"]')].every((a) => /noopener/.test(a.rel)));
ok('images avec alt', [...d.querySelectorAll('img')].every((i) => i.hasAttribute('alt')));

console.log('\n--- version-doree.html ---');
const g = load('version-doree.html');
ok('frise horizontale avec 15 étapes', g.querySelectorAll('[data-rail] > li').length === 15);
ok('TP de 2e année présents', /DHCP et DNS/.test(g.body.textContent) && /VitaSport/.test(g.body.textContent));

console.log('\n--- liens internes ---');
const pages = ['index.html', 'version-doree.html', ...fs.readdirSync(path.join(ROOT, 'pages')).map((f) => 'pages/' + f)];
let broken = [];
pages.forEach((p) => {
  const doc = load(p);
  doc.querySelectorAll('a[href], img[src], source[srcset], link[href], script[src], iframe[src]').forEach((el) => {
    const raw = el.getAttribute('href') || el.getAttribute('src') || el.getAttribute('srcset');
    if (!raw || /^(https?:|mailto:|tel:|#|data:)/.test(raw)) return;
    const [file, hash] = raw.split('#');
    const target = path.resolve(path.dirname(path.join(ROOT, p)), file);
    if (!fs.existsSync(target)) { broken.push(p + ' -> ' + raw); return; }
    if (hash && target.endsWith('.html') && !load(path.relative(ROOT, target)).getElementById(hash)) broken.push(p + ' -> ' + raw + ' (ancre)');
  });
});
ok('aucun lien interne cassé', broken.length === 0, broken.join(', '));

console.log(`\n${pass} OK, ${fail} en échec`);
process.exit(fail ? 1 : 0);
