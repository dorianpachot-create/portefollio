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
['projets', 'cours', 'parcours', 'outils', 'competences', 'veille', 'documents', 'contact'].forEach((id) => ok('section #' + id, !!d.getElementById(id)));
ok('présentation simple en accroche', /Je m'appelle Dorian Pachot/.test(d.querySelector('h1').textContent));
ok('aucune moyenne ni note affichée', !/15,55|20\/20|\/ 100/.test(text));
ok('pas d\'émojis', !/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(text));
ok('liens externes en noopener', [...d.querySelectorAll('a[target="_blank"]')].every((a) => /noopener/.test(a.rel)));
ok('images avec alt', [...d.querySelectorAll('img')].every((i) => i.hasAttribute('alt')));
ok('frise horizontale avec 15 étapes', d.querySelectorAll('[data-rail] > li').length === 15);
ok('TP de 2e année présents', /DHCP et DNS/.test(text) && /VitaSport/.test(text));
ok('outils : coder, avec l\'IA, en cours', /Pour coder/.test(text) && /avec l'IA/.test(text) && /Découverts en cours/.test(text));
ok('veille : une + articles repérés', !!d.getElementById('une') && d.querySelectorAll('.brief').length >= 4);
ok('4 documents', d.querySelectorAll('#documents article').length === 4);
ok('parcours avant les réalisations', d.body.innerHTML.indexOf('id="parcours"') < d.body.innerHTML.indexOf('id="projets"'));
ok('cartes de projets entièrement cliquables', [...d.querySelectorAll('#projets article')].every((c) => c.classList.contains('card-link') && c.querySelector('a.stretch')));
// Premier clic = page de présentation : le jeu se lance depuis la page Mission Orion
ok('Pla\'Net sans lien public, jeu joignable depuis sa présentation', !d.querySelector('a[href*="pla-net.mediaschool-rouen.fr"]') && !!load('pages/mission-orion.html').querySelector('a[href="mini-jeu.html"]'));
ok('veille : méthodologie et bilan', /Comment je fais ma veille/.test(text) && /Ce que j'en tire/.test(text));
ok('suivi de défilement', !!d.querySelector('[data-progress]') && !!d.querySelector('[data-dots]'));

console.log('\n--- pages projets ---');
['syncro', 'planet', 'crp-assurance', 'mission-orion'].forEach((n) => {
  const p = load('pages/' + n + '.html');
  const t = p.body.textContent;
  // Pla'Net met en avant la planification et la base de données à la place de "réalisation" et "choix"
  const propres = n === 'planet' ? ['planification', 'base-de-donnees', 'code', 'ecarts'] : ['realisation', 'choix'];
  ok(n + ' : page complète', ['en-bref', 'contexte', ...propres, 'difficultes', 'resultat', 'acquis', 'competences'].every((id) => p.getElementById(id)));
  ok(n + ' : design de l\'accueil', !!p.querySelector('link[href="../css/site.css"]') && !/foil|Cormorant/.test(p.documentElement.innerHTML));
});
const pc = load('pages/projets-cours.html');
ok('projets encadrés détaillés (2e année)', ['tp0', 'tp1', 'tp2', 'tp3', 'tp4', 'tp5', 'vitasport'].every((id) => pc.getElementById(id)));
ok('aucune page dorée restante', fs.readdirSync(path.join(ROOT, 'pages')).every((f) => !/class="foil/.test(fs.readFileSync(path.join(ROOT, 'pages', f), 'utf8'))));
const gc = load('pages/gestion-cabinet.html');
ok('gestion de cabinet : page du projet en cours', ['en-bref', 'contexte', 'fonctionnalites', 'architecture', 'securite', 'suite', 'competences'].every((id) => gc.getElementById(id)) && !!d.querySelector('#projets a[href="pages/gestion-cabinet.html"]'));
ok('veille : alerte PHP du 20 octobre à la une', /PHP2Shell/.test(d.getElementById('une').textContent) && !!d.getElementById('art-clickfix'));
ok('mode clair : bouton dans le menu et couleurs prévues', !!d.querySelector('[data-theme-toggle]') && /data-theme="light"/.test(fs.readFileSync(path.join(ROOT, 'css/site.css'), 'utf8')) && /b-theme/.test(fs.readFileSync(path.join(ROOT, 'pages/presentation.html'), 'utf8')));
ok('recherche : bouton dans le menu et index des pages', !!d.querySelector('[data-search-open]') && JSON.parse(load('index.html').getElementById('index-recherche').textContent).some((e) => e.u === 'pages/gestion-cabinet.html'));
const an = load('pages/annexes.html');
ok('annexes : fiches E5, cahiers et comptes rendus', ['e5', 'gestion-cabinet', 'syncro', 'planet', 'crp-assurance', 'comptes-rendus', 'personnels'].every((id) => an.getElementById(id)) && an.querySelectorAll('.annexe').length > 30);
ok('veille : objectif DevOps', /Devenir DevOps/.test(text));

console.log('\n--- liens internes ---');
const pages = ['index.html', ...fs.readdirSync(path.join(ROOT, 'pages')).map((f) => 'pages/' + f)];
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
