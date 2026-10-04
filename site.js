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
    tag: "Sites et applis",
      description: "Comment désactiver les contrôles d'accès à YouTube pour regarder plein de vidéos",
      url: "youtube.html",
      logo: "img/youtube.svg",
      accent: "#ff0000",
    },
    {
      name: "WhatsApp",
    tag: "Sites et applis",
      description: "Utilise WhatsApp depuis ton ordi du lycée, et installe même l'app",
      url: "whatsapp.html",
      logo: "img/whatsapp.svg",
      accent: "#128c7e",
    },
    {
      name: "Discord",
    tag: "Sites et applis",
      description: "Utilise Discord depuis ton navigateur",
      url: "discord.html",
      logo: "img/discord.svg",
      accent: "#5865f2",
    },
    {
      name: "Apple Music",
    tag: "Sites et applis",
      description: "Connecte-toi à Apple Music dans ton navigateur, et installe même l'app",
      url: "apple-music.html",
      logo: "img/apple-music.svg",
      accent: "#fa243c",
    },
    {
      name: "ChatGPT",
    tag: "Sites et applis",
      description: "Crée un compte ChatGPT avec une adresse Proton Mail, pas à pas",
      url: "chatgpt.html",
      logo: "img/chatgpt.svg",
      accent: "#0f7b63",
    },
    {
      name: "TI-83 Premium CE",
      tag: "Calculatrice",
      description: "Ajoute des scripts et des jeux à ta TI-83 Premium CE",
      url: "calculatrice.html?modele=ti-83",
      logo: "img/calc-ti-83.svg",
    },
    {
      name: "Casio Graph 35+E II",
      tag: "Calculatrice",
      description: "Ajoute des scripts et des jeux à ta Casio Graph 35+E II",
      url: "calculatrice.html?modele=casio",
      logo: "img/calc-casio.svg",
    },
    {
      name: "NumWorks",
      tag: "Calculatrice",
      description: "Ajoute des scripts et des jeux à ta NumWorks",
      url: "calculatrice.html?modele=numworks",
      logo: "img/calc-numworks.svg",
    },
    {
      name: "Morpion",
      tag: "Jeux",
      description: "Aligne trois symboles, le classique",
      url: "mini-jeux.html?jeu=morpion",
      logo: "img/jeu-morpion.svg",
    },
    {
      name: "Memory",
      tag: "Jeux",
      description: "Retrouve toutes les paires de cartes",
      url: "mini-jeux.html?jeu=memory",
      logo: "img/jeu-memory.svg",
    },
    {
      name: "Pierre-feuille-ciseaux",
      tag: "Jeux",
      description: "Le grand classique, à toi de jouer",
      url: "mini-jeux.html?jeu=pfc",
      logo: "img/jeu-pfc.svg",
    },
    {
      name: "Devine le nombre",
      tag: "Jeux",
      description: "Retrouve le nombre mystère en peu d'essais",
      url: "mini-jeux.html?jeu=nombre",
      logo: "img/jeu-nombre.svg",
    },
    {
      name: "Réflexes",
      tag: "Jeux",
      description: "Teste ta vitesse de réaction, en millisecondes",
      url: "mini-jeux.html?jeu=reflexes",
      logo: "img/jeu-reflexes.svg",
    },
    {
      name: "Clics en 10 s",
      tag: "Jeux",
      description: "Combien de clics en 10 secondes ?",
      url: "mini-jeux.html?jeu=clics",
      logo: "img/jeu-clics.svg",
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

    const tag = document.createElement("span");
    tag.className = "capsule__tag";
    tag.textContent = capsule.tag;

    link.append(brand, description, tag);
    return link;
  }

  const grid = document.getElementById("capsules");
  if (grid) {
    CAPSULES.forEach((capsule, i) => {
      const el = createCapsule(capsule);
      el.style.setProperty("--i", i);
      grid.appendChild(el);
    });
  }

  // Recherche + catégories : ignore accents et majuscules, tous les mots tapés doivent correspondre.
  const search = document.getElementById("search");
  if (grid && search) {
    const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const items = Array.from(grid.children).map((el, i) => ({ el, tag: CAPSULES[i].tag, text: norm(`${CAPSULES[i].name} ${CAPSULES[i].description} ${CAPSULES[i].tag}`) }));
    const count = document.getElementById("count");
    const empty = document.getElementById("empty");
    const filters = document.getElementById("filters");
    let tag = "Tout";
    const update = () => {
      const words = norm(search.value).split(/\s+/).filter(Boolean);
      let shown = 0;
      items.forEach((item) => {
        const ok = (tag === "Tout" || item.tag === tag) && words.every((w) => item.text.includes(w));
        item.el.hidden = !ok;
        if (ok) shown++;
      });
      count.textContent = shown + (shown > 1 ? " résultats" : " résultat");
      empty.hidden = shown > 0;
    };
    if (filters) {
      ["Tout", ...new Set(CAPSULES.map((c) => c.tag))].forEach((name) => {
        const chip = h("button", { class: "chip", type: "button", "aria-pressed": String(name === "Tout"), onclick: () => {
          tag = name;
          filters.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
          update();
        } }, name);
        filters.appendChild(chip);
      });
    }
    // Raccourcis : « / » met le curseur dans la recherche, « Échap » l'efface.
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== search && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        search.focus();
      }
    });
    search.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { search.value = ""; update(); search.blur(); }
    });
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

  // Page d'un seul modèle (calculatrice.html?modele=casio) : pas d'onglets, seulement le tuto de ce modèle.
  const wanted = tabs.find((t) => t.id === "tab-" + new URLSearchParams(location.search).get("modele"));
  if (wanted) {
    selectTab(wanted);
    document.querySelector(".tabs").hidden = true;
    const intro = document.querySelector(".intro");
    if (intro) intro.hidden = true;
    const title = "Ajouter des scripts à ta " + wanted.textContent;
    document.querySelector("h1").textContent = title;
    document.title = title + " · Anti Block";
  }
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
      let best = 0; // record gardé entre les parties
      function mount(el) {
        let n = 0, running = false;
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
                status.textContent = `Terminé : ${n} clics (record ${best}).`;
                btn.disabled = true;
                btn.className = "react react--idle";
                btn.textContent = "Terminé";
                // Le bouton « Rejouer » est ailleurs et bloqué 1,5 s : en spammant, on ne relance plus la partie sans faire exprès.
                const again = h("button", { class: "btn", type: "button", disabled: "", onclick: () => { el.textContent = ""; mount(el); } }, "Rejouer");
                el.append(again);
                setTimeout(() => again.removeAttribute("disabled"), 1500);
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
    { id: "morpion", name: "Morpion", about: "Aligne trois symboles, le classique", mount: morpion },
    { id: "memory", name: "Memory", about: "Retrouve toutes les paires de cartes", mount: memory },
    { id: "pfc", name: "Pierre-feuille-ciseaux", about: "Le grand classique, à toi de jouer", mount: pfc },
    { id: "nombre", name: "Devine le nombre", about: "Retrouve le nombre mystère en peu d'essais", mount: nombre },
    { id: "reflexes", name: "Réflexes", about: "Teste ta vitesse de réaction, en millisecondes", mount: reflexes },
    { id: "clics", name: "Clics en 10 s", about: "Combien de clics en 10 secondes ?", mount: clics },
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

  // Page d'un seul jeu (mini-jeux.html?jeu=morpion) : pas d'onglets, titre et texte du jeu.
  const wantedGame = GAMES.find((g) => g.id === new URLSearchParams(location.search).get("jeu"));
  if (wantedGame) {
    tabs.hidden = true;
    document.querySelector("h1").textContent = wantedGame.name;
    document.querySelector(".intro").textContent = wantedGame.about;
    document.title = wantedGame.name + " · Anti Block";
  }
  open(wantedGame || GAMES[0]);
})();

