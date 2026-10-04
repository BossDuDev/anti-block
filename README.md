# Anti Block

> Un petit catalogue de tutos et de mini-jeux, pensé pour l'ordinateur du lycée.

Anti Block rassemble au même endroit des guides pas à pas (YouTube, WhatsApp, Discord, Apple Music, ChatGPT, calculatrices) et quelques jeux pour passer le temps. Tout est présenté comme un **catalogue** : on cherche, on filtre, on clique sur une ligne, et on suit le guide.

## L'idée

Sur un ordinateur de lycée, beaucoup de choses sont bloquées ou cachées, et les tutos qu'on trouve en ligne sont longs, pleins de pub ou en anglais. Anti Block part du contraire :

- **Court** : une page par sujet, des étapes numérotées, une image quand ça aide.
- **Clair** : des cadres rouges sur les captures montrent où cliquer.
- **Léger** : pas de framework, pas de compte, pas de pub, rien à installer.
- **Fait à la main** : les logos, les illustrations et les textes sont faits pour le site.

## Ce qu'il y a dedans

| Catégorie | Capsules |
|---|---|
| Sites et applis | YouTube, WhatsApp, Discord, Apple Music, ChatGPT |
| Calculatrice | TI-83 Premium CE, Casio Graph 35+E II, NumWorks |
| Jeux | Morpion, Memory, Pierre-feuille-ciseaux, Devine le nombre, Réflexes, Clics en 10 s |

Chaque capsule a sa propre page, avec son logo.

## Fonctions

- **Recherche** instantanée, sans tenir compte des accents ni des majuscules. La touche `/` met le curseur dans le champ, `Échap` l'efface.
- **Catégories** pour filtrer la liste (elles se créent toutes seules à partir des `tag`).
- **Demander un ajout** : un bouton mène au profil Discord de l'équipe, pour envoyer un message privé.
- **Compteurs** : l'accueil affiche le nombre de personnes venues sur le site (service gratuit Abacus, une visite comptée une fois par navigateur) et le nombre de capsules. Si le service est injoignable, le compteur de visites se masque.
- **Animations** : chaque page monte du bas, les étapes apparaissent quand on défile.
- **Sons** : de très légers bruits de papier créés par le navigateur (aucun fichier audio), avec un bouton pour les couper.

## Direction artistique

**Concept : un registre imprimé.** Le site se lit comme un index de bibliothèque : des lignes numérotées, des filets fins, des étiquettes en petites capitales. La précision typographique fait le côté premium, pas les effets.

### Palette

Peu de couleurs, légèrement « cassées », et surtout pas de violet, de bleu, de dégradé ni de halo.

| Rôle | Couleur | Code |
|---|---|---|
| Papier (fond) | crème | `#ebe5d6` |
| Papier en creux (code, cases de jeu) | crème foncé | `#e2dac6` |
| Papier en relief (zone de jeu) | crème clair | `#f2ede0` |
| Encre (texte) | brun très foncé | `#1f1b16` |
| Texte secondaire | brun gris | `#51493d` |
| **Accent** | **brique** | `#ae4326` |
| Accent au survol | brique foncée | `#8f361c` |

La brique est la seule couleur vive : numéros d'étapes, liens, boutons, notes importantes.

### Typographie

- **Newsreader** (serif éditoriale) pour les titres et la lecture, avec de l'italique pour les nuances.
- **IBM Plex Mono** pour les numéros, les étiquettes et les petits repères.

### Formes, matière et mouvement

- Coins presque carrés, traits fins, un filet double sous l'en-tête comme une page imprimée.
- Un grain de papier à peine visible sur le fond.
- Des mouvements courts et doux, coupés si l'appareil demande moins d'animations.

### Accessibilité

HTML sémantique, focus visible partout, contrastes soignés, boutons assez grands sur téléphone, animations désactivées sur demande.

## Les coulisses

HTML, CSS et JavaScript simples, sans dépendance.

```
index.html          accueil : recherche, catégories, liste des capsules
youtube.html  whatsapp.html  discord.html  apple-music.html  chatgpt.html
calculatrice.html   les 3 calculatrices (?modele=ti-83 | casio | numworks)
mini-jeux.html      les 6 jeux (?jeu=morpion | memory | pfc | nombre | reflexes | clics)
style.css           tout le style, avec les couleurs et tailles en variables
site.js             capsules, recherche, onglets, jeux, animations, sons
img/                logos et captures des tutos
```

Le site est publié avec **GitHub Pages** depuis la racine du dépôt. Un serveur Node (`index.js`) existe aussi, mais il est facultatif.

### Ajouter une capsule

1. Ajouter le logo dans `img/`.
2. Ajouter un bloc dans la liste `CAPSULES` en haut de `site.js` (nom, `tag`, description, `url`, `logo`).
3. Créer la page `<nom>.html` en copiant une page existante. Pour une calculatrice ou un jeu, ajouter plutôt l'onglet ou le jeu dans `calculatrice.html` ou `mini-jeux.html`, avec une `url` du type `...?modele=` ou `...?jeu=`.

## L'équipe

- **BossDuDev** : fondateur et créateur du projet ([GitHub](https://github.com/BossDuDev)).

Une idée de capsule ou un tuto manquant ? Envoie un message privé sur [Discord](https://discord.com/users/1330656704504791155), ou utilise le bouton « Demander un ajout » du site.

## À savoir

- Respecte le règlement de ton établissement : ces guides expliquent comment utiliser des services, à toi de voir ce qui est permis chez toi.
- Les logos de marques ne sont pas libres de droits : ceux du site sont des dessins faits maison, inspirés des originaux.
- Les polices viennent de Google Fonts (licence libre SIL OFL).
- Le compteur de visites appelle un service tiers (abacus.jasoncameron.dev) : il ne stocke qu'un nombre, pas d'identité.
