// Script commun à toutes les pages : chaque partie ne s'active que si la page en a besoin.
document.documentElement.classList.add("js");

// ===== Utilitaires (créer des éléments sans innerHTML) =====
// Petit utilitaire pour créer des éléments sans innerHTML.
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") el.className = value;
    else if (key.startsWith("on")) el.addEventListener(key.slice(2), value);
    else el.setAttribute(key, value);
  }
  el.append(...children);
  return el;
}

function replayButton(el, mount) {
  return h("button", { class: "btn", type: "button", onclick: () => { el.textContent = ""; mount(el); } }, "Rejouer");
}

// ===== Accueil : les capsules (pour en ajouter une, copie un bloc dans CAPSULES) =====
(function () {
  // Liste des capsules affichées sur la page d'accueil.
  // Pour en ajouter une : copie un bloc { ... }, mets le logo dans img/
  // et crée la page correspondante (ex : youtube.html).
  const CAPSULES = [
    {
      name: "YouTube",
      description: "Comment désactiver les contrôles d'accès à YouTube pour regarder plein de vidéos",
      url: "youtube.html",
      logo: "img/youtube.svg",
      accent: "#ff0000",
    },
    {
      name: "WhatsApp",
      description: "Utilise WhatsApp depuis ton ordi du lycée, et installe même l'app",
      url: "whatsapp.html",
      logo: "img/whatsapp.svg",
      accent: "#128c7e",
    },
    {
      name: "Discord",
      description: "Utilise Discord depuis ton navigateur",
      url: "discord.html",
      logo: "img/discord.svg",
      accent: "#5865f2",
    },
    {
      name: "Apple Music",
      description: "Connecte-toi à Apple Music dans ton navigateur, et installe même l'app",
      url: "apple-music.html",
      logo: "img/apple-music.svg",
      accent: "#fa243c",
    },
    {
      name: "ChatGPT",
      description: "Crée un compte ChatGPT avec une adresse Proton Mail, pas à pas",
      url: "chatgpt.html",
      logo: "img/chatgpt.svg",
      accent: "#0f7b63",
    },
    {
      name: "Calculatrice",
      description: "Ajoute des scripts et des jeux à ta calculatrice (TI-83, Casio, NumWorks)",
      url: "calculatrice.html",
      logo: "img/calculatrice.svg",
      accent: "#2563eb",
    },
    {
      name: "Mini jeux",
      description: "Plein de mini jeux pour passer le temps",
      url: "mini-jeux.html",
      logo: "img/mini-jeux.svg",
      accent: "#c2410c",
    },
  ];

  // Construit le lien (carte) d'une capsule.
  function createCapsule(capsule) {
    const link = document.createElement("a");
    link.className = "capsule";
    link.href = capsule.url;
    if (capsule.accent) link.style.setProperty("--accent", capsule.accent);

    const brand = document.createElement("div");
    brand.className = "capsule__brand";

    const logo = document.createElement("img");
    logo.className = "capsule__logo";
    logo.src = capsule.logo;
    logo.alt = `Logo ${capsule.name}`;

    const name = document.createElement("span");
    name.className = "capsule__name";
    name.textContent = capsule.name;

    brand.append(logo, name);

    const description = document.createElement("p");
    description.className = "capsule__description";
    description.textContent = capsule.description;

    link.append(brand, description);
    return link;
  }

  const grid = document.getElementById("capsules");
  if (grid) {
    CAPSULES.forEach((capsule) => grid.appendChild(createCapsule(capsule)));
  }

  // Recherche : ignore les accents et les majuscules, tous les mots tapés doivent correspondre.
  const search = document.getElementById("search");
  if (grid && search) {
    const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const items = Array.from(grid.children).map((el, i) => ({ el, text: norm(CAPSULES[i].name + " " + CAPSULES[i].description) }));
    const count = document.getElementById("count");
    const empty = document.getElementById("empty");
    const update = () => {
      const words = norm(search.value).split(/\s+/).filter(Boolean);
      let shown = 0;
      items.forEach(({ el, text }) => {
        const ok = words.every((w) => text.includes(w));
        el.hidden = !ok;
        if (ok) shown++;
      });
      count.textContent = shown + (shown > 1 ? " capsules" : " capsule");
      empty.hidden = shown > 0;
    };
    search.addEventListener("input", update);
    update();
  }
})();