// ===== Transitions, apparitions et sons (bruits de papier créés à la volée, aucun fichier audio) =====
(function () {
  const VOLUME = 0.6; // 0 = muet, 1 = fort. Les sons sont déjà très discrets.
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let on = true;
  try { on = localStorage.getItem("sound") !== "off"; } catch (e) {}

  let ctx, master, noise;
  function audio() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = VOLUME;
    master.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return ctx;
  }

  // Un souffle de bruit filtré, avec une enveloppe douce : c'est la matière du papier.
  function rustle({ type = "bandpass", from, to, q = 0.7, peak, attack, length, delay = 0 }) {
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(from, t);
    filter.frequency.exponentialRampToValueAtTime(to, t + length);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
    src.connect(filter).connect(gain).connect(master);
    src.start(t, Math.random() * 0.8);
    src.stop(t + length + 0.05);
  }

  // Un petit « toc » de papier posé sur une table.
  function knock(freq, peak, length) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.55, t + length);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(peak, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
    osc.connect(gain).connect(master);
    osc.start(t);
    osc.stop(t + length + 0.02);
  }

  // Une note de bois ou de verre : plusieurs harmoniques qui s'éteignent à des vitesses différentes.
  function bell(freq, peak, length, delay = 0) {
    const t = ctx.currentTime + delay;
    [[1, 1, length], [2.76, 0.35, length * 0.45], [5.4, 0.12, length * 0.2]].forEach(([mult, amp, len]) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq * mult;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(peak * amp, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + len);
      osc.connect(gain).connect(master);
      osc.start(t);
      osc.stop(t + len + 0.05);
    });
  }

  const sounds = {
    // Une page qu'on tourne : un frottement qui glisse vers le grave, puis un léger bruit sourd.
    page() {
      rustle({ from: 2800, to: 650, q: 0.6, peak: 0.05, attack: 0.05, length: 0.34 });
      rustle({ type: "lowpass", from: 600, to: 220, q: 0.4, peak: 0.03, attack: 0.012, length: 0.14, delay: 0.17 });
    },
    // Un doigt qui tapote le papier.
    tap() {
      rustle({ from: 2300, to: 1500, q: 1.1, peak: 0.035, attack: 0.004, length: 0.06 });
      knock(170, 0.02, 0.09);
    },
    // Compteurs : petits déclics pendant que les chiffres défilent...
    tick() {
      rustle({ from: 3400, to: 2900, q: 1.4, peak: 0.05, attack: 0.002, length: 0.03 });
    },
    // ... puis un carillon à deux notes, plus fort que les autres sons.
    chime() {
      bell(659, 0.22, 0.9);
      bell(988, 0.26, 1.4, 0.12);
      rustle({ from: 3000, to: 1200, q: 0.5, peak: 0.05, attack: 0.02, length: 0.25, delay: 0.1 });
    },
  };
  // needRunning : pour les sons qui ne suivent pas un clic (compteurs). Si le navigateur bloque encore le son, on se tait au lieu de jouer en retard.
  function play(name, needRunning) {
    if (!on || !audio()) return;
    if (ctx.state === "suspended") {
      ctx.resume();
      if (needRunning) return;
    }
    sounds[name]();
  }

  // Bouton « Son » sur toutes les pages
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "sound-toggle";
  const paint = () => {
    toggle.setAttribute("aria-pressed", String(on));
    toggle.textContent = on ? "Son : activé" : "Son : coupé";
  };
  toggle.addEventListener("click", () => {
    on = !on;
    try { localStorage.setItem("sound", on ? "on" : "off"); } catch (e) {}
    paint();
    play("tap");
  });
  paint();
  document.body.appendChild(toggle);

  // Clics : la page courante glisse vers le haut et la suivante monte du bas ; sons discrets.
  document.addEventListener("click", (e) => {
    if (e.target.closest(".sound-toggle")) return;
    const link = e.target.closest("a[href]");
    if (link) {
      const internal = link.origin === location.origin && link.target !== "_blank";
      if (!internal) return play("tap");
      play("page");
      const plain = e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
      if (plain && !reduce && !e.defaultPrevented) {
        e.preventDefault();
        document.documentElement.classList.add("leaving");
        setTimeout(() => { location.href = link.href; }, 200);
      }
      return;
    }
    if (e.target.closest("button, [role=tab]")) play("tap");
  });
  // Retour arrière : la page revient depuis le cache, on enlève l'état « en train de partir ».
  addEventListener("pageshow", (e) => { if (e.persisted) document.documentElement.classList.remove("leaving"); });

  // Apparition des étapes, notes et onglets quand on arrive dessus
  if (!reduce && "IntersectionObserver" in window) {
    const seen = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); seen.unobserve(entry.target); }
    }), { threshold: 0.1 });
    document.querySelectorAll(".step, .bonus__title, .note, .tabs").forEach((el) => { el.classList.add("reveal"); seen.observe(el); });
  }

  // ===== Compteurs de l'accueil : ils défilent jusqu'à leur valeur, puis un carillon =====
  const fieldCapsules = document.getElementById("count-capsules");
  const fieldVisitors = document.getElementById("count-visitors");
  if (fieldCapsules && fieldVisitors) {
    // Compteur de visites : service gratuit Abacus (aucune clé). Une visite compte une seule fois par navigateur.
    const ABACUS = "https://abacus.jasoncameron.dev";
    const COUNTER = "anti-block/visiteurs";
    const fmt = new Intl.NumberFormat("fr-FR");

    async function countVisitors() {
      const call = async (op) => {
        const res = await fetch(`${ABACUS}/${op}/${COUNTER}`);
        if (!res.ok) throw new Error(res.status);
        return (await res.json()).value;
      };
      let first = true;
      try { first = !localStorage.getItem("counted"); } catch (e) {}
      try {
        const value = first ? await call("hit") : await call("get").catch(() => call("hit"));
        try { localStorage.setItem("counted", "1"); } catch (e) {}
        return value;
      } catch (e) {
        return null; // service injoignable : on masque ce compteur plutôt que d'afficher un faux chiffre
      }
    }

    let lastTick = 0;
    const tick = () => {
      const now = performance.now();
      if (now - lastTick > 55) { lastTick = now; play("tick", true); }
    };
    const rollTo = (el, target, duration) => new Promise((resolve) => {
      const start = performance.now();
      let last = -1;
      (function frame(now) {
        const p = Math.min(1, (now - start) / duration);
        const value = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (value !== last) { last = value; el.textContent = fmt.format(value); tick(); }
        if (p < 1) requestAnimationFrame(frame); else resolve();
      })(start);
    });

    (async () => {
      const pending = Promise.race([countVisitors(), new Promise((r) => setTimeout(() => r(null), 4000))]);
      const capsules = document.querySelectorAll("#capsules .capsule").length;
      const visitors = await pending;
      if (visitors === null) document.getElementById("counter-visitors").hidden = true;
      if (reduce) {
        fieldCapsules.textContent = fmt.format(capsules);
        if (visitors !== null) fieldVisitors.textContent = fmt.format(visitors);
        return;
      }
      await new Promise((r) => setTimeout(r, 500)); // on laisse la page finir de monter
      const jobs = [rollTo(fieldCapsules, capsules, 1300)];
      if (visitors !== null) jobs.push(rollTo(fieldVisitors, visitors, 1900));
      await Promise.all(jobs);
      play("chime", true);
    })();
  }
})();
