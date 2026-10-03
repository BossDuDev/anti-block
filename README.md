# antiblock.gethost.cloud

Site statique (HTML, CSS, JS) : il marche sur **GitHub Pages** (et aussi avec le petit serveur Node `index.js`, facultatif).

## Publier sur GitHub Pages

1. Mets **le contenu** de ce dossier à la racine de ton dépôt GitHub : `index.html` doit être visible dès la page d'accueil du dépôt, pas dans un sous-dossier.
2. Sur GitHub : **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Choisis la branche `main` et le dossier **`/ (root)`**, puis **Save**.
4. Après une minute, le site est en ligne sur `https://<ton-pseudo>.github.io/<nom-du-repo>/`.

Les liens sont relatifs et les pages s'ouvrent avec leur nom complet (`youtube.html`), donc ça marche aussi dans un sous-dossier de GitHub Pages.

## Structure

```
index.html        accueil (les capsules)
youtube.html  whatsapp.html  discord.html  apple-music.html
chatgpt.html  calculatrice.html (3 modèles en onglets)  mini-jeux.html
style.css         tout le style du site
site.js           tout le JavaScript (capsules, onglets, mini jeux)
img/              logo du site, logos des capsules et images des tutos
.nojekyll         dit à GitHub de publier les fichiers tels quels
index.js          serveur Node facultatif (inutile sur GitHub Pages)
package.json  .env
```

## Ajouter une capsule

1. Ajouter le logo dans `img/`.
2. Ajouter un bloc dans la liste `CAPSULES` de `site.js`.
3. Créer `<nom>.html` (copier une page existante) : elle est en ligne sur `<nom>.html`.

## Serveur Node (facultatif)

```
npm install
npm start
```
Sur Pelican : port alloué `25589`, commande de démarrage `index.js`.