// ===== Onglets « choisis ton navigateur / ta calculatrice » (sans JavaScript, tout reste affiché) =====
(function () {
  // Onglets "choisis ton navigateur" du tutoriel.
  // Sans JavaScript, tous les navigateurs restent affichés les uns sous les autres.

  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

  function selectTab(selected) {
    tabs.forEach((tab) => {
      const isSelected = tab === selected;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== selected.getAttribute("aria-controls");
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));

    // Flèches gauche/droite pour naviguer au clavier
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const step = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(index + step + tabs.length) % tabs.length];
      next.focus();
      selectTab(next);
    });
  });

  if (tabs.length > 0) selectTab(tabs[0]);
})();

// ===== Mini jeux =====
(function () {
  if (!document.getElementById("game")) return;

  const morpion = (() => {
      const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

      function winner(b) {
        for (const [a, c, d] of LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
        return b.every(Boolean) ? "=" : null;
      }

      // L'ordinateur : gagne si possible, sinon bloque, sinon prend le centre, sinon au hasard.
      function pick(b) {
        const free = b.map((v, i) => (v ? null : i)).filter((i) => i !== null);
        for (const p of ["O", "X"]) {
          for (const i of free) {
            const t = [...b]; t[i] = p;
            if (winner(t) === p) return i;
          }
        }
        return b[4] ? free[Math.floor(Math.random() * free.length)] : 4;
      }

      function mount(el) {
        const b = Array(9).fill("");
        let over = false;
        const status = h("p", { class: "game__status" }, "À toi de jouer (X)");
        const board = h("div", { class: "ttt" });
        const cells = b.map((_, i) => {
          const cell = h("button", { class: "ttt__cell", type: "button", "aria-label": `Case ${i + 1}`, onclick: () => play(i) });
          board.append(cell);
          return cell;
        });
        const draw = () => cells.forEach((c, i) => (c.textContent = b[i]));
        function finish() {
          const w = winner(b);
          if (!w) return false;
          over = true;
          status.textContent = w === "=" ? "Égalité !" : w === "X" ? "Bravo, tu as gagné !" : "L'ordinateur a gagné.";
          return true;
        }
        function play(i) {
          if (over || b[i]) return;
          b[i] = "X"; draw();
          if (finish()) return;
          b[pick(b)] = "O"; draw();
          finish();
        }
        el.append(status, board, replayButton(el, mount));
      }
      return mount;
  })();

  const memory = (() => {
      const EMOJIS = ["🐶", "🐱", "🦊", "🐼", "🐸", "🦁", "🐵", "🐙"];

      function mount(el) {
        const deck = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
        let open = [], moves = 0, found = 0, lock = false;
        const status = h("p", { class: "game__status" }, "Trouve les 8 paires");
        const grid = h("div", { class: "memory" });

        deck.forEach((emoji) => {
          const card = h("button", { class: "memory__card", type: "button", "aria-label": "Carte cachée" }, "?");
          card.addEventListener("click", () => {
            if (lock || card.disabled || open.includes(card)) return;
            card.textContent = emoji;
            open.push(card);
            if (open.length < 2) return;
            moves++;
            const [a, c] = open;
            if (a.textContent === c.textContent) {
              a.disabled = c.disabled = true;
              open = [];
              found++;
              status.textContent = found === 8 ? `Gagné en ${moves} coups !` : `${found}/8 paires, ${moves} coups`;
            } else {
              lock = true;
              setTimeout(() => {
                a.textContent = c.textContent = "?";
                open = []; lock = false;
              }, 700);
            }
          });
          grid.append(card);
        });
        el.append(status, grid, replayButton(el, mount));
      }
      return mount;
  })();

  const pfc = (() => {
      const CHOICES = [["✊", "Pierre"], ["✋", "Feuille"], ["✌️", "Ciseaux"]];

      function mount(el) {
        let me = 0, pc = 0;
        const status = h("p", { class: "game__status" }, "Choisis ton coup");
        const score = h("p", { class: "game__score" }, "Toi 0 - 0 Ordi");
        const row = h("div", { class: "pfc" }, ...CHOICES.map(([emoji, name], i) =>
          h("button", { class: "pfc__btn", type: "button", "aria-label": name, onclick: () => {
            const o = Math.floor(Math.random() * 3);
            const r = (i - o + 3) % 3; // 0 égalité, 1 gagné, 2 perdu
            if (r === 1) me++; else if (r === 2) pc++;
            status.textContent = `${emoji} contre ${CHOICES[o][0]} : ${["égalité", "gagné !", "perdu…"][r]}`;
            score.textContent = `Toi ${me} - ${pc} Ordi`;
          } }, emoji)));
        el.append(status, row, score);
      }
      return mount;
  })();

  const nombre = (() => {
      function mount(el) {
        const secret = 1 + Math.floor(Math.random() * 100);
        let tries = 0;
        const status = h("p", { class: "game__status" }, "J'ai choisi un nombre entre 1 et 100.");
        const input = h("input", { class: "input", type: "number", min: "1", max: "100", "aria-label": "Ton nombre" });
        const ok = h("button", { class: "btn", type: "button" }, "Valider");

        function guess() {
          const n = Number(input.value);
          if (!Number.isInteger(n) || n < 1 || n > 100) {
            status.textContent = "Entre un nombre entier de 1 à 100.";
            return;
          }
          tries++;
          if (n === secret) {
            status.textContent = `Bravo ! C'était ${secret}, trouvé en ${tries} essai${tries > 1 ? "s" : ""}.`;
            input.disabled = ok.disabled = true;
          } else {
            status.textContent = `${n} est trop ${n < secret ? "petit" : "grand"} (${tries} essai${tries > 1 ? "s" : ""})`;
          }
          input.value = "";
          input.focus();
        }
        ok.addEventListener("click", guess);
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") guess(); });
        el.append(status, h("div", { class: "row" }, input, ok), replayButton(el, mount));
      }
      return mount;
  })();

  const reflexes = (() => {
      function mount(el) {
        let state = "idle", timer, start = 0, best = null;
        const pad = h("button", { class: "react react--idle", type: "button" }, "Clique pour commencer");
        const info = h("p", { class: "game__score" }, "Meilleur temps : —");
        const set = (cls, text) => { pad.className = `react react--${cls}`; pad.textContent = text; };

        pad.addEventListener("click", () => {
          if (state === "idle") {
            state = "wait";
            set("wait", "Attends le vert…");
            timer = setTimeout(() => { state = "go"; start = performance.now(); set("go", "CLIQUE !"); }, 1000 + Math.random() * 3000);
          } else if (state === "wait") {
            clearTimeout(timer);
            state = "idle";
            set("idle", "Trop tôt ! Clique pour réessayer");
          } else {
            const t = Math.round(performance.now() - start);
            state = "idle";
            set("idle", `${t} ms, clique pour rejouer`);
            if (best === null || t < best) { best = t; info.textContent = `Meilleur temps : ${best} ms`; }
          }
        });
        el.append(pad, info);
      }
      return mount;
  })();

  const clics = (() => {
      function mount(el) {
        let n = 0, running = false, best = 0;
        const status = h("p", { class: "game__status" }, "Clique le plus vite possible pendant 10 secondes");
        const btn = h("button", { class: "react react--go", type: "button" }, "Clique !");

        btn.addEventListener("click", () => {
          if (!running) {
            running = true; n = 0;
            const end = Date.now() + 10000;
            const tick = setInterval(() => {
              const left = Math.max(0, end - Date.now());
              if (left === 0) {
                clearInterval(tick);
                running = false;
                best = Math.max(best, n);
                status.textContent = `Terminé : ${n} clics (record ${best}). Reclique pour rejouer.`;
              } else {
                status.textContent = `${(left / 1000).toFixed(1)} s, ${n} clics`;
              }
            }, 100);
          }
          n++;
        });
        el.append(status, btn);
      }
      return mount;
  })();


  // Pour ajouter un jeu : crée js/games/<nom>.js (function mount(el)) et ajoute une ligne ici.
  const GAMES = [
    { id: "morpion", name: "Morpion", mount: morpion },
    { id: "memory", name: "Memory", mount: memory },
    { id: "pfc", name: "Pierre-feuille-ciseaux", mount: pfc },
    { id: "nombre", name: "Devine le nombre", mount: nombre },
    { id: "reflexes", name: "Réflexes", mount: reflexes },
    { id: "clics", name: "Clics en 10 s", mount: clics },
  ];

  const tabs = document.getElementById("game-tabs");
  const stage = document.getElementById("game");

  function open(game) {
    stage.textContent = "";
    game.mount(stage);
    tabs.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.id === game.id)));
  }

  GAMES.forEach((game) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "game-tab";
    button.dataset.id = game.id;
    button.textContent = game.name;
    button.addEventListener("click", () => open(game));
    tabs.append(button);
  });

  open(GAMES[0]);
})();

