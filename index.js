// Site Node.js : sert les fichiers du dossier du site (le panel Pelican lance "node index.js").
require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = __dirname;
// Pelican donne le port alloué dans SERVER_PORT ; sinon PORT (.env) ; sinon 25589.
const PORT = Number(process.env.SERVER_PORT || process.env.PORT || 25589);
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon',
};

const log = (...args) => console.log('[web]', ...args);
const logError = (...args) => console.error('[web] ✖', ...args);

// Seuls ces fichiers sont publics : les pages, le style, site.js et le dossier img/ (jamais index.js, .env, package.json...).
const ALLOWED = /^(img\/[^/]+|[^/]+\.(html|css)|site\.js)$/;

function send(res, status, body, type = 'text/plain; charset=utf-8', headers = {}) {
  res.writeHead(status, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', ...headers });
  res.end(body);
}

// Adresse -> fichier du site : "/" = index.html, "/youtube" = youtube.html, sinon le fichier tel quel (css, js, images).
// Renvoie null si le chemin sortirait du dossier du site (ex : "/../.env").
function resolveFile(pathname) {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const relative = clean === '/' ? 'index.html' : path.extname(clean) ? clean.slice(1) : `${clean.slice(1)}.html`;
  const full = path.resolve(PUBLIC_DIR, relative);
  return ALLOWED.test(relative) && full.startsWith(PUBLIC_DIR + path.sep) ? full : null;
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Méthode non autorisée', undefined, { Allow: 'GET, HEAD' });

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return send(res, 400, 'Requête invalide');
  }
  if (pathname.includes('\0')) return send(res, 400, 'Requête invalide');

  // Anciennes adresses des calculatrices (/calculatrice/ti-83...) : tout est maintenant sur /calculatrice.
  if (pathname.startsWith('/calculatrice/')) return send(res, 301, '', undefined, { Location: '/calculatrice' });

  const file = resolveFile(pathname);
  fs.readFile(file || '', (err, data) => {
    if (!file || err) {
      log(`404 ${req.method} ${pathname}`);
      return send(res, 404, 'Page introuvable');
    }
    log(`200 ${req.method} ${pathname}`);
    send(res, 200, req.method === 'HEAD' ? undefined : data, MIME[path.extname(file).toLowerCase()] || 'application/octet-stream');
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') logError(`Le port ${PORT} est déjà utilisé.`);
  else if (err.code === 'EACCES') logError(`Pas le droit d'utiliser le port ${PORT}. Utilise le port alloué dans l'onglet Network du panel.`);
  else logError('Erreur serveur :', err);
});
process.on('uncaughtException', (err) => logError('uncaughtException :', err));
process.on('unhandledRejection', (err) => logError('unhandledRejection :', err));

if (!fs.existsSync(path.join(PUBLIC_DIR, 'index.html'))) logError(`index.html introuvable dans ${PUBLIC_DIR}.`);
server.listen(PORT, HOST, () => console.log(`✅ Site en ligne sur http://${HOST}:${PORT}`));
