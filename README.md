# Anti Block

Site statique (HTML, CSS, JavaScript, sans framework) qui regroupe des tutos et des petits jeux, présentés comme un catalogue : on cherche, on filtre par catégorie, on clique sur une ligne.
Il est pensé pour **GitHub Pages**. Un petit serveur Node (`index.js`) existe aussi, mais il est facultatif.

## Mettre le site en ligne (GitHub Pages)

1. Mets **le contenu** de ce dossier à la racine du dépôt : `index.html` doit être visible dès la page d'accueil du dépôt, pas dans un sous-dossier.
2. Sur GitHub : **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Choisis la branche `main` et le dossier **`/ (root)`**, puis **Save**.
4. Attends environ une minute : le site est sur `https://<pseudo>.github.io/<nom-du-repo>/`.

Tous les liens sont relatifs, donc le site marche aussi dans un sous-dossier. Le fichier `.nojekyll` dit à GitHub de servir les fichiers tels quels.

## Les fichiers

```
index.html           accueil : recherche, catégories, liste des capsules
youtube.html  whatsapp.html  discord.html  apple-music.html  chatgpt.html
                     un tuto par page
calculatrice.html    les tutos des 3 calculatrices (page unique, voir plus bas)
mini-jeux.html       la page qui affiche un mini jeu (page unique, voir plus bas)
style.css            tout le style du site
site.js              tout le JavaScript : capsules, recherche, onglets, jeux
img/                 logo du site, logos des capsules, images des tutos
.nojekyll            publication brute sur GitHub Pages
index.js, package.json, .env, .gitignore    serveur Node facultatif, inutile sur GitHub
```

GitHub Pages fait la différence entre majuscules et minuscules : tous les noms de fichiers sont en minuscules.

## Comment ça marche

- **Les capsules** sont la liste `CAPSULES` en haut de `site.js` (nom, catégorie `tag`, description, `url`, `logo`). L'accueil les affiche en liste numérotée.
- **La recherche** ignore les accents et les majuscules, et tous les mots tapés doivent correspondre. Les boutons de catégorie viennent des `tag` : si tu inventes un nouveau `tag`, son bouton apparaît tout seul.
- **Une capsule par calculatrice** : les liens ressemblent à `calculatrice.html?modele=casio`. La même page affiche alors seulement le tuto de ce modèle, sans onglets. Sans `?modele=`, elle affiche les trois avec des onglets.
- **Une capsule par jeu** : les liens ressemblent à `mini-jeux.html?jeu=morpion`. La même page affiche alors seulement ce jeu. Sans `?jeu=`, elle ouvre le premier jeu avec des onglets.

## Ajouter une capsule

**Un tuto**
1. Mets le logo dans `img/`.
2. Copie une page existante (par exemple `apple-music.html`) en `<nom>.html` et change le texte et les images.
3. Ajoute un bloc dans `CAPSULES` : `url: "<nom>.html"`, `tag: "Sites et applis"`.

**Une calculatrice**
1. Dans `calculatrice.html`, ajoute un bouton d'onglet (`id="tab-<id>"`) et un panneau (`id="panel-<id>"`) en copiant ceux d'un modèle existant.
2. Ajoute un bloc dans `CAPSULES` avec `url: "calculatrice.html?modele=<id>"` et `tag: "Calculatrice"`.

**Un jeu**
1. Dans `site.js`, écris sa fonction `mount(el)` en t'inspirant d'un jeu existant, puis ajoute-le à la liste `GAMES` (`id`, `name`, `about`, `mount`).
2. Ajoute un bloc dans `CAPSULES` avec `url: "mini-jeux.html?jeu=<id>"` et `tag: "Jeux"`.

## Design

- **Palette** : papier crème, encre brun très foncé, une seule couleur d'accent (la brique, `#ae4326`). Pas de violet ni de bleu, pas de dégradé, pas de halo, pas de motif de fond.
- **Typographie** : Newsreader (texte et titres) et IBM Plex Mono (numéros et petites étiquettes), chargées depuis Google Fonts par `style.css`. Hors connexion, le site retombe sur Georgia.
- **Détails** : coins presque carrés, filets fins, animations limitées à de courtes transitions au survol.
- **Animations et sons** : la page monte du bas à l'arrivée, les étapes apparaissent au défilement, et de très légers bruits de papier (créés par le navigateur, aucun fichier audio) accompagnent les clics. Un bouton « Son » en bas à droite les coupe, et le volume se règle avec `VOLUME` dans `site.js`.
- **Accessibilité** : focus visible partout, texte assez contrasté, animations coupées si l'appareil le demande.

## Tester chez soi

```
python3 -m http.server
```
puis ouvre `http://localhost:8000`. Avec Node : `npm install` puis `npm start` (port `25589`, voir `.env`).

## Si une page affiche « 404 » sur GitHub Pages

1. Ouvre directement `https://<pseudo>.github.io/<nom-du-repo>/<page>.html` : si c'est un 404, le fichier n'est pas à la racine du dépôt ou son nom est différent.
2. Vérifie que le nom est en minuscules et exactement le même que dans le lien (`mini-jeux.html`, pas `Mini-jeux.html`).
3. Attends une minute après chaque envoi, puis recharge sans cache (`Ctrl + Maj + R`).
