"use strict";
      const $ = s => document.querySelector(s);

      /* ============================================================
         HOW TO PLAY CONTENT
         The rules live in this one data block so the exact house
         rules can be dropped in later without touching the game.
         ============================================================ */
      const RULES = [
        { h: "Players and setup", body: [
          "Cambio is for 2 to 6 players. It uses a regular 52-card deck plus 2 Jokers — 54 cards in total — shuffled.",
          "Each player is dealt 4 cards, face down in a square in front of them. At the start, each player may look at the 2 cards closest to them, then puts them back face down — and must remember them.",
          "The rest of the deck sits face down in the middle as the draw pile. The discard pile starts EMPTY — no card is flipped over to start it. It stays empty until the first player discards, and that first discarded card starts the pile.",
          "Play moves clockwise around the table. The turn-order strip at the top of the table shows the clockwise order, with the current player highlighted.",
          "The goal is the lowest total score overall.",
          "The card memory aid: with it on, the game remembers cards you've seen and shows you a small reminder label on them; with it off, there are no reminders and remembering is down to you. In a practice game against the computer you choose this setting for yourself before the game starts."
        ]},
        { h: "Who goes first — the opening draw", body: [
          "Before anyone is dealt their 4 cards, the first player is decided by a draw. A deck is fanned out face down and each player taps one card from the fan.",
          "When everyone has picked, all the drawn cards are revealed together. The best card wins and that player goes first, then everyone is dealt their 4 cards.",
          "Best means the LOWEST Cambio value — the same values as the game itself: a red King (−1) is the best card you can draw, then a Joker (0), an Ace (1), 2, 3 and so on up to 10, Jack, Queen and black King (10), which are the worst.",
          "If two or more players tie for the best card, only those tied players draw again from a fresh fan, until there is one clear winner."
        ]},
        { h: "Card values", table: [
          ["Joker", "0"], ["Ace", "1"], ["Number cards", "Their number"],
          ["Jack", "10"], ["Queen", "10"], ["Black King", "10"], ["Red King", "−1"]
        ]},
        { h: "Turns", body: [
          "Turns go clockwise. On your turn you pick up one card: either draw face down from the draw pile in the middle, or — once the discard pile has a card — take its top card instead. On the very first turn of a round there is no discard yet, so the first player must draw from the draw pile.",
          "If it is low and you want to keep it, you swap it in for one of your 4 cards. The replaced card goes face up in the middle, onto the discard pile.",
          "You never have to swap in a card you pick up from the draw pile. If it isn't as good as the cards you're already holding, you can put it straight onto the discard pile instead and keep your hand exactly as it is. Only a card taken from the top of the discard pile must be swapped in — you can't take that one and throw it straight back.",
          "Careful with the discard pile: everyone can see the card you take, so everyone knows it's now in your hand. If that rank later lands face up in the middle, another player who remembers can snap it straight off you."
        ]},
        { h: "Snapping", body: [
          "At any point, any player can snap one of their own cards — or an opponent's card — onto the face-up card in the middle, if it is the same rank or number.",
          "Snapping your own card: you now have 3 cards instead of 4.",
          "Snapping an opponent's card: you get to give that opponent one of your cards as a penalty.",
          "A snap that turns out WRONG: the card you tried to snap is turned over so the whole table sees it, then it goes back face down to the player it belongs to. Because it was turned over, everyone now knows what that card is. And the player who attempted the failed snap takes a penalty card from the top of the draw pile — it is placed face down in front of them and they may NOT look at it. It simply sits there, unknown, counting towards their score at the end of the round."
        ]},
        { h: "Card powers", body: [
          "These powers trigger when a Jack, Queen or King is discarded face up in the middle — and using the power is MANDATORY. There is no option to use it or skip it: discard one of these cards and its power is used.",
          "Before the power fires, there is a short snap window of about 4 seconds. The card has just landed face up in the middle, so the other players get a moment to snap a matching card onto it first — and the player who discarded it gets a moment to think. When that window closes, the player who discarded the card uses its power.",
          "When a power is used, the table shows you what is happening: the card being looked at is lifted up and highlighted while that player examines it (only the player using the power sees its face), and when two cards are swapped, both cards are highlighted as they change places — so everyone can follow which cards were involved."
        ], list: [
          "King (black King): you look at any one card on the table — yours or an opponent's — AND swap any two cards with each other: for example, one of yours with another player's, or two other players' cards with each other.",
          "Red King: the same power as the black King — but its value is −1, so you want to keep it.",
          "Queen: you look at any one card.",
          "Jack: you swap any two cards."
        ]},
        { h: "Calling Cambio", body: [
          "Play keeps going round in circles until a player is happy their score is low enough to win. On their turn, that player calls Cambio instead of taking a normal turn.",
          "After Cambio is called, that player's cards are immune: they cannot be swapped, looked at, or snapped.",
          "Each other player then gets exactly one more pick-up / turn. After that, everybody turns over their cards and the lowest total score wins the round."
        ]},
        { h: "Computer players — difficulty", body: [
          "In practice games, computer players fill the other seats. You choose their skill level before the game:",
          "Easy — the relaxed level. Easy computer players are forgetful: cards they have seen slip their mind as the round goes on, their snaps are slow and they sometimes guess at a snap and get it wrong (and take the penalty card).",
          "Moderate — a proper challenge. Moderate computer players remember most of what they have seen, think a little harder about their swaps and powers, and snap noticeably quicker.",
          "Hard — the toughest level. Hard computer players NEVER forget a card they have seen: not the cards they peeked at, not cards shown by Queens and Kings, not cards taken openly from the discard pile, and not cards turned over by failed snaps — and they keep track of those cards as they are swapped around the table. They play their powers shrewdly and snap almost instantly."
        ]},
        { h: "Playing with friends online", body: [
          "Tap Host Game to create a table. You'll get a 5-letter table code — share it with your friends however you like (a text message works well). They open Cambio, tap Join Game, type in the code and wait in the lobby until you start the game.",
          "The host's game runs the table: it deals, enforces the rules and sends every player their own view, so you only ever see your own cards and what the rules let you see.",
          "The host decides whether the card memory aid is on or off, and that one setting applies to every player at the table — it's the same for everyone, so it's fair. (Playing solo against the computer, you choose the memory aid for yourself.)",
          "Any seats still empty when the host starts are filled by computer players at the skill level the host chose.",
          "Keep the host's game open while you play — if the host leaves, the table closes. If a guest leaves mid-game, a computer player takes over their seat so the round can finish."
        ]},
        { h: "Tie-breaker", body: [
          "If there is a tie on the lowest score between two players, the player with the MOST cards remaining wins.",
          "If both tied players also have the same number of cards remaining, the player who did NOT call Cambio wins.",
          "For example: both players score 2, the Cambio caller has 2 cards remaining and the other player has 3 — the other player wins, because they have more cards."
        ]}
      ];

      function renderRules() {
        const host = $("#rules-content");
        host.innerHTML = "";
        for (const sec of RULES) {
          const div = document.createElement("div");
          div.className = "rules-section";
          const h = document.createElement("h3"); h.textContent = sec.h; div.appendChild(h);
          for (const p of sec.body || []) { const el = document.createElement("p"); el.textContent = p; div.appendChild(el); }
          if (sec.list) {
            const ul = document.createElement("ul");
            for (const item of sec.list) { const li = document.createElement("li"); li.textContent = item; ul.appendChild(li); }
            div.appendChild(ul);
          }
          if (sec.table) {
            const t = document.createElement("table"); t.className = "value-table";
            for (const [a, b] of sec.table) {
              const tr = document.createElement("tr");
              const t1 = document.createElement("td"); t1.textContent = a;
              const t2 = document.createElement("td"); t2.textContent = b;
              tr.appendChild(t1); tr.appendChild(t2); t.appendChild(tr);
            }
            div.appendChild(t);
          }
          host.appendChild(div);
        }
      }

      /* ============================================================
         SETTINGS (kept for this session)
         ============================================================ */
      const settings = { name: "Will", bots: 3, difficulty: "easy", speed: 1, sound: true, memoryAid: true, pack: "classic", felt: "green" };
      const BOT_NAMES = ["Ada", "Marco", "Priya", "Felix", "Nia", "Tomás"];

      /* ---------- tiny sounds ---------- */
      let audioCtx = null;
      function blip(freq) {
        if (!settings.sound) return;
        try {
          audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
          if (audioCtx.state === "suspended") audioCtx.resume();
          const o = audioCtx.createOscillator(), g = audioCtx.createGain();
          o.frequency.value = freq; o.type = "triangle";
          g.gain.setValueAtTime(0.08, audioCtx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
          o.connect(g); g.connect(audioCtx.destination);
          o.start(); o.stop(audioCtx.currentTime + 0.13);
        } catch (e) { /* sound is optional */ }
      }

      /* ============================================================
         NAVIGATION
         ============================================================ */
      let rulesReturn = "home";
      function show(view) {
        document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
        $("#view-" + view).classList.add("active");
        window.scrollTo(0, 0);
      }
      document.querySelectorAll("[data-back]").forEach(b =>
        b.addEventListener("click", () => show(b.getAttribute("data-back"))));
      $("#btn-rules").addEventListener("click", () => { rulesReturn = "home"; show("rules"); });
      $("#btn-settings").addEventListener("click", () => show("settings"));
      $("#rules-back").addEventListener("click", () => show(rulesReturn));
      $("#game-rules").addEventListener("click", () => { rulesReturn = "game"; show("rules"); });

      /* settings form wiring */
      function applyAppearance() {
        document.body.dataset.pack = settings.pack || "classic";
        document.body.dataset.felt = settings.felt || "green";
        document.querySelectorAll(".pack-select, #set-pack").forEach(el => { el.value = settings.pack; });
        document.querySelectorAll(".felt-select, #set-felt").forEach(el => { el.value = settings.felt; });
        syncOptionPreviews();
      }
      /* Live previews beside every pack / felt select: each pack shows a
         sample face card and card back in that design, each felt shows a
         swatch of that colour. Tapping a preview chooses it in the
         select; the larger combined preview (cards on felt) follows the
         current choice automatically via the body pack/felt variables. */
      const PACK_OPTIONS = [
        { id: "classic", label: "Classic" }, { id: "midnight", label: "Midnight" },
        { id: "vintage", label: "Vintage" }, { id: "berry", label: "Berry" }
      ];
      const FELT_OPTIONS = [
        { id: "green", label: "Green" }, { id: "blue", label: "Blue" },
        { id: "burgundy", label: "Burgundy" }, { id: "charcoal", label: "Charcoal" },
        { id: "teal", label: "Teal" }
      ];
      function buildOptionPreviews() {
        document.querySelectorAll(".pack-previews").forEach(host => {
          const sel = document.getElementById(host.getAttribute("data-for"));
          if (!sel) return;
          host.innerHTML = "";
          for (const pk of PACK_OPTIONS) {
            const b = document.createElement("button");
            b.type = "button"; b.className = "opt-preview pv-pack"; b.dataset.pack = pk.id;
            b.setAttribute("aria-label", "Preview of the " + pk.label + " card pack — tap to choose it");
            const row = document.createElement("span"); row.className = "mini-row";
            const face = document.createElement("span"); face.className = "mini-card red";
            const corner = document.createElement("span"); corner.className = "mini-corner"; corner.textContent = "A";
            const big = document.createElement("span"); big.className = "mini-big"; big.textContent = "♥";
            face.appendChild(corner); face.appendChild(big);
            const back = document.createElement("span"); back.className = "mini-card mini-back";
            row.appendChild(face); row.appendChild(back);
            const lab = document.createElement("span"); lab.textContent = pk.label;
            b.appendChild(row); b.appendChild(lab);
            b.addEventListener("click", () => { sel.value = pk.id; sel.dispatchEvent(new Event("change")); });
            host.appendChild(b);
          }
        });
        document.querySelectorAll(".felt-previews").forEach(host => {
          const sel = document.getElementById(host.getAttribute("data-for"));
          if (!sel) return;
          host.innerHTML = "";
          for (const fl of FELT_OPTIONS) {
            const b = document.createElement("button");
            b.type = "button"; b.className = "opt-preview pv-felt"; b.dataset.felt = fl.id;
            b.setAttribute("aria-label", "Preview of the " + fl.label + " felt — tap to choose it");
            const sw = document.createElement("span"); sw.className = "felt-swatch";
            const lab = document.createElement("span"); lab.textContent = fl.label;
            b.appendChild(sw); b.appendChild(lab);
            b.addEventListener("click", () => { sel.value = fl.id; sel.dispatchEvent(new Event("change")); });
            host.appendChild(b);
          }
        });
      }
      function syncOptionPreviews() {
        document.querySelectorAll(".pack-previews").forEach(host => {
          const sel = document.getElementById(host.getAttribute("data-for"));
          if (!sel) return;
          host.querySelectorAll(".opt-preview").forEach(b => b.classList.toggle("selected", b.dataset.pack === sel.value));
        });
        document.querySelectorAll(".felt-previews").forEach(host => {
          const sel = document.getElementById(host.getAttribute("data-for"));
          if (!sel) return;
          host.querySelectorAll(".opt-preview").forEach(b => b.classList.toggle("selected", b.dataset.felt === sel.value));
        });
        const pk = PACK_OPTIONS.find(o => o.id === settings.pack);
        const fl = FELT_OPTIONS.find(o => o.id === settings.felt);
        const label = (pk ? pk.label : settings.pack) + " cards on " + (fl ? fl.label.toLowerCase() : settings.felt) + " felt";
        document.querySelectorAll(".ap-current").forEach(el => { el.textContent = label; });
      }
      function syncSettingsForm() {
        $("#set-name").value = settings.name;
        $("#set-bots").value = String(settings.bots);
        $("#set-diff").value = settings.difficulty;
        $("#set-speed").value = String(settings.speed);
        $("#set-sound").value = settings.sound ? "on" : "off";
        $("#set-memory").value = settings.memoryAid ? "on" : "off";
        $("#set-pack").value = settings.pack;
        $("#set-felt").value = settings.felt;
      }
      $("#set-name").addEventListener("change", e => settings.name = e.target.value.trim() || "You");
      $("#set-bots").addEventListener("change", e => settings.bots = parseInt(e.target.value, 10));
      $("#set-diff").addEventListener("change", e => settings.difficulty = e.target.value);
      $("#set-speed").addEventListener("change", e => settings.speed = parseFloat(e.target.value));
      $("#set-sound").addEventListener("change", e => settings.sound = e.target.value === "on");
      $("#set-memory").addEventListener("change", e => settings.memoryAid = e.target.value === "on");
      $("#set-pack").addEventListener("change", e => { settings.pack = e.target.value; applyAppearance(); });
      $("#set-felt").addEventListener("change", e => { settings.felt = e.target.value; applyAppearance(); });
      document.querySelectorAll(".pack-select").forEach(el => el.addEventListener("change", e => { settings.pack = e.target.value; applyAppearance(); }));
      document.querySelectorAll(".felt-select").forEach(el => el.addEventListener("change", e => { settings.felt = e.target.value; applyAppearance(); }));
      syncSettingsForm();
      buildOptionPreviews();
      applyAppearance();

      /* ============================================================
         CARDS
         ============================================================ */
      let nextCardId = 1;
      function cardValue(rank, red) {
        if (rank === "A") return 1;
        if (rank === "JOKER") return 0;
        if (rank === "K") return red ? -1 : 10;
        if (rank === "J" || rank === "Q") return 10;
        return parseInt(rank, 10);
      }
      function buildDeck() {
        const suits = [{ g: "♠", red: false }, { g: "♥", red: true }, { g: "♦", red: true }, { g: "♣", red: false }];
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        const deck = [];
        for (const s of suits) for (const r of ranks)
          deck.push({ id: nextCardId++, rank: r, suit: s.g, red: s.red, value: cardValue(r, s.red) });
        for (let i = 0; i < 2; i++)
          deck.push({ id: nextCardId++, rank: "JOKER", suit: "★", red: false, value: 0 });
        return deck;
      }
      function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        return a;
      }
      function powerOf(card) {
        if (!card) return null;
        if (card.rank === "K") return "king";
        if (card.rank === "Q") return "queen";
        if (card.rank === "J") return "jack";
        return null;
      }
      function cardLabel(c) { return c.rank === "JOKER" ? "Joker" : c.rank + c.suit; }
      function pubCard(c) { return c ? { id: c.id, rank: c.rank, suit: c.suit, red: c.red, value: c.value } : null; }

      /* ============================================================
         GAME STATE — this browser runs the practice game and
         deals for the computer players.
         ============================================================ */
      let session = 0;
      let G = null;
      const wait = ms => new Promise(r => setTimeout(r, ms * settings.speed));
      const alive = tok => G && tok === session;

      function startGameCommon(players, code, mode) {
        session++;
        G = {
          players, code: code || null, mode,
          round: 0, totals: players.map(() => 0),
          deck: [], discard: [], turn: 0, starter: 0,
          phase: "setup", drawn: null, drawnFrom: null,
          cambioCaller: null, finalTurns: 0,
          reveal: new Set(), revealAll: false,
          pendingPower: null, powerStage: null,
          snap: null, lastDiscard: null, lastSnapId: null, lastSnapAt: 0,
          pubReveal: null, fx: null, fxSeq: 0,
          firstWinner: null, firstDrawDone: false, firstDraw: null, dealtAt: 0,
          memoryAid: settings.memoryAid !== false,
          pending: null, readySet: new Set(), readyResolve: null,
          statusText: "", prompts: {}, busy: false
        };
        players.forEach(p => { p.spy = new Set(); p.memory = new Set(); p.hand = []; });
        show("game");
        newRound(session);
      }

      function endSession() {
        session++;
        G = null;
        $("#score-overlay").classList.remove("open");
        if (typeof cleanupOnline === "function") cleanupOnline();
        lobby = null;
        C = null;
      }
      $("#game-quit").addEventListener("click", () => {
        if (C && C.client) { try { C.client.publish(topic(C.code, "join"), JSON.stringify({ kind: "leave", clientId: C.clientId })); } catch (e) {} }
        if (lobby && lobby.client) { try { lobby.client.publish(topic(lobby.code, "lobby"), JSON.stringify({ type: "closed" })); } catch (e) {} }
        endSession(); show("home");
      });
      $("#btn-play").addEventListener("click", () => {
        applyAppearance();
        $("#play-bots").value = String(settings.bots);
        $("#play-diff").value = settings.difficulty;
        $("#play-memory").value = settings.memoryAid ? "on" : "off";
        show("playsetup");
      });
      $("#play-start").addEventListener("click", () => {
        settings.bots = parseInt($("#play-bots").value, 10);
        settings.difficulty = $("#play-diff").value;
        settings.memoryAid = $("#play-memory").value === "on";
        settings.pack = $("#play-pack").value; settings.felt = $("#play-felt").value;
        applyAppearance();
        syncSettingsForm();
        endSession();
        const players = [{ name: settings.name, bot: false, conn: null }];
        for (let i = 0; i < settings.bots; i++) players.push({ name: BOT_NAMES[i], bot: true, conn: null });
        startGameCommon(players, null, "local");
      });

      /* ---------- status / prompts ---------- */
      function announce(pub, actorIdx, actorMsg) {
        if (!G) return;
        G.statusText = pub;
        G.prompts = {};
        if (actorIdx !== null && actorIdx !== undefined && actorMsg) G.prompts[actorIdx] = actorMsg;
      }
      function displayStatusFor(i) {
        return (G.prompts && G.prompts[i]) || G.statusText;
      }

      /* ---------- draw to decide who goes first ----------
         Before the 4-card deal (first round only), each player picks one
         card from a fanned-out face-down deck. All picks are revealed
         together; the LOWEST Cambio value wins (red King -1 best, then
         Joker 0, Ace 1, ... 10 / J / Q / black King 10 worst). A tie for
         best means only the tied players draw again from a fresh fan. */
      function handleFirstPick(idx, fanIdx) {
        if (!G || G.phase !== "firstDraw" || !G.firstDraw) return;
        const fd = G.firstDraw;
        if (fd.revealed || fd.picks[idx] || fd.contenders.indexOf(idx) < 0) return;
        if (fd.takenBy[fanIdx] !== undefined || !fd.fan[fanIdx]) return;
        fd.picks[idx] = fd.fan[fanIdx];
        fd.takenBy[fanIdx] = idx;
        if (idx === 0) blip(600);
        render();
        checkFirstDrawComplete();
      }
      function checkFirstDrawComplete() {
        if (!G || !G.firstDraw || !G.firstDraw.resolve) return;
        const fd = G.firstDraw;
        if (fd.contenders.every(i => fd.picks[i])) { const r = fd.resolve; fd.resolve = null; r(); }
      }
      function botFirstPicks(tok) {
        if (!G || !G.firstDraw) return;
        const fd = G.firstDraw;
        fd.contenders.filter(i => G.players[i].bot).forEach((bi, k) => {
          setTimeout(() => {
            if (!alive(tok) || !G || G.phase !== "firstDraw" || G.firstDraw !== fd || fd.picks[bi]) return;
            const free = fd.fan.map((c, fi) => fi).filter(fi => fd.takenBy[fi] === undefined);
            if (free.length) handleFirstPick(bi, free[Math.floor(Math.random() * free.length)]);
          }, (950 + k * 800 + Math.random() * 800) * settings.speed);
        });
      }
      async function runFirstPlayerDraw(tok) {
        G.firstDraw = { contenders: G.players.map((p, i) => i), drawNo: 1, fan: [], takenBy: {}, picks: {}, revealed: false, winner: null, ranking: null, bestValue: null, resolve: null };
        G.deck = shuffle(buildDeck()); // a deck on the table while the fan is out
        while (alive(tok)) {
          const fd = G.firstDraw;
          fd.fan = shuffle(buildDeck()).slice(0, 18);
          fd.takenBy = {}; fd.picks = {}; fd.revealed = false; fd.ranking = null;
          G.phase = "firstDraw";
          const names = fd.contenders.map(i => G.players[i].name).join(", ");
          announce("Draw to go first" + (fd.drawNo > 1 ? " — draw " + fd.drawNo + " (tie-break)" : "") + ": " + names + " each pick a card from the fan. Lowest card wins.", null);
          fd.contenders.forEach(i => { if (!G.players[i].bot) G.prompts[i] = fd.contenders.length === G.players.length ? "Pick one face-down card from the fan — lowest card goes first." : "Tie-break: only the tied players draw again. Pick a card from the fresh fan."; });
          G.players.forEach((p, i) => { if (!p.bot && fd.contenders.indexOf(i) < 0) G.prompts[i] = "Tie-break draw: the tied players are drawing again — watch their cards."; });
          render();
          botFirstPicks(tok);
          await new Promise(res => { fd.resolve = res; checkFirstDrawComplete(); });
          if (!alive(tok)) return;
          fd.revealed = true;
          const best = Math.min.apply(null, fd.contenders.map(i => fd.picks[i].value));
          fd.bestValue = best;
          fd.ranking = fd.contenders.slice().sort((a, b) => fd.picks[a].value - fd.picks[b].value);
          const winners = fd.contenders.filter(i => fd.picks[i].value === best);
          announce("The draw is revealed: " + fd.ranking.map(i => G.players[i].name + " drew " + cardLabel(fd.picks[i]) + " (" + fd.picks[i].value + ")").join(", ") + ".", null);
          render();
          await wait(4200);
          if (!alive(tok)) return;
          if (winners.length === 1) {
            fd.winner = winners[0];
            G.firstWinner = winners[0];
            G.firstDrawDone = true;
            announce(G.players[winners[0]].name + " drew the best card (" + cardLabel(fd.picks[winners[0]]) + ") and goes first! Dealing 4 cards each…", null);
            render();
            await wait(2000);
            return;
          }
          fd.contenders = winners;
          fd.drawNo++;
          announce("Tie for the best card (" + best + ") between " + winners.map(i => G.players[i].name).join(" and ") + " — only they draw again.", null);
          render();
          await wait(2100);
        }
      }

      /* ---------- round setup ---------- */
      async function newRound(tok) {
        G.round++;
        if (G.round === 1 && !G.firstDrawDone) {
          await runFirstPlayerDraw(tok);
          if (!alive(tok)) return;
        }
        G.deck = shuffle(buildDeck());
        // The discard pile starts EMPTY by rule — no starter card is flipped.
        // It stays empty until the first player discards, and that card
        // starts the pile. The first player must therefore draw from the deck.
        G.discard = [];
        G.cambioCaller = null; G.finalTurns = 0;
        G.reveal = new Set(); G.revealAll = false;
        G.drawn = null; G.pendingPower = null; G.powerStage = null;
        G.snap = null; G.lastDiscard = null; G.pending = null;
        G.pubReveal = null; G.fx = null; G.lastScore = null; G.revealViewer = 0;
        G.readySet = new Set();
        for (const p of G.players) {
          p.hand = [G.deck.pop(), G.deck.pop(), G.deck.pop(), G.deck.pop()];
          p.memory = new Set([p.hand[2].id, p.hand[3].id]); // the two nearest cards
          p.spy = new Set();
        }
        G.dealtAt = Date.now();
        G.starter = G.firstWinner !== null && G.firstWinner !== undefined
          ? (G.firstWinner + G.round - 1) % G.players.length
          : (G.round - 1) % G.players.length;
        G.turn = G.starter;
        G.phase = "peek";
        announce("Round " + G.round + ": everyone is memorising their two nearest cards.", null);
        G.players.forEach((p, i) => { if (!p.bot) G.prompts[i] = "Memorise your two nearest cards (bottom row), " + p.name + "."; });
        render();
        // wait until every human player is ready
        await new Promise(res => { G.readyResolve = res; checkReady(); });
        if (!alive(tok)) return;
        G.phase = "idle";
        announce(G.players[G.turn].name + " to start.", null);
        render();
        await runTurn(tok);
      }
      function checkReady() {
        if (!G || !G.readyResolve) return;
        const humans = G.players.map((p, i) => i).filter(i => !G.players[i].bot);
        if (humans.every(i => G.readySet.has(i))) { const r = G.readyResolve; G.readyResolve = null; r(); }
      }
      function submitReady(idx) {
        if (!G || G.phase !== "peek") return;
        G.readySet.add(idx);
        render();
        checkReady();
      }

      /* ---------- action plumbing ----------
         Local clicks and remote messages both land here. */
      function act(idx) { return new Promise(res => { G.pending = { idx, res }; }); }
      function submitAction(idx, a) {
        if (!G || !a) return;
        if (a.type === "firstPick") { handleFirstPick(idx, a.fanIdx); return; }
        if (a.type === "ready") { submitReady(idx); return; }
        if (G.phase === "snap" && a.type === "snap") { handleSnapAttempt(idx, a.p, a.slot); return; }
        if (G.phase === "snap" && a.type === "give") { resolveGive(idx, a.slot); return; }
        if (G.pending && G.pending.idx === idx) {
          const r = G.pending.res; G.pending = null; r(a);
        }
      }
      function takeover(idx) {
        if (G && G.pending && G.pending.idx === idx) {
          const r = G.pending.res; G.pending = null; r({ type: "takeover" });
        }
      }

      /* ---------- turn engine ---------- */
      async function runTurn(tok) {
        if (!alive(tok)) return;
        const p = G.players[G.turn];
        render();
        if (p.bot) await botTurn(tok, G.turn);
        else await humanTurn(tok, G.turn);
        if (!alive(tok)) return;
        await finishTurn(tok);
      }

      async function finishTurn(tok) {
        if (!alive(tok)) return;
        if (G.lastDiscard) { await snapWindow(tok); if (!alive(tok)) return; G.lastDiscard = null; }
        if (G.cambioCaller !== null && G.turn !== G.cambioCaller) {
          G.finalTurns--;
          if (G.finalTurns <= 0) { endRound(); return; }
        }
        await wait(700); // a beat between turns so the last move can be followed
        if (!alive(tok)) return;
        G.turn = (G.turn + 1) % G.players.length;
        await runTurn(tok);
      }

      async function humanTurn(tok, idx) {
        const p = G.players[idx];
        G.phase = "chooseSource";
        const topDisc = G.discard[G.discard.length - 1];
        announce(p.name + " is taking their turn.", idx,
          "Your turn. Tap the draw pile to pick up face down" +
          (topDisc ? ", or tap the " + cardLabel(topDisc) + " on the discard pile to take it instead — everyone will see you take it" : "") +
          (G.cambioCaller === null ? " — or call Cambio instead." : "."));
        render();
        let a = await act(idx);
        if (!alive(tok)) return;
        if (a.type === "takeover") { await botTurn(tok, idx); return; }
        if (a.type === "cambio" && G.cambioCaller === null) { callCambio(idx); await wait(950); return; }

        if (a.type === "drawDiscard" && G.discard.length) {
          // Taking from the discard pile is public: everyone sees the card,
          // knows it's now in this player's hand, and can snap it later if
          // its rank lands face up again. You must swap it in.
          G.drawn = G.discard.pop();
          G.drawnFrom = "discard";
          G.phase = "chooseSwap";
          announce(p.name + " picks up the " + cardLabel(G.drawn) + " from the discard pile — everyone saw it, so everyone knows they have it.", idx,
            "You picked up the " + cardLabel(G.drawn) + " from the discard pile — the whole table saw it and can snap it off you later. Tap one of your cards to swap it in.");
          if (idx === 0) blip(560);
          render();
        } else {
          G.drawn = drawFromDeck(); G.drawnFrom = "deck";
          G.phase = "chooseSwap";
          announce(p.name + " draws a card from the deck.", idx,
            "You drew the " + cardLabel(G.drawn) + ". You don't have to swap it in — if it isn't as good as the cards you're holding, put it straight on the discard pile (tap the discard pile or the button below). Or tap one of your cards to swap it in.");
          if (idx === 0) blip(520);
          render();
        }
        a = await act(idx);
        if (!alive(tok)) return;
        if (a.type === "takeover") {
          const d = botResolveDrawn(idx);
          if (d) await botPower(tok, idx, powerOf(d));
          return;
        }
        let discarded = null;
        if (a.type === "swap") {
          discarded = doSwap(idx, a.slot);
        } else if (G.drawnFrom === "discard") {
          // A card taken from the discard pile must be swapped in — if the
          // player tried to throw it away, swap it for their worst known card.
          const w = worstKnown(p);
          discarded = doSwap(idx, w ? w.slot : 0);
        } else {
          const c = G.drawn; G.drawn = null;
          discardCard(idx, c);
          discarded = c;
          announce(p.name + " throws away the " + cardLabel(c) + ".", idx, "You threw away the " + cardLabel(c) + ".");
          render();
        }
        if (!alive(tok)) return;
        await maybePower(tok, idx, discarded);
        G.phase = "idle";
        render();
      }

      /* A power triggers whenever a Jack, Queen or King is discarded
         face up in the middle — and using it is MANDATORY: there is
         no use-it-or-skip-it choice. First, though, the table gets
         a snap window of about 4 seconds on the card that just
         landed (the snap window's normal length), which also gives
         the player who discarded it a moment to think. Only when
         that window closes does the power fire. */
      async function snapBeforePower(tok, idx, card) {
        if (!G.lastDiscard) return alive(tok);
        const p = G.players[idx];
        G.phase = "idle";
        announce(p.name + " discarded the " + cardLabel(card) + " — its power must be used. First, a few seconds for snaps…", idx,
          "The " + cardLabel(card) + "'s power is mandatory — there's no skipping it. First, a few seconds for the table to snap.");
        render();
        await snapWindow(tok);
        if (G && G.lastDiscard) G.lastDiscard = null;
        return alive(tok);
      }
      async function maybePower(tok, idx, discarded) {
        const pw = powerOf(discarded);
        if (!pw) return;
        if (!(await snapBeforePower(tok, idx, discarded))) { G.pendingPower = null; return; }
        if (!alive(tok)) return;
        await runPower(tok, idx, pw);
        G.pendingPower = null; G.powerStage = null;
      }

      function botResolveDrawn(idx) {
        const p = G.players[idx];
        if (!G.drawn) return null;
        const worst = worstKnown(p);
        let discarded;
        if (worst && G.drawn.value < worst.card.value) discarded = doSwap(idx, worst.slot);
        else { const c = G.drawn; G.drawn = null; discardCard(idx, c); discarded = c; }
        G.phase = "idle";
        render();
        return discarded;
      }

      /* Wait for a valid card target from a player. The Cambio caller's
         cards are immune and can never be chosen. */
      async function awaitTarget(tok, idx, valid) {
        while (alive(tok)) {
          const a = await act(idx);
          if (!alive(tok)) return null;
          if (a.type === "takeover") return null;
          if (a.type !== "target") continue;
          const card = G.players[a.p] && G.players[a.p].hand[a.slot];
          if (!card) continue;
          if (valid && !valid(a.p, a.slot, card)) continue;
          return a;
        }
        return null;
      }

      function enterHand(p, card) {
        if (p.spy.has(card.id)) { p.spy.delete(card.id); p.memory.add(card.id); }
      }
      function swapTwoCards(pa, sa, pb, sb) {
        const A = G.players[pa], B = G.players[pb];
        const ca = A.hand[sa], cb = B.hand[sb];
        if (!ca || !cb) return;
        A.hand[sa] = cb; B.hand[sb] = ca;
        enterHand(A, cb); enterHand(B, ca);
      }

      async function runPower(tok, idx, pw) {
        const p = G.players[idx];
        G.pendingPower = pw;
        G.phase = "powerTarget";
        const immune = tp => G.cambioCaller !== null && tp === G.cambioCaller;

        if (pw === "queen" || pw === "king") {
          G.powerStage = "look";
          announce(p.name + " is using a power.", idx,
            pw === "queen" ? "Queen: tap any one card on the table to look at it."
                           : "King: first, tap any one card on the table to look at it.");
          render();
          const t = await awaitTarget(tok, idx, tp => !immune(tp));
          if (!t) { G.pendingPower = null; G.powerStage = null; return; }
          const card = G.players[t.p].hand[t.slot];
          if (t.p === idx) p.memory.add(card.id); else p.spy.add(card.id);
          // The whole table sees WHICH card is being looked at — it is
          // lifted and highlighted while examined — but only the
          // player using the power sees its face.
          setFx("look", { p: t.p, slot: t.slot }, null, 2800);
          announce(p.name + " looks at " + (t.p === idx ? "one of their own cards." : "one of " + G.players[t.p].name + "'s cards."), idx,
            (t.p === idx ? "That card of yours is" : G.players[t.p].name + " has") + " the " + cardLabel(card) + ".");
          await privateReveal(tok, idx, t.p, t.slot, card);
          if (!alive(tok)) return;
          if (pw === "queen") { G.pendingPower = null; G.powerStage = null; return; }
        }

        if (pw === "jack" || pw === "king") {
          G.powerStage = "swapFirst";
          announce(p.name + " is using a power.", idx, "Now swap any two cards: tap the first card.");
          if (pw === "jack") { G.prompts[idx] = "Jack: swap any two cards — tap the first card."; }
          render();
          const t1 = await awaitTarget(tok, idx, tp => !immune(tp));
          if (!t1) { G.pendingPower = null; G.powerStage = null; return; }
          G.powerStage = "swapSecond";
          announce(p.name + " is using a power.", idx, "Now tap the second card to swap it with.");
          render();
          const t2 = await awaitTarget(tok, idx, (tp, slot) => !immune(tp) && !(tp === t1.p && slot === t1.slot));
          if (!t2) { G.pendingPower = null; G.powerStage = null; return; }
          swapTwoCards(t1.p, t1.slot, t2.p, t2.slot);
          // Both swapped cards are highlighted as they change places,
          // so the whole table can follow exactly which pair swapped.
          setFx("swap", { p: t1.p, slot: t1.slot }, { p: t2.p, slot: t2.slot }, 1700);
          const ownerName = pi => pi === idx ? "their own" : G.players[pi].name + "'s";
          announce(p.name + " swaps " + (t1.p === t2.p
            ? "two of " + ownerName(t1.p) + " cards."
            : "one of " + ownerName(t1.p) + " cards with one of " + ownerName(t2.p) + " cards."), idx,
            "Two cards have been swapped — watch the highlighted pair.");
          render();
          await wait(1350);
        }
        G.pendingPower = null; G.powerStage = null;
      }

      /* Show a card to ONE player only — never on anyone else's screen. */
      async function privateReveal(tok, viewerIdx, ownerIdx, slot, card, holdForDecision) {
        const viewer = G.players[viewerIdx];
        if (viewer && !viewer.bot) {
          // Show the card to that one player only: on the host's own
          // screen when the viewer is the host, or in that guest's
          // personal view (broadcast filters by revealViewer) when
          // the viewer is a remote guest. Never to anyone else.
          G.revealViewer = viewerIdx;
          G.reveal = new Set([card.id]);
          render();
          broadcast();
          if (!holdForDecision) { await wait(3300); G.reveal = new Set(); G.revealViewer = 0; render(); broadcast(); }
        } else if (!holdForDecision) {
          await wait(1500);
        }
      }
      function clearLocalReveal() { G.reveal = new Set(); }

      function doSwap(playerIdx, slot) {
        const p = G.players[playerIdx];
        const old = p.hand[slot];
        if (!old || !G.drawn) return;
        const inCard = G.drawn, fromDiscard = G.drawnFrom === "discard";
        p.hand[slot] = G.drawn;
        p.memory.add(G.drawn.id);
        // A card taken from the discard pile was seen by the whole
        // table — everyone now knows that player holds it.
        if (fromDiscard) notePublicCard(inCard, playerIdx);
        G.drawn = null;
        G.phase = "idle";
        discardCard(playerIdx, old);
        announce(p.name + " swaps a card; the " + cardLabel(old) + " goes on the pile.", playerIdx,
          "Swapped. The " + cardLabel(old) + " goes on the pile.");
        render();
        return old;
      }

      function discardCard(playerIdx, card) {
        G.discard.push(card);
        G.lastDiscard = { card, by: playerIdx };
        if (playerIdx === 0) blip(330);
      }

      function drawFromDeck() {
        if (!G.deck.length) {
          // Reshuffle the discard pile into a new draw pile, keeping its
          // top card in place. With an empty (or single-card) discard —
          // possible now the pile starts empty — there is nothing to
          // reshuffle, so just take what is there.
          if (G.discard.length <= 1) {
            const only = G.discard.pop();
            return only || null;
          }
          const top = G.discard.pop();
          const recycled = G.discard.slice();
          G.deck = shuffle(G.discard);
          G.discard = top ? [top] : [];
          // The recycled cards are back in the deck in unknown places —
          // nobody can know where they are any more, so every player's
          // knowledge of them is wiped (even a Hard bot's memory).
          recycled.forEach(rc => G.players.forEach(p => { p.memory.delete(rc.id); p.spy.delete(rc.id); }));
        }
        return G.deck.pop();
      }

      function callCambio(idx) {
        G.cambioCaller = idx;
        G.finalTurns = G.players.length - 1;
        G.drawn = null;
        G.phase = "idle";
        announce(G.players[idx].name + " calls CAMBIO! Everyone else gets one last turn.", null);
        blip(760);
        render();
      }

      /* ---------- snapping ----------
         At any point a player can snap a card — their own or an
         opponent's — onto the face-up card if the rank matches.
         Snapping an opponent's card means giving that opponent
         one of your own cards as a penalty. The Cambio caller's
         cards are immune. A wrong attempt just doesn't count
         (and you can't try again until the next card lands). */
      function snapTarget() { return G.discard[G.discard.length - 1]; }
      function noteTo(idx, msg) { if (G) G.prompts[idx] = msg; }

      /* The failed-snap penalty: draw a card from the draw pile and
         place it face down in the snapper's hand (filling an empty
         slot if they have one). It is deliberately NOT added to
         their memory or spy sets — they may not look at it, so it
         stays completely unknown to them, like a card never peeked. */
      function drawSnapPenalty(idx) {
        const p = G.players[idx];
        const card = drawFromDeck();
        if (!card) return null;
        const empty = p.hand.indexOf(null);
        if (empty >= 0) p.hand[empty] = card; else p.hand.push(card);
        return card;
      }

      function handleSnapAttempt(idx, tp, slot) {
        const snap = G.snap;
        if (!snap || snap.failed.has(idx) || snap.pendingGive) return;
        if (tp === G.cambioCaller) {
          noteTo(idx, G.players[tp].name + " called Cambio — their cards are immune and can't be snapped.");
          render();
          return;
        }
        const target = snapTarget();
        if (!target) return;
        const owner = G.players[tp];
        const card = owner.hand[slot];
        if (!card) return;
        if (card.rank !== target.rank) {
          // FAILED SNAP: the card is turned over for the whole table
          // to see, then goes back face down to its owner — so now
          // EVERYONE knows what it is (owner remembers it as theirs;
          // everyone else notes it in that player's hand). The player
          // who attempted the snap takes a penalty card from the draw
          // pile: face down, and they may NOT look at it.
          snap.failed.add(idx);
          owner.memory.add(card.id);
          notePublicCard(card, tp);
          const pr = { id: card.id, until: Date.now() + 2400 * settings.speed };
          G.pubReveal = pr;
          setTimeout(() => { if (G && G.pubReveal === pr) { G.pubReveal = null; render(); } }, 2450 * settings.speed);
          const pen = drawSnapPenalty(idx);
          if (idx === 0) blip(220);
          announce(
            G.players[idx].name + " tries to snap " + (tp === idx ? "their own card" : owner.name + "'s card") +
            " — it's turned over: the " + cardLabel(card) + ", not a " + target.rank + "! It goes back to " + owner.name +
            ", and " + G.players[idx].name + " takes a penalty card from the draw pile, face down." + (pen ? "" : " (The draw pile was empty, so no penalty card.)"),
            idx,
            "Your snap missed — that card was the " + cardLabel(card) + ", not a " + target.rank + ". It goes back to " + owner.name +
            ", everyone saw it, and you take a penalty card from the draw pile. It stays face down — you can't look at it."
          );
          render();
          pokeSnapTimer(3600); // leave time for the table to take in the turned-over card
          return;
        }
        owner.hand[slot] = null;
        G.discard.push(card);
        G.lastSnapId = card.id; G.lastSnapAt = Date.now();
        owner.memory.delete(card.id);
        if (idx === 0) blip(880);
        if (tp === idx) {
          announce(G.players[idx].name + " snaps their own " + cardLabel(card) + "!", idx,
            "Snap! Your " + cardLabel(card) + " matches — it's gone.");
          render();
          pokeSnapTimer(2900);
        } else {
          announce(G.players[idx].name + " snaps " + owner.name + "'s " + cardLabel(card) + "!", null);
          render();
          if (G.players[idx].bot) {
            givePenaltyCard(idx, tp, slot);
            pokeSnapTimer(2900);
          } else {
            snap.pendingGive = { idx, tp, slot };
            noteTo(idx, "You snapped " + owner.name + "'s card! Now tap one of YOUR cards to give to " + owner.name + " as a penalty.");
            render();
            pokeSnapTimer(6000);
          }
        }
      }

      function givePenaltyCard(fromIdx, toIdx, toSlot) {
        const from = G.players[fromIdx], to = G.players[toIdx];
        const worst = worstKnown(from);
        const slot = worst ? worst.slot : randomSlot(from, () => true);
        if (slot < 0) return;
        const given = from.hand[slot];
        from.hand[slot] = null;
        to.hand[toSlot] = given;
        enterHand(to, given);
        announce(G.players[fromIdx].name + " gives " + to.name + " a card as a penalty.", fromIdx,
          "You gave " + to.name + " your " + cardLabel(given) + ".");
        render();
      }

      function resolveGive(idx, slot) {
        const snap = G.snap;
        if (!snap || !snap.pendingGive || snap.pendingGive.idx !== idx) return;
        const tp = snap.pendingGive.tp, toSlot = snap.pendingGive.slot;
        const from = G.players[idx];
        const given = from.hand[slot];
        if (!given) return;
        from.hand[slot] = null;
        G.players[tp].hand[toSlot] = given;
        enterHand(G.players[tp], given);
        snap.pendingGive = null;
        announce(G.players[idx].name + " gives " + G.players[tp].name + " a card as a penalty.", idx,
          "You gave " + G.players[tp].name + " your " + cardLabel(given) + ".");
        render();
        pokeSnapTimer(2300);
      }

      function pokeSnapTimer(ms) {
        const snap = G.snap;
        if (!snap) return;
        if (snap.timer) clearTimeout(snap.timer);
        snap.timer = setTimeout(() => {
          if (!G || G.snap !== snap) return;
          if (snap.pendingGive) {
            const pg = snap.pendingGive;
            snap.pendingGive = null;
            givePenaltyCard(pg.idx, pg.tp, pg.slot);
          }
          G.snap = null;
          G.phase = snap.prevPhase;
          snap.resolve();
        }, ms * settings.speed);
      }

      function scheduleBotSnaps(tok) {
        const cfg = diffCfg();
        G.players.forEach((p, i) => {
          if (!p.bot) return;
          botForget(p); // Easy / Moderate bots may have forgotten a match by now
          setTimeout(() => {
            if (!alive(tok) || !G.snap || G.snap.failed.has(i) || G.snap.pendingGive) return;
            const target = snapTarget();
            if (!target) return;
            let tp = -1, slot = -1;
            const ownSlot = p.hand.findIndex(c => c && c.rank === target.rank && knowsCard(p, c));
            if (ownSlot >= 0) { tp = i; slot = ownSlot; }
            else {
              for (let j = 0; j < G.players.length; j++) {
                if (j === i || j === G.cambioCaller) continue;
                const s = G.players[j].hand.findIndex(c => c && c.rank === target.rank && knowsCard(p, c));
                if (s >= 0) { tp = j; slot = s; break; }
              }
            }
            if (tp >= 0) {
              if (Math.random() < cfg.snapChance) handleSnapAttempt(i, tp, slot);
            } else if (Math.random() < cfg.guessChance) {
              // Easy (and rarely Moderate) bots sometimes snap on a
              // hunch — a card they don't actually know. It usually
              // fails, turns the card over for everyone to see, and
              // costs them a penalty card. Hard bots never guess.
              const options = [];
              G.players.forEach((q, j) => {
                if (j === G.cambioCaller) return;
                q.hand.forEach((c, s) => { if (c) options.push({ p: j, slot: s }); });
              });
              if (options.length) {
                const g = options[Math.floor(Math.random() * options.length)];
                handleSnapAttempt(i, g.p, g.slot);
              }
            }
          }, (cfg.snapDelayMin + Math.random() * cfg.snapDelayVar) * settings.speed);
        });
      }

      function snapWindow(tok) {
        return new Promise(resolve => {
          if (!alive(tok)) { resolve(); return; }
          const target = snapTarget();
          if (!target) { resolve(); return; }
          const prevPhase = G.phase;
          G.phase = "snap";
          G.snap = { failed: new Set(), pendingGive: null, resolve, timer: null, prevPhase };
          // No snap reminder message: the window opens quietly after a
          // card lands, and players who spot a match can still tap to snap.
          G.prompts = {};
          render();
          scheduleBotSnaps(tok);
          pokeSnapTimer(3800);
        });
      }

      /* ============================================================
         BOT BRAIN
         Three skill levels. Easy is the old casual bot: forgetful,
         slow to snap, occasionally guesses. Moderate remembers most
         of what it sees and snaps quicker. Hard NEVER forgets a card
         it has seen — knowledge is kept by card id, and every public
         sighting is recorded (cards taken openly from the discard
         pile, cards turned over by failed snaps, cards it has spied
         on), so a Hard bot keeps track of those cards even as they
         are swapped around the table — and it snaps almost at once.
         ============================================================ */
      const DIFF_LEVELS = {
        easy:     { snapChance: 0.45, snapDelayMin: 1350, snapDelayVar: 1700, guessChance: 0.16, forget: 0.15, cambioMax: 7, cambioChance: 0.7,  takeMax: 4, takeChance: 0.6,  gambleMax: 2 },
        moderate: { snapChance: 0.75, snapDelayMin: 750,  snapDelayVar: 1100, guessChance: 0.05, forget: 0.04, cambioMax: 5, cambioChance: 0.85, takeMax: 5, takeChance: 0.85, gambleMax: 3 },
        hard:     { snapChance: 0.98, snapDelayMin: 320,  snapDelayVar: 550,  guessChance: 0,    forget: 0,    cambioMax: 4, cambioChance: 0.95, takeMax: 9, takeChance: 0.95, gambleMax: 4 }
      };
      function diffCfg() { return DIFF_LEVELS[settings.difficulty] || DIFF_LEVELS.easy; }
      /* A bot's knowledge of a card, wherever it currently sits:
         its own remembered cards (memory) plus cards it has seen in
         other hands (spy). Because both are keyed by card id, the
         knowledge follows the card when it is swapped around. */
      function knowsCard(p, card) { return !!card && (p.memory.has(card.id) || p.spy.has(card.id)); }
      /* Easy and Moderate bots forget: each card they know has a
         chance of slipping their mind. Hard bots never forget. */
      function botForget(p) {
        const f = diffCfg().forget;
        if (!f) return;
        for (const id of Array.from(p.memory)) if (Math.random() < f) p.memory.delete(id);
        for (const id of Array.from(p.spy)) if (Math.random() < f) p.spy.delete(id);
      }
      /* Something the whole table saw: a card taken openly from the
         discard pile, or a card turned over by a failed snap. Record
         it for every other player — in their spy set, so the memory
         aid can remind them and bots can act on it. */
      function notePublicCard(card, holderIdx) {
        if (!card) return;
        G.players.forEach((q, qi) => { if (qi !== holderIdx) q.spy.add(card.id); });
      }
      /* Power effects for the table to see: which card is being
         looked at (Queen / King), and which two cards were swapped
         (Jack / King). Renderers highlight them with an animation. */
      function setFx(kind, a, b, ms) {
        if (!G) return;
        G.fxSeq = (G.fxSeq || 0) + 1;
        G.fx = { id: G.fxSeq, kind, p: a.p, slot: a.slot, p2: b ? b.p : -1, slot2: b ? b.slot : -1, until: Date.now() + ms * settings.speed };
      }
      function knownCards(p) {
        const out = [];
        p.hand.forEach((c, i) => { if (c && knowsCard(p, c)) out.push({ slot: i, card: c }); });
        return out;
      }
      function handSum(p) { return p.hand.reduce((s, c) => s + (c ? c.value : 0), 0); }
      function worstKnown(p) {
        const k = knownCards(p);
        if (!k.length) return null;
        return k.reduce((a, b) => (b.card.value > a.card.value ? b : a));
      }
      function randomSlot(p, filter) {
        const idxs = p.hand.map((c, i) => (c && (!filter || filter(c, i)) ? i : -1)).filter(i => i >= 0);
        return idxs.length ? idxs[Math.floor(Math.random() * idxs.length)] : -1;
      }

      async function botTurn(tok, idx) {
        const p = G.players[idx];
        const cfg = diffCfg();
        botForget(p); // Easy / Moderate bots may start their turn having forgotten cards
        G.phase = "bot";
        announce(p.name + " is thinking…", null);
        render();
        await wait(1200);
        if (!alive(tok)) return;
        if (G.drawn) {
          const d = botResolveDrawn(idx);
          if (d) await botPower(tok, idx, powerOf(d));
          G.phase = "idle";
          return;
        }

        const allKnown = p.hand.every(c => !c || knowsCard(p, c));
        const sum = handSum(p);
        if (G.cambioCaller === null && allKnown && sum <= cfg.cambioMax && Math.random() < cfg.cambioChance) {
          callCambio(idx);
          await wait(1050);
          return;
        }

        // Bots will take the top discard when it's clearly good for them —
        // it's public, but a low card is worth the risk of being snapped.
        // Sharper bots take it more readily and for bigger improvements.
        const topDisc = G.discard[G.discard.length - 1];
        const bw = worstKnown(p);
        const unkSlot = randomSlot(p, card => !knowsCard(p, card));
        let takeSlot = -1;
        if (topDisc) {
          if (bw && topDisc.value < bw.card.value) takeSlot = bw.slot;
          else if (unkSlot >= 0 && topDisc.value <= 3) takeSlot = unkSlot;
        }
        let c;
        if (topDisc && takeSlot >= 0 && topDisc.value <= cfg.takeMax && Math.random() < cfg.takeChance) {
          c = G.discard.pop();
          G.drawn = c; G.drawnFrom = "discard";
          announce(p.name + " picks up the " + cardLabel(c) + " from the discard pile — everyone saw it.", null);
          render();
          await wait(950);
          if (!alive(tok)) return;
          const takenDiscarded = doSwap(idx, takeSlot);
          await wait(850);
          if (!alive(tok)) return;
          await botPower(tok, idx, powerOf(takenDiscarded));
          G.phase = "idle";
          return;
        }

        c = drawFromDeck();
        G.drawn = c; G.drawnFrom = "deck";
        render();
        await wait(950);
        if (!alive(tok)) return;

        const w2 = worstKnown(p);
        const unknownSlot = randomSlot(p, card => !knowsCard(p, card));
        let swapSlot = -1;
        if (w2 && c.value < w2.card.value) swapSlot = w2.slot;
        else if (c.value <= cfg.gambleMax && unknownSlot >= 0) swapSlot = unknownSlot;
        else if (c.value <= 1 && w2) swapSlot = w2.slot;

        let discarded = null;
        if (swapSlot >= 0) {
          discarded = doSwap(idx, swapSlot);
        } else {
          G.drawn = null;
          discardCard(idx, c);
          discarded = c;
          announce(p.name + " draws and throws away the " + cardLabel(c) + ".", null);
          render();
        }
        await wait(850);
        if (!alive(tok)) return;
        await botPower(tok, idx, powerOf(discarded));
        G.phase = "idle";
      }

      async function botPower(tok, idx, pw) {
        if (!pw || !alive(tok)) return;
        // Powers are mandatory for computer players too, with the
        // same snap window on the card they just discarded before
        // the power fires.
        const landed = G.lastDiscard && G.lastDiscard.card;
        if (landed && powerOf(landed) === pw) {
          if (!(await snapBeforePower(tok, idx, landed))) return;
        }
        const p = G.players[idx];
        const cfg = diffCfg();
        const hard = settings.difficulty === "hard";
        const immune = tp => G.cambioCaller !== null && tp === G.cambioCaller;
        const others = G.players.map((q, i) => i).filter(i => i !== idx && !immune(i));
        // A card in an opponent's hand that this bot KNOWS is low —
        // only a bot that remembers what it has seen can target one.
        const knownLowTarget = maxVal => {
          for (const oi of others) {
            const s = G.players[oi].hand.findIndex(c => c && knowsCard(p, c) && c.value <= maxVal);
            if (s >= 0) return { p: oi, slot: s, card: G.players[oi].hand[s] };
          }
          return null;
        };
        if (pw === "queen") {
          let looked = false;
          // Hard bots complete their own knowledge first — knowing all
          // four of their own cards is what lets them call Cambio early.
          if (hard) {
            const s = randomSlot(p, c => !knowsCard(p, c));
            if (s >= 0) {
              p.memory.add(p.hand[s].id);
              setFx("look", { p: idx, slot: s }, null, 2400);
              announce(p.name + " uses the Queen to look at one of their own cards.", null);
              looked = true;
            }
          }
          if (!looked) {
            for (const oi of others) {
              const s = randomSlot(G.players[oi], c => !knowsCard(p, c));
              if (s >= 0) {
                p.spy.add(G.players[oi].hand[s].id);
                setFx("look", { p: oi, slot: s }, null, 2400);
                announce(p.name + " uses the Queen to look at one of " + G.players[oi].name + "'s cards.", null);
                looked = true; break;
              }
            }
          }
          if (!looked && !hard) {
            const s = randomSlot(p, c => !knowsCard(p, c));
            if (s >= 0) {
              p.memory.add(p.hand[s].id);
              setFx("look", { p: idx, slot: s }, null, 2400);
              announce(p.name + " uses the Queen to look at one of their own cards.", null);
              looked = true;
            }
          }
          if (looked) { render(); await wait(1150); if (!alive(tok)) return; }
        } else if (pw === "jack") {
          const worst = worstKnown(p);
          const mySlot = worst ? worst.slot : randomSlot(p, () => true);
          if (mySlot >= 0 && others.length) {
            // Sharper bots swap their worst card for a specific low
            // card they remember seeing in an opponent's hand.
            const low = hard ? knownLowTarget(2) : (settings.difficulty === "moderate" && Math.random() < 0.6 ? knownLowTarget(1) : null);
            if (low && worst && low.card.value < worst.card.value) {
              swapTwoCards(idx, mySlot, low.p, low.slot);
              setFx("swap", { p: idx, slot: mySlot }, { p: low.p, slot: low.slot }, 1600);
              announce(p.name + " uses the Jack to swap one of their cards with one of " + G.players[low.p].name + "'s.", null);
            } else {
              const oi = others[Math.floor(Math.random() * others.length)];
              const ts = randomSlot(G.players[oi], () => true);
              if (ts >= 0) {
                swapTwoCards(idx, mySlot, oi, ts);
                setFx("swap", { p: idx, slot: mySlot }, { p: oi, slot: ts }, 1600);
                announce(p.name + " uses the Jack to swap one of their cards with one of " + G.players[oi].name + "'s.", null);
              }
            }
          }
        } else if (pw === "king") {
          if (others.length) {
            // Sharper bots look at a card they don't know yet rather
            // than wasting the look on one they already know.
            let oi = others[Math.floor(Math.random() * others.length)];
            let ts = -1;
            if (!hard && settings.difficulty !== "moderate") ts = randomSlot(G.players[oi], () => true);
            else {
              for (const cand of others) { const s = randomSlot(G.players[cand], c => !knowsCard(p, c)); if (s >= 0) { oi = cand; ts = s; break; } }
              if (ts < 0) ts = randomSlot(G.players[oi], () => true);
            }
            const worst = worstKnown(p);
            if (ts >= 0) {
              const theirs = G.players[oi].hand[ts];
              p.spy.add(theirs.id);
              setFx("look", { p: oi, slot: ts }, null, 2400);
              announce(p.name + " uses the King to look at one of " + G.players[oi].name + "'s cards.", null);
              render();
              await wait(1150);
              if (!alive(tok)) return;
              if (worst && theirs.value < worst.card.value) {
                swapTwoCards(idx, worst.slot, oi, ts);
                setFx("swap", { p: idx, slot: worst.slot }, { p: oi, slot: ts }, 1600);
                announce(p.name + " uses the King to swap one of their cards with one of " + G.players[oi].name + "'s.", null);
              } else if (worst && hard) {
                // No luck with the look — but a Hard bot may already
                // know a low card somewhere else worth taking.
                const low = knownLowTarget(2);
                if (low && low.card.value < worst.card.value) {
                  swapTwoCards(idx, worst.slot, low.p, low.slot);
                  setFx("swap", { p: idx, slot: worst.slot }, { p: low.p, slot: low.slot }, 1600);
                  announce(p.name + " uses the King to swap one of their cards with one of " + G.players[low.p].name + "'s.", null);
                }
              } else if (worst && Math.random() < 0.5) {
                const oi2 = others[Math.floor(Math.random() * others.length)];
                const ts2 = randomSlot(G.players[oi2], () => true);
                if (ts2 >= 0) {
                  swapTwoCards(idx, worst.slot, oi2, ts2);
                  setFx("swap", { p: idx, slot: worst.slot }, { p: oi2, slot: ts2 }, 1600);
                  announce(p.name + " uses the King to swap one of their cards with one of " + G.players[oi2].name + "'s.", null);
                }
              }
            }
          }
        }
        render();
        await wait(1100);
      }

      /* ============================================================
         ROUND END / SCORING
         ============================================================ */
      function endRound() {
        G.phase = "over";
        G.revealAll = true;
        G.reveal = new Set();
        const scores = G.players.map(p => handSum(p));
        const counts = G.players.map(p => p.hand.filter(Boolean).length);
        scores.forEach((s, i) => G.totals[i] += s);
        // Winner: lowest score. Tie-break: MOST cards remaining wins;
        // if card counts are also equal, the Cambio caller loses the tie.
        const lowest = Math.min.apply(null, scores);
        let winners = G.players.map((p, i) => i).filter(i => scores[i] === lowest);
        let tieNote = "";
        if (winners.length > 1) {
          const maxCards = Math.max.apply(null, winners.map(i => counts[i]));
          const byCards = winners.filter(i => counts[i] === maxCards);
          if (byCards.length < winners.length) tieNote = "Tie-break: most cards remaining (" + maxCards + ") wins.";
          winners = byCards;
          if (winners.length > 1 && G.cambioCaller !== null && winners.indexOf(G.cambioCaller) >= 0) {
            winners = winners.filter(i => i !== G.cambioCaller);
            tieNote = "Tie-break: equal scores and equal cards — the Cambio caller loses the tie.";
          } else if (winners.length > 1) {
            tieNote = "A dead tie — the round is shared.";
          }
        }
        const data = {
          round: G.round, scores, counts, totals: G.totals.slice(),
          winners, tieNote, cambioCaller: G.cambioCaller,
          players: G.players.map(p => ({ name: p.name, cards: p.hand.filter(Boolean).map(cardLabel) }))
        };
        G.lastScore = data;
        render();
        broadcast();
        showScoreModal(data, true);
        blip(660);
      }

      function showScoreModal(data, canControl) {
        const winnerNames = data.winners.map(i => data.players[i].name).join(" and ");
        $("#score-title").textContent = data.winners.length > 1
          ? "Round " + data.round + " — shared by " + winnerNames
          : "Round " + data.round + " — " + winnerNames + " wins";
        $("#score-sub").textContent =
          (data.cambioCaller !== null && data.cambioCaller !== undefined
            ? data.players[data.cambioCaller].name + " called Cambio. "
            : "") + (data.tieNote || "") +
          " Lowest total overall so far: " + data.players[data.totals.indexOf(Math.min.apply(null, data.totals))].name + ".";
        const body = $("#score-body"); body.innerHTML = "";
        data.players.forEach((p, i) => {
          const tr = document.createElement("tr");
          if (data.winners.indexOf(i) >= 0) tr.className = "winner";
          const td1 = document.createElement("td"); td1.textContent = p.name + (i === data.cambioCaller ? " (called Cambio)" : "");
          const td2 = document.createElement("td"); td2.className = "mini-cards"; td2.textContent = p.cards.join(", ") || "no cards left";
          const td3 = document.createElement("td"); td3.className = "num"; td3.textContent = data.scores[i];
          const td4 = document.createElement("td"); td4.className = "num"; td4.textContent = data.totals[i];
          tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3); tr.appendChild(td4);
          body.appendChild(tr);
        });
        $("#score-next").textContent = "Next round";
        $("#score-btns").style.display = canControl ? "" : "none";
        $("#score-wait").hidden = !!canControl;
        setTimeout(() => $("#score-overlay").classList.add("open"), 700);
      }
      $("#score-next").addEventListener("click", () => {
        $("#score-overlay").classList.remove("open");
        if (!G) return;
        newRound(session);
      });
      $("#score-home").addEventListener("click", () => { endSession(); show("home"); });

      /* In a practice game there is nothing to send anywhere. In an
         online game the host is authoritative: after every move it
         sends each remote guest a personal view of the table (their
         own known cards visible, everyone else's hidden except what
         the rules let them see). Defined in the online section. */
      function broadcast() { if (typeof broadcastOnline === "function") broadcastOnline(); }

      /* ============================================================
         RENDERING (host / practice view — you are player 0)
         ============================================================ */
      function setControls(btns) {
        const host = $("#controls"); host.innerHTML = "";
        for (const b of btns) {
          const btn = document.createElement("button");
          btn.className = "btn " + (b.cls || "");
          btn.textContent = b.label;
          if (b.disabled) btn.disabled = true;
          btn.addEventListener("click", b.fn);
          host.appendChild(btn);
        }
      }

      function cardEl(card, opts) {
        opts = opts || {};
        const d = document.createElement("div");
        if (!card) {
          d.className = "card empty";
          if (opts.emptyLabel) {
            const lab = document.createElement("span"); lab.className = "empty-label";
            lab.textContent = opts.emptyLabel; d.appendChild(lab);
          }
          return d;
        }
        if (card.hidden || !opts.faceUp) {
          d.className = "card back";
        } else {
          d.className = "card" + (card.red ? " red" : "") + (card.rank === "JOKER" ? " joker" : "");
          const corner = document.createElement("span"); corner.className = "corner";
          corner.textContent = card.rank === "JOKER" ? "★" : card.rank;
          const big = document.createElement("span"); big.className = "big";
          big.textContent = card.rank === "JOKER" ? "★" : card.suit;
          const rankUnder = document.createElement("span");
          rankUnder.style.cssText = "position:absolute;bottom:4px;left:0;right:0;text-align:center;font-size:12px;";
          rankUnder.textContent = card.rank === "JOKER" ? "JOKER" : card.rank;
          d.appendChild(corner); d.appendChild(big); d.appendChild(rankUnder);
        }
        if (opts.chip) {
          const chip = document.createElement("span"); chip.className = "known-chip";
          chip.textContent = opts.chip; d.appendChild(chip);
        }
        if (opts.tappable) { d.classList.add("tappable"); d.setAttribute("role", "button"); }
        if (opts.onClick) d.addEventListener("click", opts.onClick);
        return d;
      }

      function localCanTap(pIdx, slot) {
        if (!G) return false;
        if (G.phase === "snap") {
          if (!G.snap || G.snap.failed.has(0)) return false;
          if (G.snap.pendingGive) return G.snap.pendingGive.idx === 0 && pIdx === 0;
          return pIdx !== G.cambioCaller; // any card on the table except the caller's (immune)
        }
        if (G.turn !== 0) return false;
        if (G.phase === "chooseSwap") return pIdx === 0;
        if (G.phase === "powerTarget") {
          if (G.powerStage === "look" || G.powerStage === "swapFirst" || G.powerStage === "swapSecond")
            return pIdx !== G.cambioCaller;
          return false;
        }
        return false;
      }
      function localCardAction(pIdx, slot) {
        if (!G) return;
        if (G.phase === "snap") {
          if (G.snap && G.snap.pendingGive && G.snap.pendingGive.idx === 0) submitAction(0, { type: "give", slot });
          else submitAction(0, { type: "snap", p: pIdx, slot });
          return;
        }
        if (G.phase === "chooseSwap" && pIdx === 0) submitAction(0, { type: "swap", slot });
        else if (G.phase === "powerTarget") submitAction(0, { type: "target", p: pIdx, slot });
      }

      /* Animation tracking: remember which card sat where last render so a
         changed card can be animated travelling into its new spot. */
      const animPrev = { discardId: null, drawnId: null, hands: {} };
      const animPrevC = { discardId: null, drawnId: null, hands: {} };
      function noteHandAnim(prev, pIdx, slot, card, el) {
        const key = pIdx + "-" + slot;
        const id = card ? card.id : null;
        if (prev.hands[key] !== undefined && prev.hands[key] !== null && id !== null && prev.hands[key] !== id)
          el.classList.add("anim-swapin");
        prev.hands[key] = id;
      }
      function setTurnBanner(isYours, text) {
        const banner = $("#turn-banner");
        if (!text) { banner.className = "turn-banner"; return; }
        banner.className = "turn-banner show" + (isYours ? " yours" : "");
        $("#turn-banner-text").textContent = text;
      }

      /* Clockwise turn-order strip: lists players in the order turns pass
         (player index order, which is clockwise around the table), with
         arrows between them and a loop arrow back to the first player. */
      function renderTurnOrder(names, turnIdx, youIdx, isOver) {
        const host = $("#turn-order");
        if (!host) return;
        host.innerHTML = "";
        const label = document.createElement("span");
        label.className = "to-label";
        const cw = document.createElement("span"); cw.className = "cw-arrow"; cw.textContent = "↻";
        const lt = document.createElement("span"); lt.textContent = "Clockwise";
        label.appendChild(cw); label.appendChild(lt);
        host.appendChild(label);
        names.forEach((name, i) => {
          const chip = document.createElement("span");
          chip.className = "to-name" + (i === turnIdx && !isOver ? " active" : "") + (i === youIdx ? " you-name" : "");
          chip.textContent = name + (i === youIdx ? " (you)" : "");
          host.appendChild(chip);
          if (i < names.length - 1) {
            const ar = document.createElement("span"); ar.className = "to-arrow"; ar.textContent = "→";
            host.appendChild(ar);
          }
        });
        const loop = document.createElement("span"); loop.className = "to-loop"; loop.textContent = "↩";
        loop.title = "Then back to the first player — clockwise";
        host.appendChild(loop);
      }

      const dealSeen = new Set(), dealSeenC = new Set();
      const flipSeen = new Set(), flipSeenC = new Set();
      const fxSeen = new Set(), fxSeenC = new Set();
      /* Power-effect highlight: the animation class for a card the
         first time a given look/swap effect touches it (the seen set
         stops re-renders restarting the animation). Face-up cards
         skip it — the flip animation already shows them being read. */
      function fxClassFor(fx, active, pIdx, slot, seen, faceUp) {
        if (!fx || !active || faceUp) return "";
        const hit = fx.kind === "look"
          ? (fx.p === pIdx && fx.slot === slot)
          : ((fx.p === pIdx && fx.slot === slot) || (fx.p2 === pIdx && fx.slot2 === slot));
        if (!hit) return "";
        const key = fx.id + "-" + pIdx + "-" + slot;
        if (seen.has(key)) return "";
        seen.add(key);
        return fx.kind === "look" ? "fx-look" : "fx-swap";
      }
      /* Flip/bend a card the first time it is turned face-up to be
         looked at; forget it once it goes face-down again so the
         next look flips it afresh. */
      function maybeFlipAnim(seen, el, card, shouldFlip) {
        if (!card || !card.id) return;
        if (!shouldFlip) { seen.delete(card.id); return; }
        if (seen.has(card.id)) return;
        seen.add(card.id);
        el.classList.add("anim-flip");
      }
      /* The CAMBIO! stamp slams in once per call (per round + caller),
         then renders settled so re-renders don't slam it again. */
      let cambioStampKey = null;
      function makeCambioStamp(key) {
        const el = document.createElement("div");
        el.className = "cambio-stamp" + (cambioStampKey === key ? " settled" : "");
        cambioStampKey = key;
        el.textContent = "CAMBIO!";
        el.setAttribute("aria-label", "Cambio called — this player's cards are immune");
        return el;
      }
      function makeImmuneBadge() {
        const el = document.createElement("div");
        el.className = "immune-badge";
        el.textContent = "Immune — can't be swapped, looked at or snapped";
        return el;
      }
      function maybeDealAnim(seen, el, card, order) {
        if (!card || seen.has(card.id)) return;
        seen.add(card.id);
        el.classList.add("anim-deal");
        el.style.animationDelay = (order * 175) + "ms";
      }
      /* Shared builder for the draw-to-go-first panel. opts:
         names, fd (normalised), viewerIdx, onPick(fanIdx) or null */
      function buildFirstDrawPanel(opts) {
        const panel = $("#first-draw-panel");
        const fd = opts.fd;
        if (!fd || !fd.active) { panel.hidden = true; panel.innerHTML = ""; return; }
        panel.hidden = false; panel.innerHTML = "";
        const h = document.createElement("h3"); h.textContent = "Draw to go first" + (fd.drawNo > 1 ? " — tie-break draw " + fd.drawNo : "");
        panel.appendChild(h);
        const expl = document.createElement("p");
        expl.textContent = "Each player picks one card from the fanned-out face-down deck. All picks are revealed together and the best card goes first — best is the LOWEST Cambio value: red King −1 is best, then Joker 0, Ace 1, 2, 3 … up to 10, Jack, Queen and black King (10), the worst. If there's a tie for best, only the tied players draw again.";
        panel.appendChild(expl);
        const st = document.createElement("p"); st.className = "fd-status";
        if (fd.revealed && fd.winner !== null && fd.winner !== undefined) st.textContent = opts.names[fd.winner] + " drew the best card and goes first — dealing 4 cards each…";
        else if (fd.revealed) st.textContent = "Revealed! Ranking, best first:";
        else if (opts.isContender && !opts.hasPicked) st.textContent = "Your pick — tap one face-down card in the fan.";
        else if (opts.isContender && opts.hasPicked) st.textContent = "You've picked — waiting for the others, then all cards reveal together.";
        else st.textContent = "Tie-break: the tied players are picking — watch for the reveal.";
        panel.appendChild(st);
        if (!fd.revealed) {
          const fan = document.createElement("div"); fan.className = "fan";
          for (let fi = 0; fi < fd.fanCount; fi++) {
            const takenBy = fd.takenBy ? fd.takenBy[fi] : undefined;
            const isMine = takenBy !== undefined && Number(takenBy) === opts.viewerIdx;
            const el = cardEl({ hidden: true }, {});
            if (takenBy !== undefined) el.classList.add("taken");
            if (isMine) el.classList.add("mine");
            const canPick = opts.onPick && opts.isContender && !opts.hasPicked && takenBy === undefined;
            if (canPick) { el.classList.add("tappable"); el.setAttribute("role", "button"); const idx = fi; el.addEventListener("click", () => opts.onPick(idx)); }
            fan.appendChild(el);
          }
          panel.appendChild(fan);
        }
        const ul = document.createElement("ul"); ul.className = "fd-picks";
        const rows = fd.revealed && fd.ranking && fd.ranking.length
          ? fd.ranking.map((r, ri) => ({ player: r.player, label: "#" + (ri + 1) + "  " + opts.names[r.player], card: r.card, value: r.value, winner: fd.bestValue !== null && r.value === fd.bestValue }))
          : fd.contenders.map(pi => ({ player: pi, label: opts.names[pi], card: null, value: null, winner: false }));
        for (const row of rows) {
          const li = document.createElement("li");
          if (row.winner && fd.revealed) li.className = "winner";
          const a = document.createElement("span"); a.textContent = row.label + (row.player === opts.viewerIdx ? " (you)" : "");
          const b = document.createElement("span"); b.className = "fd-card";
          if (fd.revealed && row.card) b.textContent = cardLabel(row.card) + " · value " + row.value + (row.winner ? " — best, goes first" : "");
          else b.textContent = (fd.takenBy && Object.keys(fd.takenBy).some(k => Number(fd.takenBy[k]) === row.player)) || row.hasPicked ? "Picked ✓" : "Choosing…";
          li.appendChild(a); li.appendChild(b); ul.appendChild(li);
        }
        panel.appendChild(ul);
      }

      function render() {
        if (!G) return;
        renderTurnOrder(G.players.map(p => p.name), G.turn, 0, G.phase === "over");
        (function(){
          const fd = G.firstDraw;
          buildFirstDrawPanel({
            names: G.players.map(p => p.name), viewerIdx: 0,
            isContender: !!fd && fd.contenders.indexOf(0) >= 0,
            hasPicked: !!fd && !!fd.picks[0],
            onPick: fi => submitAction(0, { type: "firstPick", fanIdx: fi }),
            fd: !fd ? null : {
              active: G.phase === "firstDraw", drawNo: fd.drawNo, contenders: fd.contenders,
              fanCount: fd.fan ? fd.fan.length : 0, takenBy: fd.takenBy, revealed: !!fd.revealed,
              winner: fd.winner, bestValue: fd.bestValue,
              ranking: fd.revealed && fd.ranking ? fd.ranking.map(pi => ({ player: pi, card: fd.picks[pi], value: fd.picks[pi].value })) : []
            }
          });
        })();
        $("#round-label").textContent = "Round " + G.round + (G.code ? " · Table " + G.code : "");
        $("#memory-chip").textContent = "Memory aid: " + (G.memoryAid === false ? "Off" : "On");
        $("#you-name").textContent = G.players[0].name + " (you)";
        if (G.turn === 0 && G.phase !== "over" && G.phase !== "peek") {
          const b = document.createElement("span"); b.className = "turn-badge"; b.textContent = "Your turn";
          $("#you-name").appendChild(b);
        }
        if (G.phase === "over") setTurnBanner(false, "");
        else if (G.phase === "firstDraw") setTurnBanner(false, "Draw to go first — pick a card from the fan");
        else if (G.phase === "peek") setTurnBanner(false, "Memorise your two nearest cards");
        else if (G.phase === "snap") setTurnBanner(false, "");
        else setTurnBanner(G.turn === 0, G.turn === 0 ? "Your turn" : G.players[G.turn].name + "'s turn");
        const statusEl = $("#status");
        statusEl.textContent = displayStatusFor(0);
        statusEl.className = "status";

        const totals = $("#totals"); totals.innerHTML = "";
        const minTotal = Math.min.apply(null, G.totals);
        G.players.forEach((p, i) => {
          const chip = document.createElement("span");
          chip.className = "chip" + (G.totals[i] === minTotal ? " leader" : "");
          chip.textContent = p.name + ": " + G.totals[i];
          totals.appendChild(chip);
        });

        const opps = $("#opponents"); opps.innerHTML = "";
        G.players.forEach((p, i) => {
          if (i === 0) return;
          const zone = document.createElement("div");
          zone.className = "player-zone" + (G.turn === i && G.phase !== "over" ? " active" : "") + (G.cambioCaller === i ? " cambio-immune" : "");
          const name = document.createElement("div"); name.className = "pname";
          name.textContent = p.name;
          if (G.turn === i && G.phase !== "over") { const b = document.createElement("span"); b.className = "turn-badge"; b.textContent = "Turn"; name.appendChild(b); }
          if (G.turn === i && G.phase === "bot") { const th = document.createElement("span"); th.className = "thinking"; th.textContent = " · thinking…"; name.appendChild(th); }
          if (G.cambioCaller === i) { const th = document.createElement("span"); th.className = "thinking"; th.textContent = " · called Cambio!"; name.appendChild(th); }
          zone.appendChild(name);
          const hand = document.createElement("div");
          hand.className = "hand" + (p.hand.length > 4 ? " wide" : "");
          p.hand.forEach((c, s) => {
            const faceUp = c && (G.revealAll || ((G.revealViewer === undefined || G.revealViewer === 0) && G.reveal.has(c.id)) || (G.pubReveal && G.pubReveal.id === c.id && Date.now() < G.pubReveal.until));
            const chip = c && !faceUp && G.memoryAid !== false && G.players[0].spy.has(c.id) ? cardLabel(c) : null;
            const tappable = localCanTap(i, s);
            const el = cardEl(c, { faceUp, chip, tappable, onClick: () => localCardAction(i, s) });
            const fxc = fxClassFor(G.fx, G.fx && Date.now() < G.fx.until, i, s, fxSeen, faceUp);
            if (fxc) el.classList.add(fxc);
            if (G.phase === "peek" && c) maybeDealAnim(dealSeen, el, c, ((i - G.starter + G.players.length) % G.players.length) * 4 + s);
            else { noteHandAnim(animPrev, i, s, c, el); maybeFlipAnim(flipSeen, el, c, !!faceUp); }
            hand.appendChild(el);
          });
          zone.appendChild(hand);
          if (G.cambioCaller === i) { zone.appendChild(makeCambioStamp(G.round + "-" + i)); zone.appendChild(makeImmuneBadge()); }
          opps.appendChild(zone);
        });

        const deckHost = $("#deck-pile"); deckHost.innerHTML = "";
        const deckCard = cardEl(G.deck.length ? { hidden: true } : null, {});
        const canDraw = G.turn === 0 && G.phase === "chooseSource";
        if (canDraw && G.deck.length) { deckCard.classList.add("tappable"); deckCard.addEventListener("click", () => submitAction(0, { type: "drawDeck" })); }
        deckHost.appendChild(deckCard);

        const discHost = $("#discard-pile"); discHost.innerHTML = "";
        const top = G.discard[G.discard.length - 1];
        const discEl = cardEl(top || null, { faceUp: !!top, emptyLabel: "Empty" });
        $("#discard-label").textContent = top ? "Discard" : "Discard — empty";
        if (top && top.id !== animPrev.discardId) discEl.classList.add(top.id === G.lastSnapId ? "anim-snap" : "anim-discard");
        animPrev.discardId = top ? top.id : null;
        const canTakeDiscard = G.turn === 0 && G.phase === "chooseSource" && !!top;
        if (canTakeDiscard) { discEl.classList.add("tappable"); discEl.setAttribute("role", "button"); discEl.addEventListener("click", () => submitAction(0, { type: "drawDiscard" })); }
        // Drawn from the draw pile? You don't have to swap it in — tapping
        // the discard pile puts it straight there instead.
        const canThrowOnDiscard = G.turn === 0 && G.phase === "chooseSwap" && !!G.drawn && G.drawnFrom === "deck";
        if (canThrowOnDiscard) {
          discEl.classList.add("tappable"); discEl.setAttribute("role", "button");
          discEl.addEventListener("click", () => submitAction(0, { type: "discard" }));
          $("#discard-label").textContent = "Discard — tap to put drawn card here";
        }
        discHost.appendChild(discEl);

        const spot = $("#drawn-spot"); spot.innerHTML = "";
        if (G.drawn) {
          const lab = document.createElement("div"); lab.className = "dlabel";
          lab.textContent = G.turn === 0
            ? (G.drawnFrom === "discard" ? "You took from discard" : "You drew")
            : G.players[G.turn].name + (G.drawnFrom === "discard" ? " took from discard" : " drew");
          spot.appendChild(lab);
          const publicDraw = G.drawnFrom === "discard";
          const drawnEl = cardEl(G.turn === 0 || publicDraw ? G.drawn : { hidden: true }, { faceUp: G.turn === 0 || publicDraw });
          if (G.drawn.id !== animPrev.drawnId) drawnEl.classList.add(publicDraw ? "anim-draw-discard" : "anim-draw-deck");
          spot.appendChild(drawnEl);
        }
        animPrev.drawnId = G.drawn ? G.drawn.id : null;

        const youZone = $("#you-zone");
        youZone.className = "player-zone you-zone" + (G.turn === 0 && G.phase !== "over" ? " active" : "") + (G.cambioCaller === 0 ? " cambio-immune" : "");
        const yh = $("#you-hand"); yh.innerHTML = "";
        yh.className = "hand you" + (G.players[0].hand.length > 4 ? " wide" : "");
        G.players[0].hand.forEach((c, s) => {
          let faceUp = false, chip = null;
          if (c && (G.revealAll || ((G.revealViewer === undefined || G.revealViewer === 0) && G.reveal.has(c.id)))) faceUp = true;
          if (c && G.pubReveal && G.pubReveal.id === c.id && Date.now() < G.pubReveal.until) faceUp = true;
          if (G.phase === "peek" && (s === 2 || s === 3)) faceUp = true;
          if (c && !faceUp && G.memoryAid !== false && G.players[0].memory.has(c.id)) chip = cardLabel(c);
          const tappable = localCanTap(0, s);
          const el = cardEl(c, { faceUp, chip, tappable, onClick: () => localCardAction(0, s) });
          const fxc = fxClassFor(G.fx, G.fx && Date.now() < G.fx.until, 0, s, fxSeen, faceUp);
          if (fxc) el.classList.add(fxc);
          if (G.phase === "peek" && c && faceUp) maybeFlipAnim(flipSeen, el, c, true);
          else if (G.phase === "peek" && c) maybeDealAnim(dealSeen, el, c, ((0 - G.starter + G.players.length) % G.players.length) * 4 + s);
          else { noteHandAnim(animPrev, 0, s, c, el); maybeFlipAnim(flipSeen, el, c, !!faceUp); }
          yh.appendChild(el);
        });

        youZone.querySelectorAll(".cambio-stamp, .immune-badge").forEach(el => el.remove());
        if (G.cambioCaller === 0) { youZone.appendChild(makeCambioStamp(G.round + "-0")); youZone.appendChild(makeImmuneBadge()); }

        // contextual controls for the local player
        const btns = [];
        if (G.phase === "peek") {
          if (G.readySet.has(0)) btns.push({ label: "Waiting for the other players…", disabled: true });
          else btns.push({ label: "Got it — start round " + G.round, cls: "gold", fn: () => submitReady(0) });
        } else if (G.turn === 0 && G.phase === "chooseSource") {
          if (G.cambioCaller === null) btns.push({ label: "Call Cambio!", cls: "gold", fn: () => submitAction(0, { type: "cambio" }) });
        } else if (G.turn === 0 && G.phase === "chooseSwap") {
          if (G.drawnFrom === "deck") btns.push({ label: "Put it straight on the discard pile", cls: "gold", fn: () => submitAction(0, { type: "discard" }) });
        }
        setControls(btns);
        broadcast();
      }

      /* ============================================================
         ONLINE TABLES — play with friends using a table code.
         How it works, in plain terms: the host's browser runs the
         game (deals, enforces the rules) and guests connect to the
         host's table through the Cambio server (Socket.IO over a
         secure websocket — the same kind of live messaging chat
         apps use). Nothing is stored anywhere: messages pass
         through the server in the moment and are gone. Each guest
         is sent only their own view of the table, so nobody can
         see another player's hidden cards. The host sets the card
         memory aid for the WHOLE table.
         ============================================================ */
      let lobby = null;   // host side: { code, client, size, seats:[{clientId,name,lastSeen}] }
      let C = null;       // guest side: { client, code, clientId, myIdx, view, name, lastScoreRound, lobbySeats, gotLobby }
      /* Online transport: the Cambio server (Render) is a dumb relay.
         It only forwards messages between the host's browser and the
         guests in the same 5-letter room — it never deals, never sees
         a hand, and stores nothing. The host's browser still runs
         the game, exactly as in the canonical game. */
      function serverUrl() {
        const q = new URLSearchParams(location.search);
        return q.get("server") || window.CAMBIO_SERVER || location.origin;
      }
      function socketAvailable() { return typeof window.io !== "undefined" && window.io && typeof window.io.connect === "function"; }
      const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
      function makeCode() {
        let c = "";
        for (let i = 0; i < 5; i++) c += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
        return c;
      }
      function makeClientId(prefix) {
        return prefix + "-" + Date.now().toString(36) + "-" + Math.floor(Math.random() * 1e9).toString(36);
      }
      function topic(code, part) { return "cambio/v1/" + code + "/" + part; }
      function connectionAvailable() { return socketAvailable(); }
      function connectBroker(clientId) {
        // Socket.IO adapter with the same interface the host/guest code
        // already uses (publish / subscribe / on / end). Topics keep the
        // canonical "cambio/v1/<CODE>/<part>" shape; the relay server
        // routes by <part>: "join"/"act" go to the host, "lobby" goes to
        // all guests, "to/<clientId>" goes to that one guest.
        return new Promise((resolve, reject) => {
          if (!socketAvailable()) { reject(new Error("lib")); return; }
          let settled = false;
          const socket = window.io(serverUrl(), { transports: ["websocket", "polling"] });
          const handlers = { message: [], close: [], error: [] };
          const client = {
            _socket: socket, _code: null, _clientId: clientId, _role: null, _registered: false,
            subscribe(topics) {
              for (const tpc of topics) {
                const mm = String(tpc).match(/^cambio\/v1\/([A-Z0-9]{5})\/(.+)$/);
                if (!mm) continue;
                client._code = mm[1];
                const role = (mm[2] === "join" || mm[2] === "act") ? "host" : "guest";
                if (!client._registered || client._role !== role) {
                  client._role = role; client._registered = true;
                  socket.emit("register", { code: mm[1], clientId, role });
                }
              }
            },
            publish(topicStr, payload) {
              const mm = String(topicStr).match(/^cambio\/v1\/([A-Z0-9]{5})\/(.+)$/);
              if (!mm) return;
              if (!client._registered) {
                client._code = mm[1]; client._registered = true;
                client._role = (mm[2] === "join" || mm[2] === "act") ? "guest" : "host";
                socket.emit("register", { code: mm[1], clientId, role: client._role });
              }
              socket.emit("relay", { code: mm[1], part: mm[2], payload: String(payload) });
            },
            on(ev, fn) { if (handlers[ev]) handlers[ev].push(fn); },
            end() { try { socket.disconnect(); } catch (e) {} }
          };
          socket.on("connect", () => { if (!settled) { settled = true; resolve(client); } });
          socket.on("relay", msg => {
            const tpc = "cambio/v1/" + msg.code + "/" + msg.part;
            handlers.message.forEach(fn => { try { fn(tpc, msg.payload); } catch (e) {} });
          });
          socket.on("disconnect", () => { handlers.close.forEach(fn => { try { fn(); } catch (e) {} }); });
          socket.on("connect_error", e => {
            if (!settled) { settled = true; reject(e); }
            else handlers.error.forEach(fn => { try { fn(e); } catch (_) {} });
          });
          setTimeout(() => {
            if (!settled) { settled = true; try { socket.disconnect(); } catch (e) {} reject(new Error("timeout")); }
          }, 12000);
        });
      }

      function cleanupOnline() {
        if (lobby && lobby.watchdog) { clearInterval(lobby.watchdog); }
        if (C && C.pingTimer) { clearInterval(C.pingTimer); }
        try { if (lobby && lobby.client) lobby.client.end(true); } catch (e) {}
        try { if (C && C.client) C.client.end(true); } catch (e) {}
      }

      /* ---------- host: personal view for one guest ---------- */
      function buildViewFor(viewerIdx) {
        const viewer = G.players[viewerIdx];
        const pubActive = G.pubReveal && Date.now() < G.pubReveal.until;
        function cardView(ownerIdx, slot, c) {
          if (!c) return null;
          let faceUp = false;
          if (G.revealAll) faceUp = true;
          if (pubActive && G.pubReveal.id === c.id) faceUp = true;
          if ((G.revealViewer || 0) === viewerIdx && G.reveal && G.reveal.has(c.id)) faceUp = true;
          if (G.phase === "peek" && ownerIdx === viewerIdx && (slot === 2 || slot === 3)) faceUp = true;
          let chip = null;
          if (!faceUp && G.memoryAid !== false) {
            if (ownerIdx === viewerIdx && viewer.memory.has(c.id)) chip = cardLabel(c);
            else if (ownerIdx !== viewerIdx && viewer.spy.has(c.id)) chip = cardLabel(c);
          }
          return faceUp ? Object.assign(pubCard(c), { faceUp: true }) : { id: c.id, hidden: true, chip };
        }
        let drawn = null;
        if (G.drawn) {
          const pub = G.drawnFrom === "discard";
          drawn = {
            from: G.drawnFrom, owner: G.turn,
            card: (G.turn === viewerIdx || pub) ? Object.assign(pubCard(G.drawn), { faceUp: true }) : { id: G.drawn.id, hidden: true }
          };
        }
        let fd = null;
        if (G.firstDraw && G.phase === "firstDraw") {
          const f = G.firstDraw;
          const takenBy = {};
          Object.keys(f.takenBy || {}).forEach(k => { takenBy[k] = f.takenBy[k]; });
          fd = {
            active: true, drawNo: f.drawNo, contenders: f.contenders.slice(),
            fanCount: f.fan ? f.fan.length : 0, takenBy, revealed: !!f.revealed,
            winner: (f.winner === undefined ? null : f.winner), bestValue: f.bestValue,
            ranking: f.revealed && f.ranking ? f.ranking.map(pi => ({ player: pi, card: pubCard(f.picks[pi]), value: f.picks[pi].value })) : []
          };
        }
        return {
          round: G.round, code: G.code, turn: G.turn, phase: G.phase,
          powerStage: G.powerStage, cambioCaller: G.cambioCaller,
          totals: G.totals.slice(), memoryAid: G.memoryAid !== false,
          status: displayStatusFor(viewerIdx),
          deckCount: G.deck.length,
          discardTop: pubCard(G.discard[G.discard.length - 1]),
          discardId: G.discard.length ? G.discard[G.discard.length - 1].id : null,
          lastSnapId: G.lastSnapId, lastSnapAt: G.lastSnapAt,
          drawn, fx: (G.fx && Date.now() < G.fx.until) ? G.fx : null,
          ready: Array.from(G.readySet || []),
          snapFailedMe: !!(G.snap && G.snap.failed && G.snap.failed.has(viewerIdx)),
          pendingGiveMe: !!(G.snap && G.snap.pendingGive && G.snap.pendingGive.idx === viewerIdx),
          firstDraw: fd,
          players: G.players.map((p, pi) => ({
            name: p.name,
            hand: p.hand.map((c, s) => cardView(pi, s, c))
          })),
          score: (G.phase === "over" && G.lastScore) ? G.lastScore : null
        };
      }
      function broadcastOnline() {
        if (!G || G.mode !== "online" || !lobby || !lobby.client) return;
        G.players.forEach((p, i) => {
          if (p.bot || !p.conn) return;
          try { lobby.client.publish(topic(G.code, "to/" + p.conn), JSON.stringify({ type: "view", view: buildViewFor(i) })); } catch (e) {}
        });
      }
      function publishLobby() {
        if (!lobby || !lobby.client) return;
        const data = {
          type: "lobby", code: lobby.code, size: lobby.size,
          memoryAid: lobby.memoryAid,
          seats: lobby.seats.map(s => ({ name: s.name }))
        };
        try { lobby.client.publish(topic(lobby.code, "lobby"), JSON.stringify(data)); } catch (e) {}
        renderHostLobby();
      }
      function renderHostLobby() {
        if (!lobby) return;
        $("#lobby-code").textContent = lobby.code;
        const ul = $("#lobby-seats"); ul.innerHTML = "";
        for (let i = 0; i < lobby.size; i++) {
          const li = document.createElement("li");
          const a = document.createElement("span");
          const seat = lobby.seats[i];
          a.textContent = seat ? seat.name + (i === 0 ? " (host)" : "") : "Waiting for a player…";
          const t = document.createElement("span"); t.className = "tag";
          t.textContent = seat ? "Joined" : (i === 0 ? "Host" : "Empty — computer fills in");
          li.appendChild(a); li.appendChild(t); ul.appendChild(li);
        }
      }

      /* ---------- host flow ---------- */
      $("#btn-host").addEventListener("click", () => {
        $("#host-name").value = settings.name;
        $("#host-size").value = "4";
        $("#host-diff").value = settings.difficulty;
        $("#host-memory").value = settings.memoryAid ? "on" : "off";
        applyAppearance();
        $("#lobby-memory").value = settings.memoryAid ? "on" : "off";
        $("#host-form").hidden = false; $("#host-lobby").hidden = true;
        $("#host-err").textContent = "";
        show("host");
      });
      $("#host-create").addEventListener("click", async () => {
        const err = $("#host-err");
        settings.name = $("#host-name").value.trim() || "You";
        settings.difficulty = $("#host-diff").value;
        settings.memoryAid = $("#host-memory").value === "on";
        settings.pack = $("#host-pack").value; settings.felt = $("#host-felt").value;
        applyAppearance(); syncSettingsForm();
        if (!connectionAvailable()) { err.textContent = "Online play couldn't load its connection tools — check your internet connection and try again. Practice games against the computer still work."; return; }
        err.textContent = "Creating your table…";
        $("#host-create").disabled = true;
        const code = makeCode();
        const clientId = makeClientId("host");
        try {
          const client = await connectBroker(clientId);
          cleanupOnline();
          lobby = { code, client, size: parseInt($("#host-size").value, 10), memoryAid: settings.memoryAid, seats: [{ clientId, name: settings.name, lastSeen: Date.now() }], started: false, watchdog: null };
          client.subscribe([topic(code, "join"), topic(code, "act")]);
          client.on("message", (t, payload) => {
            let msg; try { msg = JSON.parse(payload.toString()); } catch (e) { return; }
            if (!lobby || lobby.code !== code) return;
            if (t === topic(code, "join")) hostOnJoin(msg);
            else if (t === topic(code, "act")) hostOnAction(msg);
          });
          client.on("close", () => { if (lobby && lobby.code === code && lobby.started && G) { /* host connection dropped: the table cannot continue */ } });
          $("#host-form").hidden = true; $("#host-lobby").hidden = false;
          $("#lobby-memory").value = lobby.memoryAid ? "on" : "off";
          $("#lobby-msg").textContent = "";
          err.textContent = "";
          publishLobby();
        } catch (e) {
          err.textContent = "Couldn't connect to the online relay. Check your internet connection and try again — practice games against the computer still work.";
        }
        $("#host-create").disabled = false;
      });
      function hostOnJoin(msg) {
        if (!lobby) return;
        if (msg.kind === "ping") {
          const s = lobby.seats.find(x => x.clientId === msg.clientId);
          if (s) s.lastSeen = Date.now();
          return;
        }
        if (msg.kind === "leave") {
          const i = lobby.seats.findIndex(x => x.clientId === msg.clientId);
          if (i > 0) {
            lobby.seats.splice(i, 1);
            if (lobby.started && G) {
              const gp = G.players.findIndex(p => p.conn === msg.clientId);
              if (gp > 0 && !G.players[gp].bot) {
                G.players[gp].bot = true; G.players[gp].conn = null;
                announce(G.players[gp].name + " has left — a computer player takes over their seat.", null);
                takeover(gp);
                render(); broadcast();
              }
            } else publishLobby();
          }
          return;
        }
        if (msg.kind === "join") {
          if (lobby.started) {
            try { lobby.client.publish(topic(lobby.code, "to/" + msg.clientId), JSON.stringify({ type: "full", reason: "This table's game has already started." })); } catch (e) {}
            return;
          }
          let seat = lobby.seats.find(x => x.clientId === msg.clientId);
          if (!seat) {
            if (lobby.seats.length >= lobby.size) {
              try { lobby.client.publish(topic(lobby.code, "to/" + msg.clientId), JSON.stringify({ type: "full", reason: "That table is full." })); } catch (e) {}
              return;
            }
            seat = { clientId: msg.clientId, name: (msg.name || "Player").slice(0, 16), lastSeen: Date.now() };
            lobby.seats.push(seat);
          }
          seat.lastSeen = Date.now();
          const idx = lobby.seats.indexOf(seat);
          try { lobby.client.publish(topic(lobby.code, "to/" + msg.clientId), JSON.stringify({ type: "welcome", seat: idx, memoryAid: lobby.memoryAid })); } catch (e) {}
          publishLobby();
        }
      }
      function hostOnAction(msg) {
        if (!lobby || !G || G.mode !== "online") return;
        const idx = G.players.findIndex(p => p.conn === msg.clientId);
        if (idx < 0 || !msg.action) return;
        submitAction(idx, msg.action);
      }
      $("#host-play-local").addEventListener("click", () => { $("#btn-play").click(); });
      $("#lobby-memory").addEventListener("change", e => {
        settings.memoryAid = e.target.value === "on";
        $("#host-memory").value = e.target.value;
        syncSettingsForm();
        if (lobby && !lobby.started) { lobby.memoryAid = settings.memoryAid; publishLobby(); }
        if (lobby && G) { G.memoryAid = settings.memoryAid; render(); broadcast(); }
      });
      $("#lobby-copy").addEventListener("click", async () => {
        const msg = $("#lobby-msg");
        if (!lobby) { msg.textContent = ""; return; }
        const text = "Join my Cambio game! Open Cambio, tap Join Game and enter this table code: " + lobby.code;
        try { await navigator.clipboard.writeText(text); msg.textContent = "Invite copied — paste it into a message to your friends. The code on its own works too."; }
        catch (e) {
          const ta = document.createElement("textarea");
          ta.value = text; document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); msg.textContent = "Invite copied — paste it into a message to your friends."; }
          catch (e2) { msg.textContent = "Your table code is " + lobby.code + " — just send your friends that code."; }
          ta.remove();
        }
      });
      $("#lobby-start").addEventListener("click", () => {
        if (!lobby || lobby.started) return;
        lobby.started = true;
        const players = lobby.seats.map((s, i) => ({ name: s.name, bot: false, conn: i === 0 ? null : s.clientId }));
        let bi = 0;
        while (players.length < lobby.size) { players.push({ name: BOT_NAMES[bi++ % BOT_NAMES.length], bot: true, conn: null }); }
        settings.memoryAid = lobby.memoryAid;
        startGameCommon(players, lobby.code, "online");
        // If a guest goes quiet while we're waiting on them, a
        // computer player takes their turn so the table isn't stuck.
        lobby.watchdog = setInterval(() => {
          if (!G || G.mode !== "online" || !G.pending) return;
          const idx = G.pending.idx;
          const p = G.players[idx];
          if (!p || p.bot || !p.conn) return;
          const seat = lobby.seats.find(x => x.clientId === p.conn);
          if (seat && Date.now() - seat.lastSeen > 30000) takeover(idx);
        }, 5000);
      });

      /* ---------- guest flow ---------- */
      $("#btn-join").addEventListener("click", () => {
        $("#join-name").value = settings.name;
        $("#join-err").textContent = "";
        show("join");
      });
      $("#join-play-local").addEventListener("click", () => { $("#btn-play").click(); });
      $("#join-go").addEventListener("click", async () => {
        const err = $("#join-err");
        const name = $("#join-name").value.trim() || "Player";
        const code = $("#join-code").value.trim().toUpperCase();
        if (code.length !== 5) { err.textContent = "Table codes are 5 letters — check the code your host sent you and try again."; return; }
        if (!connectionAvailable()) { err.textContent = "Online play couldn't load its connection tools — check your internet connection and try again."; return; }
        err.textContent = "Connecting to table " + code + "…";
        $("#join-go").disabled = true;
        const clientId = makeClientId("guest");
        try {
          const client = await connectBroker(clientId);
          cleanupOnline();
          C = { client, code, clientId, myIdx: -1, view: null, name, lastScoreRound: 0, gotLobby: false, pingTimer: null };
          client.subscribe([topic(code, "lobby"), topic(code, "to/" + clientId)]);
          client.on("message", (t, payload) => {
            let msg; try { msg = JSON.parse(payload.toString()); } catch (e) { return; }
            if (!C || C.code !== code) return;
            if (t === topic(code, "lobby")) guestOnLobby(msg);
            else guestOnDirect(msg);
          });
          const sendJoin = () => { try { client.publish(topic(code, "join"), JSON.stringify({ kind: "join", clientId, name })); } catch (e) {} };
          sendJoin();
          C.pingTimer = setInterval(() => {
            if (!C) return;
            try { client.publish(topic(code, "join"), JSON.stringify({ kind: "ping", clientId })); } catch (e) {}
            if (C.myIdx < 0 && !C.gotLobby) sendJoin();
          }, 4000);
          setTimeout(() => {
            if (C && C.clientId === clientId && !C.gotLobby) {
              err.textContent = "No table found with the code " + code + ". Check the code, and that the host still has their lobby open, then try again.";
              cleanupOnline(); C = null;
              $("#join-go").disabled = false;
            }
          }, 9000);
        } catch (e) {
          err.textContent = "Couldn't connect to the online relay. Check your internet connection and try again.";
          $("#join-go").disabled = false;
        }
      });
      function guestOnLobby(msg) {
        if (!C) return;
        if (msg.type === "closed") {
          cleanupOnline(); C = null;
          $("#score-overlay").classList.remove("open");
          show("home");
          return;
        }
        if (msg.type !== "lobby") return;
        C.gotLobby = true;
        C.lobbySeats = msg.seats || [];
        C.memoryAid = msg.memoryAid;
        $("#join-go").disabled = false;
        if (!document.querySelector("#view-game.active")) {
          $("#guest-lobby-code").textContent = C.code;
          $("#guest-memory-note").textContent = "Card memory aid: " + (msg.memoryAid ? "On" : "Off") + " — set by the host, the same for every player at this table.";
          const ul = $("#guest-seats"); ul.innerHTML = "";
          (msg.seats || []).forEach((s, i) => {
            const li = document.createElement("li");
            const a = document.createElement("span"); a.textContent = s.name + (i === 0 ? " (host)" : "");
            const t = document.createElement("span"); t.className = "tag"; t.textContent = "Joined";
            li.appendChild(a); li.appendChild(t); ul.appendChild(li);
          });
          show("lobby");
        }
      }
      function guestOnDirect(msg) {
        if (!C) return;
        if (msg.type === "welcome") { C.myIdx = msg.seat; C.memoryAid = msg.memoryAid; return; }
        if (msg.type === "full") {
          $("#join-err").textContent = msg.reason || "That table can't be joined.";
          cleanupOnline(); C = null; show("join");
          return;
        }
        if (msg.type === "view" && msg.view) {
          C.view = msg.view;
          if (C.myIdx < 0) { /* wait for welcome */ }
          if (!document.querySelector("#view-game.active")) show("game");
          renderGuest();
        }
      }
      function guestSend(action) {
        if (!C || !C.client) return;
        try { C.client.publish(topic(C.code, "act"), JSON.stringify({ clientId: C.clientId, action })); } catch (e) {}
      }
      $("#guest-leave").addEventListener("click", () => {
        if (C && C.client) { try { C.client.publish(topic(C.code, "join"), JSON.stringify({ kind: "leave", clientId: C.clientId })); } catch (e) {} }
        endSession(); show("home");
      });

      /* ---------- guest rendering (your seat is C.myIdx) ---------- */
      const animPrevG = { discardId: null, drawnId: null, hands: {} };
      function guestCanTap(v, pIdx, slot) {
        const me = C.myIdx;
        if (v.phase === "snap") {
          if (v.snapFailedMe) return false;
          if (v.pendingGiveMe) return pIdx === me;
          return pIdx !== v.cambioCaller;
        }
        if (v.turn !== me) return false;
        if (v.phase === "chooseSwap") return pIdx === me;
        if (v.phase === "powerTarget") {
          if (v.powerStage === "look" || v.powerStage === "swapFirst" || v.powerStage === "swapSecond") return pIdx !== v.cambioCaller;
          return false;
        }
        return false;
      }
      function guestCardAction(v, pIdx, slot) {
        if (v.phase === "snap") {
          if (v.pendingGiveMe) guestSend({ type: "give", slot });
          else guestSend({ type: "snap", p: pIdx, slot });
          return;
        }
        if (v.phase === "chooseSwap" && pIdx === C.myIdx) guestSend({ type: "swap", slot });
        else if (v.phase === "powerTarget") guestSend({ type: "target", p: pIdx, slot });
      }
      function guestCardEl(vc, opts) {
        if (!vc) return cardEl(null, opts || {});
        if (vc.hidden) {
          const el = cardEl({ hidden: true }, {});
          if (vc.chip) { const chip = document.createElement("span"); chip.className = "known-chip"; chip.textContent = vc.chip; el.appendChild(chip); }
          if (opts && opts.tappable) { el.classList.add("tappable"); el.setAttribute("role", "button"); }
          if (opts && opts.onClick) el.addEventListener("click", opts.onClick);
          return el;
        }
        const el = cardEl(vc, Object.assign({}, opts, { faceUp: true }));
        return el;
      }
      function renderGuest() {
        if (!C || !C.view) return;
        const v = C.view, me = C.myIdx;
        const names = v.players.map(p => p.name);
        renderTurnOrder(names, v.turn, me, v.phase === "over");
        (function () {
          const fd = v.firstDraw;
          buildFirstDrawPanel({
            names, viewerIdx: me,
            isContender: !!fd && fd.contenders.indexOf(me) >= 0,
            hasPicked: !!fd && Object.keys(fd.takenBy || {}).some(k => Number(fd.takenBy[k]) === me),
            onPick: fi => guestSend({ type: "firstPick", fanIdx: fi }),
            fd: !fd ? null : {
              active: v.phase === "firstDraw", drawNo: fd.drawNo, contenders: fd.contenders,
              fanCount: fd.fanCount, takenBy: fd.takenBy, revealed: !!fd.revealed,
              winner: fd.winner, bestValue: fd.bestValue,
              ranking: fd.ranking || []
            }
          });
        })();
        $("#round-label").textContent = "Round " + v.round + (v.code ? " · Table " + v.code : "");
        $("#memory-chip").textContent = "Memory aid: " + (v.memoryAid ? "On" : "Off") + " (set by host)";
        $("#you-name").textContent = (names[me] || "You") + " (you)";
        if (v.turn === me && v.phase !== "over" && v.phase !== "peek") {
          const b = document.createElement("span"); b.className = "turn-badge"; b.textContent = "Your turn";
          $("#you-name").appendChild(b);
        }
        if (v.phase === "over") setTurnBanner(false, "");
        else if (v.phase === "firstDraw") setTurnBanner(false, "Draw to go first — pick a card from the fan");
        else if (v.phase === "peek") setTurnBanner(false, "Memorise your two nearest cards");
        else if (v.phase === "snap") setTurnBanner(false, "");
        else setTurnBanner(v.turn === me, v.turn === me ? "Your turn" : names[v.turn] + "'s turn");
        const statusEl = $("#status");
        statusEl.textContent = v.status || "";
        statusEl.className = "status";
        const totals = $("#totals"); totals.innerHTML = "";
        const minTotal = Math.min.apply(null, v.totals);
        v.players.forEach((p, i) => {
          const chip = document.createElement("span");
          chip.className = "chip" + (v.totals[i] === minTotal ? " leader" : "");
          chip.textContent = p.name + ": " + v.totals[i];
          totals.appendChild(chip);
        });
        const opps = $("#opponents"); opps.innerHTML = "";
        v.players.forEach((p, i) => {
          if (i === me) return;
          const zone = document.createElement("div");
          zone.className = "player-zone" + (v.turn === i && v.phase !== "over" ? " active" : "") + (v.cambioCaller === i ? " cambio-immune" : "");
          const name = document.createElement("div"); name.className = "pname";
          name.textContent = p.name;
          if (v.turn === i && v.phase !== "over") { const b = document.createElement("span"); b.className = "turn-badge"; b.textContent = "Turn"; name.appendChild(b); }
          if (v.cambioCaller === i) { const th = document.createElement("span"); th.className = "thinking"; th.textContent = " · called Cambio!"; name.appendChild(th); }
          zone.appendChild(name);
          const hand = document.createElement("div");
          hand.className = "hand" + (p.hand.length > 4 ? " wide" : "");
          p.hand.forEach((vc, s) => {
            const tappable = guestCanTap(v, i, s);
            const el = guestCardEl(vc, { tappable, onClick: () => guestCardAction(v, i, s) });
            const fxc = fxClassFor(v.fx, !!v.fx, i, s, fxSeenC, !!(vc && vc.faceUp));
            if (fxc) el.classList.add(fxc);
            noteHandAnim(animPrevG, i, s, vc, el);
            maybeFlipAnim(flipSeenC, el, vc, !!(vc && vc.faceUp));
            hand.appendChild(el);
          });
          zone.appendChild(hand);
          if (v.cambioCaller === i) { zone.appendChild(makeCambioStamp(v.round + "-" + i)); zone.appendChild(makeImmuneBadge()); }
          opps.appendChild(zone);
        });
        const deckHost = $("#deck-pile"); deckHost.innerHTML = "";
        const deckCard = cardEl(v.deckCount ? { hidden: true } : null, {});
        if (v.turn === me && v.phase === "chooseSource" && v.deckCount) {
          deckCard.classList.add("tappable");
          deckCard.addEventListener("click", () => guestSend({ type: "drawDeck" }));
        }
        deckHost.appendChild(deckCard);
        const discHost = $("#discard-pile"); discHost.innerHTML = "";
        const top = v.discardTop;
        const discEl = cardEl(top || null, { faceUp: !!top, emptyLabel: "Empty" });
        $("#discard-label").textContent = top ? "Discard" : "Discard — empty";
        if (top && top.id !== animPrevG.discardId) discEl.classList.add(top.id === v.lastSnapId ? "anim-snap" : "anim-discard");
        animPrevG.discardId = top ? top.id : null;
        if (v.turn === me && v.phase === "chooseSource" && top) {
          discEl.classList.add("tappable"); discEl.setAttribute("role", "button");
          discEl.addEventListener("click", () => guestSend({ type: "drawDiscard" }));
        }
        if (v.turn === me && v.phase === "chooseSwap" && v.drawn && v.drawn.from === "deck") {
          discEl.classList.add("tappable"); discEl.setAttribute("role", "button");
          discEl.addEventListener("click", () => guestSend({ type: "discard" }));
          $("#discard-label").textContent = "Discard — tap to put drawn card here";
        }
        discHost.appendChild(discEl);
        const spot = $("#drawn-spot"); spot.innerHTML = "";
        if (v.drawn) {
          const lab = document.createElement("div"); lab.className = "dlabel";
          lab.textContent = v.turn === me
            ? (v.drawn.from === "discard" ? "You took from discard" : "You drew")
            : names[v.turn] + (v.drawn.from === "discard" ? " took from discard" : " drew");
          spot.appendChild(lab);
          const drawnEl = guestCardEl(v.drawn.card, {});
          if (v.drawn.card && v.drawn.card.id !== animPrevG.drawnId) drawnEl.classList.add(v.drawn.from === "discard" ? "anim-draw-discard" : "anim-draw-deck");
          spot.appendChild(drawnEl);
        }
        animPrevG.drawnId = v.drawn && v.drawn.card ? v.drawn.card.id : null;
        const youZone = $("#you-zone");
        youZone.className = "player-zone you-zone" + (v.turn === me && v.phase !== "over" ? " active" : "") + (v.cambioCaller === me ? " cambio-immune" : "");
        const yh = $("#you-hand"); yh.innerHTML = "";
        const myHand = (v.players[me] && v.players[me].hand) || [];
        yh.className = "hand you" + (myHand.length > 4 ? " wide" : "");
        myHand.forEach((vc, s) => {
          const tappable = guestCanTap(v, me, s);
          const el = guestCardEl(vc, { tappable, onClick: () => guestCardAction(v, me, s) });
          const fxc = fxClassFor(v.fx, !!v.fx, me, s, fxSeenC, !!(vc && vc.faceUp));
          if (fxc) el.classList.add(fxc);
          noteHandAnim(animPrevG, me, s, vc, el);
          maybeFlipAnim(flipSeenC, el, vc, !!(vc && vc.faceUp));
          yh.appendChild(el);
        });
        youZone.querySelectorAll(".cambio-stamp, .immune-badge").forEach(el => el.remove());
        if (v.cambioCaller === me) { youZone.appendChild(makeCambioStamp(v.round + "-" + me)); youZone.appendChild(makeImmuneBadge()); }
        const btns = [];
        if (v.phase === "peek") {
          if ((v.ready || []).indexOf(me) >= 0) btns.push({ label: "Waiting for the other players…", disabled: true });
          else btns.push({ label: "Got it — start round " + v.round, cls: "gold", fn: () => guestSend({ type: "ready" }) });
        } else if (v.turn === me && v.phase === "chooseSource") {
          if (v.cambioCaller === null || v.cambioCaller === undefined) btns.push({ label: "Call Cambio!", cls: "gold", fn: () => guestSend({ type: "cambio" }) });
        } else if (v.turn === me && v.phase === "chooseSwap") {
          if (v.drawn && v.drawn.from === "deck") btns.push({ label: "Put it straight on the discard pile", cls: "gold", fn: () => guestSend({ type: "discard" }) });
        }
        setControls(btns);
        if (v.phase === "over" && v.score && C.lastScoreRound !== v.round) {
          C.lastScoreRound = v.round;
          showScoreModal(v.score, false);
        }
        if (v.phase !== "over") $("#score-overlay").classList.remove("open");
      }

      renderRules();
