
      "use strict";
      const $ = s => document.querySelector(s);

      /* ============================================================
         HOW TO PLAY CONTENT
         The rules live in this one data block so the exact house
         rules can be dropped in later without touching the game.
         ============================================================ */
      const RULES = [
        { h: "Players and setup", body: [
          "2–6 players, 54 cards (a full deck plus 2 Jokers). Each player gets 4 cards face down in a square, and may peek at their 2 nearest cards once, at the start — then must remember them.",
          "Lowest total score wins. Play is clockwise: the strip at the top of the table lists 1, 2, 3, 4…, every player's name badge shows their position (1st, 2nd, 3rd…), and the players across the top sit left to right in clockwise order from you — the player who plays straight after you is on the far left, and the player who plays just before you is on the far right. The draw pile sits face down in the middle; the discard pile starts EMPTY — the first discarded card starts it.",
          "Memory aid: on, the game labels cards you've seen; off, you remember them yourself. In practice games you choose it; online, the host chooses it for the whole table."
        ]},
        { h: "Who goes first — the wheel", body: [
          "Every game — practice and online — decides the full turn order with a coloured wheel, never a card draw. Every player's name is on the wheel; it spins at random for 1st, that player comes off the wheel, then it spins again for 2nd, and so on until everyone's place is decided. Once you've entered your name and started, you press nothing — just watch the spins (roughly 10–20 seconds in total), then the game begins and play follows that order clockwise."
        ]},
        { h: "Card values", table: [
          ["Red King", "−1 — the best card in the game"], ["Joker", "0"], ["Ace", "1"], ["Number cards", "Their number"],
          ["Jack", "10"], ["Queen", "10"], ["Black King", "10"]
        ]},
        { h: "Turns", body: [
          "On your turn, pick up one card: draw face down from the draw pile, or take the top card of the discard pile. (First turn of a round: no discard yet, so draw.)",
          "Swap it into your hand and your replaced card goes face up on the discard pile — or, for a card drawn from the draw pile only, throw it straight onto the discard pile instead. A card taken FROM the discard pile must be swapped in.",
          "Warning: a discard-pile pick-up is public — everyone sees which card you now hold, and can snap it off you if its rank lands face up later."
        ]},
        { h: "Snapping", body: [
          "Any time, any player can snap a card — their own or an opponent's — onto the face-up middle card if the rank matches. Snapping takes TWO taps: the first tap lifts the card up off the table, still face down and marked as selected; tap the same card again to snap it. Tapping a different card moves the selection. This stops accidental snaps.",
          "Snap your own: you're down to 3 cards. Snap an opponent's: you give that opponent one of your cards as a penalty.",
          "Wrong snap: the card is shown to the whole table, goes back to its owner (everyone now knows it), and the snapper takes a penalty card from the draw pile — face down, never to be looked at, but it counts at scoring."
        ]},
        { h: "Card powers", body: [
          "Discarding a Jack, Queen or King face up triggers its power. With three or more players, using it is MANDATORY, never optional. In a one-versus-one game (two players), powers are NOT mandatory — you choose. First there's a ~4-second snap window on the card that just landed. After that window, the 'Use power' button to the right of the player's cards lights up gold (it sits greyed out the rest of the time) — they must press it before they can tap any card to use the power, so taps during the snap window can never be mistaken for the power. With three or more players that is the only button. In one-versus-one a second button, 'Do not use power', appears with it in the same slot — press it to skip the power entirely and play moves on. A pop-up names them while they use it, e.g. 'Will is using a Queen', so everyone knows who they are waiting for. The 'Call Cambio' button on the left of your cards works the same way: greyed out on everyone else's turn, gold only when it's your turn and you can call it.",
          "Pressing Use power starts a 10-second countdown, shown over the button. Finish using the power within those 10 seconds — if the time runs out, the power goes unused and play moves on. A King gets a fresh 10 seconds for its swap after the look, so there's time for both halves.",
          "The table shows what's happening: a card looked at with a Queen or King gets a gold circle round it and a 'Looked at' tag (only the power's user sees its face), and both cards in a swap are highlighted as they change places."
        ], list: [
          "King (black or red): look at any one card first, THEN swap any two cards — the two cards you swap do not have to include the card you looked at. With three or more players a bot that plays a King always follows its look with a swap; in one-versus-one it may skip the swap, just as its power is optional there.",
          "Queen: look at any one card.",
          "Jack: swap any two cards.",
          "A swap NEVER has to involve your own cards. You can swap any two cards on the table (apart from the Cambio caller's immune cards) — including two other players' cards with each other. For example, at a three-player table you could swap the other two players' cards. Computer players can do the same: a bot that plays a Jack or King may swap your card with another bot's card instead of swapping one of its own."
        ]},
        { h: "Calling Cambio", body: [
          "On your turn, instead of picking up, call Cambio when you think your score is low enough. Your cards become immune — they can't be swapped, looked at or snapped — and a CAMBIO! stamp lands on them.",
          "Every other player gets one more turn, then all cards are revealed and the lowest total wins the round."
        ]},
        { h: "Computer players — difficulty", body: [
          "No computer player ever snaps blind — at every level it only snaps a card it believes it knows matches. The only way a snap fails is a memory slip about position: it knows a matching card is there but taps the card next to it (for example, mixing up which slot a card taken from the discard pile was placed in).",
          "Easy: a gentle game, tuned so a decent player beats it most of the time. Its memory leaks — it forgets cards it has seen, so it rarely knows its whole hand — it snaps slowly, passes up decent discards, and mixes up a card's exact position on about 1 in 5 of its snap attempts.",
          "Moderate: a sterner test, beating a decent player about one round in four. It remembers almost everything with the odd slip, snaps quicker, mixes up a position on only about 1 in 10 snap attempts, takes good discards, and uses powers shrewdly — finishing its own knowledge and stealing low cards it remembers.",
          "Hard: the strongest test, beating a decent player roughly two rounds in five. It NEVER forgets a seen card, never mixes up a card's position, tracks cards as they swap hands, snaps almost instantly, and calls Cambio at 4 or under. It also targets the player with the fewest cards (best placed to win): Queen/King looks learn their cards, Jack/King swaps steal their low cards or dump a worse card on them.",
          "At every level, a computer player holding at least two fewer cards than everyone else may stretch its Cambio call by a point — the same judgement a strong human makes when calling at 4 or 5 with a short hand.",
          "All computer players: never discard a red King (−1, the best card). One exception — if the table already knows a computer holds a red King and a black King lands in the middle, it snaps its own red King on first, before someone else can snap it off and hand it a penalty card."
        ]},
        { h: "Playing with friends online", body: [
          "Host Game gives you a 5-letter code; friends tap Join Game, enter it, and wait in your lobby. You start when ready — empty seats are filled by computer players at your chosen skill level.",
          "The host's device runs the table and sends each player only their own view. Keep the host's game open: if the host leaves, the table closes. If a guest leaves mid-game, a computer player takes their seat."
        ]},
        { h: "Tie-breaker", body: [
          "Tied on lowest score: the player with the MOST cards remaining wins. Still tied: the player who did NOT call Cambio wins. (Both score 2, caller has 2 cards, the other has 3 — the other player wins.)"
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
      const settings = { name: "Player", bots: 3, difficulty: "easy", speed: 1, sound: true, memoryAid: true, pack: "classic", felt: "green" };
      /* Hidden pool of 40 bot names — never shown as a list in the
         UI. Every new match / table picks its bots fresh from this
         pool, shuffled, so the same names don't turn up every time. */
      const BOT_NAME_POOL = ["Ada", "Marco", "Priya", "Felix", "Nia", "Tomás", "Sofia", "Liam", "Zara", "Noah", "Ivy", "Omar", "Lena", "Hugo", "Maya", "Ellis", "Rosa", "Kofi", "Ines", "Bram", "Tilly", "Jonas", "Amara", "Dexter", "Freya", "Milo", "Sana", "Otto", "Lila", "Rafael", "Clara", "Yusuf", "Bea", "Casper", "Dina", "Ezra", "Greta", "Hamish", "Juno", "John Pork"];
      function pickBotNames(count, takenNames) {
        const taken = new Set((takenNames || []).map(n => String(n || "").trim().toLowerCase()).filter(Boolean));
        const pool = BOT_NAME_POOL.filter(n => !taken.has(n.toLowerCase()));
        // Fisher–Yates shuffle of a copy, so every table gets a
        // different random set and order, with no repeats at a table.
        for (let i = pool.length - 1; i > 0; i--) {
          let j;
          if (window.crypto && crypto.getRandomValues) {
            const a = new Uint32Array(1);
            const limit = Math.floor(4294967296 / (i + 1)) * (i + 1);
            do { crypto.getRandomValues(a); } while (a[0] >= limit);
            j = a[0] % (i + 1);
          } else {
            j = Math.floor(Math.random() * (i + 1));
          }
          const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
        }
        return pool.slice(0, Math.max(0, count));
      }

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
      $("#btn-achievements").addEventListener("click", () => show("achievements"));
      $("#rules-back").addEventListener("click", () => show(rulesReturn));
      $("#game-rules").addEventListener("click", () => { rulesReturn = "game"; show("rules"); });

      /* ---------- name pop-up ----------
         There is no name field in Settings any more. Whenever a
         player starts a practice game, hosts a table (joins their
         own lobby) or joins a game, this pop-up asks for the name
         the table will know them by. Resolves to the trimmed name,
         or null if they cancel. */
      let nameResolve = null;
      function askPlayerName(title, hint) {
        return new Promise(res => {
          nameResolve = res;
          $("#name-title").textContent = title;
          $("#name-hint").textContent = hint || "";
          const inp = $("#name-input");
          inp.value = settings.name || "";
          $("#name-overlay").classList.add("open");
          setTimeout(() => { try { inp.focus(); inp.select(); } catch (e) {} }, 60);
        });
      }
      function closeNamePopup(val) {
        $("#name-overlay").classList.remove("open");
        if (nameResolve) { const r = nameResolve; nameResolve = null; r(val); }
      }
      $("#name-ok").addEventListener("click", () => closeNamePopup($("#name-input").value.trim() || "Player"));
      $("#name-cancel").addEventListener("click", () => closeNamePopup(null));
      $("#name-input").addEventListener("keydown", e => {
        if (e.key === "Enter") { e.preventDefault(); $("#name-ok").click(); }
        if (e.key === "Escape") closeNamePopup(null);
      });

      /* settings form wiring */
      function applyAppearance() {
        document.body.dataset.pack = settings.pack || "classic";
        document.body.dataset.felt = settings.felt || "green";
        document.querySelectorAll("#set-pack, #play-pack, #host-pack").forEach(el => { el.value = settings.pack; });
        document.querySelectorAll("#set-felt, #play-felt, #host-felt").forEach(el => { el.value = settings.felt; });
        syncOptionPreviews();
      }
      /* Live previews for every pack / felt choice: each pack shows a
         sample face card and card back in that design, each felt shows a
         swatch of that colour. There are no drop-downs anywhere — the
         pictures are the chooser, and tapping one sets the hidden
         value holder for that screen; the larger combined preview
         (cards on felt) follows the current choice automatically via
         the body pack/felt variables. */
      const PACK_OPTIONS = [
        { id: "classic", label: "Classic" }, { id: "midnight", label: "Midnight" },
        { id: "vintage", label: "Vintage" }, { id: "berry", label: "Berry" },
        { id: "forest", label: "Forest" }, { id: "sunset", label: "Sunset" },
        { id: "ocean", label: "Ocean" }, { id: "slate", label: "Slate" },
        { id: "imperial", label: "Imperial" }, { id: "citrus", label: "Citrus" }
      ];
      const FELT_OPTIONS = [
        { id: "green", label: "Green" }, { id: "blue", label: "Blue" },
        { id: "burgundy", label: "Burgundy" }, { id: "charcoal", label: "Charcoal" },
        { id: "teal", label: "Teal" }, { id: "plum", label: "Plum" },
        { id: "walnut", label: "Walnut" }, { id: "olive", label: "Olive" },
        { id: "navy", label: "Navy" }, { id: "ochre", label: "Ochre" }
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
        $("#set-bots").value = String(settings.bots);
        $("#set-diff").value = settings.difficulty;
        $("#set-speed").value = String(settings.speed);
        setToggleValue($("#set-sound"), settings.sound);
        setToggleValue($("#set-memory"), settings.memoryAid);
        $("#set-pack").value = settings.pack;
        $("#set-felt").value = settings.felt;
      }
      $("#set-bots").addEventListener("change", e => settings.bots = parseInt(e.target.value, 10));
      $("#set-diff").addEventListener("change", e => settings.difficulty = e.target.value);
      $("#set-speed").addEventListener("change", e => settings.speed = parseFloat(e.target.value));
      $("#set-sound").addEventListener("change", e => settings.sound = e.target.value === "on");
      $("#set-memory").addEventListener("change", e => settings.memoryAid = e.target.value === "on");
      $("#set-pack").addEventListener("change", e => { settings.pack = e.target.value; applyAppearance(); });
      $("#set-felt").addEventListener("change", e => { settings.felt = e.target.value; applyAppearance(); });
      document.querySelectorAll("#play-pack, #host-pack").forEach(el => el.addEventListener("change", e => { settings.pack = e.target.value; applyAppearance(); }));
      document.querySelectorAll("#play-felt, #host-felt").forEach(el => el.addEventListener("change", e => { settings.felt = e.target.value; applyAppearance(); }));
      syncSettingsForm();
      buildOptionPreviews();
      applyAppearance();
      /* Toggle switches for the on/off settings (Sounds, Card
         memory aid): each switch button carries value "on"/"off"
         — the same contract the old drop-downs had — so the
         change listeners above and syncSettingsForm keep working
         unchanged. Tapping flips the value, repaints the switch
         (thumb side, track colour, On/Off word, aria-checked)
         and fires "change" so the setting itself updates. */
      function paintToggle(btn) {
        const on = btn.value === "on";
        btn.setAttribute("aria-checked", on ? "true" : "false");
        const t = btn.querySelector(".ts-text");
        if (t) t.textContent = on ? "On" : "Off";
      }
      /* Set a toggle switch from code (opening a screen, syncing
         Settings): a drop-down showed its new value on its own,
         but a switch button's thumb, colour and On/Off word only
         change when it is repainted, so every programmatic set
         goes through here. Plain drop-downs / hidden inputs just
         get the value, exactly as before. */
      function setToggleValue(el, on) {
        if (!el) return;
        el.value = on ? "on" : "off";
        if (el.classList && el.classList.contains("toggle-switch")) paintToggle(el);
      }
      document.querySelectorAll(".toggle-switch").forEach(btn => {
        btn.addEventListener("click", () => {
          btn.value = btn.value === "on" ? "off" : "on";
          paintToggle(btn);
          btn.dispatchEvent(new Event("change"));
        });
        paintToggle(btn);
      });

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
      /* A truly random seat index: crypto-grade randomness with
         rejection sampling, so every player is exactly equally
         likely — no modulo bias, different every single spin. */
      function randomIndex(n) {
        if (window.crypto && crypto.getRandomValues) {
          const a = new Uint32Array(1);
          const limit = Math.floor(4294967296 / n) * n;
          do { crypto.getRandomValues(a); } while (a[0] >= limit);
          return a[0] % n;
        }
        return Math.floor(Math.random() * n);
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
      /* Powers are mandatory with three or more players, but
         optional in a one-versus-one game (exactly two players
         at the table). Every power decision checks this. */
      function isHeadsUpGame() { return !!G && G.players && G.players.length === 2; }

      /* ============================================================
         GAME STATE — this browser runs the practice game and
         deals for the computer players.
         ============================================================ */
      let session = 0;
      let G = null;
      /* Two-tap snap selections — client-local only. First tap arms
         (lifts) a card; second tap on the same card snaps it. discId
         ties the selection to the discard card it was made against,
         so a new card landing clears it automatically. */
      let localSnapPick = null;
      let guestSnapPick = null;
      const wait = ms => new Promise(r => setTimeout(r, ms * settings.speed));
      const alive = tok => G && tok === session;

      function startGameCommon(players, code, mode) {
        session++;
        G = {
          players, code: code || null, mode,
          achDiff: mode === "local" ? settings.difficulty : null,
          round: 0, totals: players.map(() => 0), roundWins: players.map(() => 0),
          deck: [], discard: [], turn: 0, starter: 0,
          phase: "setup", drawn: null, drawnFrom: null,
          cambioCaller: null, finalTurns: 0,
          reveal: new Set(), revealAll: false,
          pendingPower: null, powerStage: null, powerAwaitIdx: null,
          powerDeadline: null, powerUserIdx: null, powerTimedOut: false,
          powerPopupIdx: null, powerPopupPw: null,
          snap: null, lastDiscard: null, lastSnapId: null, lastSnapAt: 0,
          pubReveal: null, fx: null, fxSeq: 0,
          firstWinner: null, firstDrawDone: false, firstDraw: null, wheel: null, dealtAt: 0,
          turnOrder: null, turnPos: 0,
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
        setToggleValue($("#play-memory"), settings.memoryAid);
        show("playsetup");
      });
      $("#play-start").addEventListener("click", async () => {
        const nm = await askPlayerName("Who's playing?", "Choose the name for this practice game — it's the name shown at the table.");
        if (nm === null) return;
        settings.name = nm;
        settings.bots = parseInt($("#play-bots").value, 10);
        settings.difficulty = $("#play-diff").value;
        settings.memoryAid = $("#play-memory").value === "on";
        settings.pack = $("#play-pack").value; settings.felt = $("#play-felt").value;
        applyAppearance();
        syncSettingsForm();
        endSession();
        const players = [{ name: settings.name, bot: false, conn: null }];
        pickBotNames(settings.bots, [settings.name]).forEach(name => players.push({ name, bot: true, conn: null }));
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

      /* ---------- wheel spinner: full turn order (EVERY game) ----------
         There is no draw-a-card to go first any more — in practice
         or online. A traditional coloured wheel with every player's
         name on it spins for 1st place; that player is removed from
         the wheel, the rest spin again for 2nd, and so on until the
         full turn order is decided. Every pick uses randomIndex()
         (crypto-grade, unbiased) at the moment of that spin. The
         whole sequence runs itself — once a player has entered
         their name and started the game they press nothing and
         just watch. Timing is set so the full sequence takes
         roughly 10–20 seconds in total (about 13s for 4 players,
         about 19s for 6), then the game begins as normal. The
         same rotations are sent to every guest, so all screens
         land together. */
      function ordinal(n) { return n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : n + "th"; }
      function turnOrderPos(idx) {
        if (!G || !G.turnOrder) return idx;
        const p = G.turnOrder.indexOf(idx);
        return p >= 0 ? p : idx;
      }
      async function runTurnOrderWheel(tok) {
        const n = G.players.length;
        const remaining = G.players.map((p, i) => i);
        const order = [];
        G.phase = "wheel";
        G.deck = shuffle(buildDeck()); // a deck on the table while the wheel spins
        // Hands-free from here: show the full wheel briefly so
        // everyone can take it in, then every spin runs itself.
        G.wheel = { winner: -1, winnerPos: -1, rotation: 0, durationMs: 0, startedAt: Date.now(), spinning: false, remaining: remaining.slice(), order: [], spinForPos: 1, intro: true };
        announce("Deciding the turn order with the wheel — just watch, no need to press anything…", null);
        G.players.forEach((pl, i) => { if (!pl.bot) G.prompts[i] = "Just watch — the wheel will spin by itself to decide the whole turn order."; });
        render(); broadcast();
        await new Promise(r => setTimeout(r, 1200));
        if (!alive(tok)) return;
        while (remaining.length > 1) {
          if (!alive(tok)) return;
          const pos = order.length + 1; // deciding 1st, then 2nd, …
          const winnerPos = randomIndex(remaining.length);
          const winner = remaining[winnerPos];
          const seg = 360 / remaining.length;
          const center = winnerPos * seg + seg / 2;
          const durationMs = 2300;
          const rotation = 360 * 3 + ((360 - center) % 360);
          G.wheel = { winner, winnerPos, rotation, durationMs, startedAt: Date.now(), spinning: true, remaining: remaining.slice(), order: order.slice(), spinForPos: pos };
          announce("Spinning the wheel for " + ordinal(pos) + " in the turn order…", null);
          G.players.forEach((pl, i) => { if (!pl.bot) G.prompts[i] = "The wheel is deciding who goes " + ordinal(pos) + "."; });
          render(); broadcast();
          await new Promise(r => setTimeout(r, durationMs + 120));
          if (!alive(tok)) return;
          G.wheel.spinning = false;
          order.push(winner);
          remaining.splice(winnerPos, 1);
          G.wheel.order = order.slice();
          G.wheel.remaining = remaining.slice();
          announce("The wheel landed on " + G.players[winner].name + " — " + ordinal(pos) + " in the turn order.", null);
          render(); broadcast();
          await new Promise(r => setTimeout(r, 650));
        }
        if (!alive(tok)) return;
        if (remaining.length === 1) order.push(remaining[0]); // last player takes the last place — no spin needed
        G.turnOrder = order.slice();
        G.turnPos = 0;
        G.firstWinner = order[0];
        G.firstDrawDone = true;
        G.wheel = { winner: order[0], winnerPos: 0, rotation: 0, durationMs: 0, startedAt: Date.now(), spinning: false, remaining: [], order: order.slice(), spinForPos: n, done: true };
        announce("Turn order decided: " + order.map(i => G.players[i].name).join(" → ") + ". " + G.players[order[0]].name + " goes first — dealing 4 cards each…", null);
        render(); broadcast();
        await new Promise(r => setTimeout(r, 2400)); // hold the finished order on screen to read it
        G.wheel = null;
      }
      /* Backwards-compatible name — all games now use the order wheel. */
      async function runFirstPlayerWheel(tok) { return runTurnOrderWheel(tok); }

      /* ---------- round setup ---------- */
      async function newRound(tok) {
        G.round++;
        if (G.round === 1 && !G.firstDrawDone) {
          await runTurnOrderWheel(tok);
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
        G.powerDeadline = null; G.powerUserIdx = null; G.powerTimedOut = false; G.powerPopupIdx = null; G.powerPopupPw = null; G.powerAwaitIdx = null;
        G.snap = null; G.lastDiscard = null; G.pending = null;
        G.pubReveal = null; G.fx = null; G.lastScore = null; G.revealViewer = 0;
        G.readySet = new Set();
        for (const p of G.players) {
          p.hand = [G.deck.pop(), G.deck.pop(), G.deck.pop(), G.deck.pop()];
          p.memory = new Set([p.hand[2].id, p.hand[3].id]); // the two nearest cards
          p.spy = new Set();
        }
        G.dealtAt = Date.now();
        if (G.turnOrder && G.turnOrder.length === G.players.length) {
          // Later rounds rotate the start one place along the
          // wheel-decided order, then follow that same order round.
          G.turnPos = (G.round - 1) % G.players.length;
          G.starter = G.turnOrder[G.turnPos];
        } else {
          G.turnPos = (G.round - 1) % G.players.length;
          G.starter = G.turnPos;
        }
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
        if (a.type === "ready") { submitReady(idx); return; }
        if (G.phase === "snap" && a.type === "snapArm") { pokeSnapTimer(6000); return; }
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
        if (G.turnOrder && G.turnOrder.length) {
          G.turnPos = ((G.turnPos || 0) + 1) % G.players.length;
          G.turn = G.turnOrder[G.turnPos];
        } else {
          G.turn = (G.turn + 1) % G.players.length;
        }
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
         face up in the middle. With three or more players using it
         is MANDATORY: there is no use-it-or-skip-it choice. In a
         one-versus-one game (two players) it is OPTIONAL: the
         player chooses with Use power / Do not use power. First,
         though, the table gets a snap window of about 4 seconds on
         the card that just landed (the snap window's normal
         length), which also gives the player who discarded it a
         moment to think. Only when that window closes does the
         power decision happen. */
      async function snapBeforePower(tok, idx, card) {
        if (!G.lastDiscard) return alive(tok);
        const p = G.players[idx];
        G.phase = "idle";
        if (isHeadsUpGame()) {
          announce(p.name + " discarded the " + cardLabel(card) + " — in one-versus-one its power is optional. First, a few seconds for snaps…", idx,
            "The " + cardLabel(card) + "'s power is optional in one-versus-one — you can use it or skip it. First, a few seconds for the table to snap.");
        } else {
          announce(p.name + " discarded the " + cardLabel(card) + " — its power must be used. First, a few seconds for snaps…", idx,
            "The " + cardLabel(card) + "'s power is mandatory — there's no skipping it. First, a few seconds for the table to snap.");
        }
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
        /* Human players must press the "Use power" button next to
           their cards before any card tap counts as using the power.
           Until they do, the game sits in powerReady: cards are not
           tappable for the power at all, so a tap made too early —
           during the snap window — can never fire the power or be
           mistaken for one. Bots skip the button and fire as before
           (botPower handles them separately). */
        if (!G.players[idx].bot) {
          G.pendingPower = pw;
          G.powerAwaitIdx = idx;
          G.powerUserIdx = idx;
          G.powerPopupIdx = idx;
          G.powerPopupPw = pw;
          G.powerStage = "awaitUse";
          G.phase = "powerReady";
          const pwName = pw === "king" ? "King" : pw === "queen" ? "Queen" : "Jack";
          const optional = isHeadsUpGame();
          if (optional) {
            announce(G.players[idx].name + "'s " + pwName + " power is ready — in one-versus-one they can use it or skip it.", idx,
              "Your " + pwName + " power is ready. Powers are optional in one-versus-one: press Use power next to your cards to use it, or Do not use power to skip it — tapping a card before choosing does nothing.");
          } else {
            announce(G.players[idx].name + "'s " + pwName + " power is ready — waiting for them to press Use power.", idx,
              "Your " + pwName + " power is ready. Press the Use power button next to your cards to use it — tapping a card before that does nothing.");
          }
          render(); broadcast();
          let pressed = false;
          let skipped = false;
          while (alive(tok) && !pressed && !skipped) {
            const a = await act(idx);
            if (!alive(tok)) return;
            if (a.type === "takeover") { G.pendingPower = null; G.powerStage = null; G.powerAwaitIdx = null; G.powerPopupIdx = null; G.powerPopupPw = null; G.powerUserIdx = null; await botPower(tok, idx, pw); return; }
            if (a.type === "usePower") pressed = true;
            else if (a.type === "skipPower" && optional) skipped = true;
            /* A skipPower tap at a 3+ table is ignored — powers
               are mandatory there and no skip button is shown.
               Any other tap (e.g. a target tap) is also ignored
               until a button has been pressed. */
          }
          if (!alive(tok)) return;
          G.powerAwaitIdx = null;
          if (skipped) {
            announce(G.players[idx].name + " chooses not to use the " + pwName + " power — play moves on.", idx,
              "You chose not to use the " + pwName + " power — play moves on.");
            G.pendingPower = null; G.powerStage = null;
            G.powerDeadline = null; G.powerUserIdx = null; G.powerTimedOut = false;
            G.powerPopupIdx = null; G.powerPopupPw = null;
            G.phase = "idle";
            render(); broadcast();
            return;
          }
          /* Pressing Use power starts a 10-second countdown,
             shown translucently over the button. The player has
             those 10 seconds to finish using the power; if the
             time runs out, the power goes unused and play moves
             on (awaitTarget enforces the deadline). A King is the
             one exception: it is two powers in one (look, then
             swap), so runPower restarts the countdown when the
             swap half begins — each half gets its own 10 seconds. */
          G.powerDeadline = Date.now() + 10000;
          G.powerTimedOut = false;
          render(); broadcast();
        }
        await runPower(tok, idx, pw);
        if (G.powerTimedOut) {
          announce(G.players[idx].name + " ran out of time — the " + (pw === "king" ? "King" : pw === "queen" ? "Queen" : "Jack") + " power goes unused and play moves on.", idx,
            "Time's up — the power goes unused and play moves on.");
          render(); broadcast();
        }
        G.pendingPower = null; G.powerStage = null; G.powerAwaitIdx = null;
        G.powerDeadline = null; G.powerUserIdx = null; G.powerTimedOut = false;
        G.powerPopupIdx = null; G.powerPopupPw = null;
      }

      function botResolveDrawn(idx) {
        const p = G.players[idx];
        if (!G.drawn) return null;
        const worst = worstKnown(p);
        let slot = (worst && G.drawn.value < worst.card.value) ? worst.slot : -1;
        if (isRedKing(G.drawn) && slot < 0) slot = safeBotDiscardSlot(p, -1); // never throw away a drawn red King
        if (slot >= 0) slot = safeBotDiscardSlot(p, slot); // and never swap a red King out either
        let discarded;
        if (slot >= 0) discarded = doSwap(idx, slot);
        else { const c = G.drawn; G.drawn = null; discardCard(idx, c); discarded = c; }
        G.phase = "idle";
        render();
        return discarded;
      }

      /* Wait for a valid card target from a player. The Cambio caller's
         cards are immune and can never be chosen. */
      async function awaitTarget(tok, idx, valid) {
        while (alive(tok)) {
          /* 10-second power countdown: if the deadline set when
             Use power was pressed passes while waiting for a
             target, the wait ends and the power goes unused. */
          let timer = null;
          if (G.powerDeadline) {
            const rem = G.powerDeadline - Date.now();
            if (rem <= 0) { G.powerTimedOut = true; return null; }
            timer = setTimeout(() => {
              if (G && G.pending && G.pending.idx === idx) {
                const r = G.pending.res; G.pending = null; r({ type: "powerTimeout" });
              }
            }, rem);
          }
          const a = await act(idx);
          if (timer) clearTimeout(timer);
          if (!alive(tok)) return null;
          if (a.type === "powerTimeout") { G.powerTimedOut = true; return null; }
          if (a.type === "takeover") return null;
          if (a.type !== "target") continue;
          const card = G.players[a.p] && G.players[a.p].hand[a.slot];
          if (!card) continue;
          if (valid && !valid(a.p, a.slot, card)) continue;
          return a;
        }
        return null;
      }

      /* Knowledge follows the card, by card id. Each player's
         knowledge lives in two sets: memory (cards they know in
         their OWN hand) and spy (cards they know in OTHER hands).
         When a card changes hands, BOTH sides must be updated:
         the receiver's knowledge moves spy -> memory (enterHand),
         and the giver's knowledge moves memory -> spy (leaveHand).
         The old code only did the receiver's half — so a card a
         player knew and then swapped away silently dropped out of
         their memory aid, even though they still knew exactly what
         it was and where it had gone. */
      function enterHand(p, card) {
        if (p.spy.has(card.id)) { p.spy.delete(card.id); p.memory.add(card.id); }
      }
      function leaveHand(p, card) {
        if (p.memory.has(card.id)) { p.memory.delete(card.id); p.spy.add(card.id); }
      }
      function swapTwoCards(pa, sa, pb, sb) {
        const A = G.players[pa], B = G.players[pb];
        const ca = A.hand[sa], cb = B.hand[sb];
        if (!ca || !cb) return;
        A.hand[sa] = cb; B.hand[sb] = ca;
        leaveHand(A, ca); leaveHand(B, cb);
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
          /* A King is TWO powers in one: the Queen's look, then the
             Jack's swap. The single 10-second countdown started at
             Use power would otherwise be mostly eaten by the look
             (choosing a card, then the ~3-second reveal while it is
             held up), leaving the player no real time to pick the
             two swap cards — the swap half timed out and was lost.
             So when a King moves on to its swap half, the countdown
             restarts: the swap gets its own full 10 seconds, exactly
             as if a Jack had just been played. */
          if (pw === "king" && G.powerDeadline) { G.powerDeadline = Date.now() + 10000; G.powerTimedOut = false; }
          G.powerStage = "swapFirst";
          announce(p.name + " is using a power.", idx, "Now swap any two cards on the table — they do NOT have to include your own cards; you could swap two other players' cards. Tap the first card.");
          if (pw === "jack") { G.prompts[idx] = "Jack: swap any two cards on the table — they don't have to include your own. Tap the first card."; }
          render();
          const t1 = await awaitTarget(tok, idx, tp => !immune(tp));
          if (!t1) { G.pendingPower = null; G.powerStage = null; return; }
          G.powerStage = "swapSecond";
          announce(p.name + " is using a power.", idx, "Now tap the second card to swap it with — it can belong to anyone at the table (except the Cambio caller, whose cards are immune).");
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
        p.spy.delete(G.drawn.id);
        p.memory.delete(old.id);
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
        if (idx === 0) localSnapPick = null;
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
        leaveHand(from, given);
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
        leaveHand(from, given);
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
          localSnapPick = null; guestSnapPick = null;
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
            // A bot never snaps its own red King onto the pile —
            // EXCEPT defensively: if the rest of the table already
            // knows this bot holds that red King and a BLACK King
            // has just landed in the middle, the bot snaps its own
            // red King onto it first, before another player can
            // snap it off them and hand them a penalty card.
            let ownSlot = -1;
            for (let s = 0; s < p.hand.length; s++) {
              const c = p.hand[s];
              if (!c || c.rank !== target.rank || !knowsCard(p, c)) continue;
              if (isRedKing(c)) {
                const defensive = target.rank === "K" && !target.red && othersKnowCard(i, c);
                if (!defensive) continue;
              }
              ownSlot = s; break;
            }
            if (ownSlot >= 0) { tp = i; slot = ownSlot; }
            else {
              for (let j = 0; j < G.players.length; j++) {
                if (j === i || j === G.cambioCaller) continue;
                const s = G.players[j].hand.findIndex(c => c && c.rank === target.rank && knowsCard(p, c));
                if (s >= 0) { tp = j; slot = s; break; }
              }
            }
            if (tp >= 0) {
              if (Math.random() < cfg.snapChance) {
                let attemptSlot = slot;
                // No blind guessing at any level: a bot only ever
                // snaps when it believes it knows a matching card.
                // The ONLY way it can fail is misremembering WHERE
                // that known card sits — e.g. it saw a player take
                // a card from the discard pile and swap it in, but
                // mixes up which slot it went into and taps the
                // card next to it instead. Easy mixes up the
                // position on about 1 in 5 of its snap attempts,
                // Moderate on about 1 in 10, Hard never.
                if (cfg.misrememberChance && Math.random() < cfg.misrememberChance) {
                  const hand = G.players[tp].hand;
                  const neighbours = [slot - 1, slot + 1].filter(s =>
                    s >= 0 && s < hand.length && hand[s] &&
                    // never blunder onto its own red King (unless
                    // that snap would itself be the defensive one)
                    !(tp === i && isRedKing(hand[s]) && !(target.rank === "K" && !target.red && othersKnowCard(i, hand[s]))) &&
                    // a neighbour that is itself a known match is
                    // not a mistake — the bot would just snap it
                    !(hand[s].rank === target.rank && knowsCard(p, hand[s]))
                  );
                  if (neighbours.length) attemptSlot = neighbours[Math.floor(Math.random() * neighbours.length)];
                }
                handleSnapAttempt(i, tp, attemptSlot);
              }
            }
            // No known match = no snap. Bots never pick a random
            // card and hope — if they have forgotten a card
            // entirely (botForget), they simply don't try.
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
          localSnapPick = null;
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
         Three skill levels, calibrated against a decent human
         player — one who usually calls Cambio at 3 or lower, and
         occasionally stretches to 4 or 5 when they hold far fewer
         cards than everyone else. Against that player, each bot
         is tuned to finish ahead of them roughly:
           Easy     — 10 to 15% of rounds
           Moderate — about 25% of rounds
           Hard     — about 35 to 40% of rounds
         The levers are memory, snap speed and reliability, how
         good a discard a bot will take, how readily it gambles a
         drawn card into an unknown slot, and the Cambio
         threshold. Easy's memory leaks badly (a tenth of what it
         knows slips away every turn), so it rarely knows its
         whole hand and seldom gets to call Cambio at all;
         Moderate leaks a little; Hard never forgets. Easy and
         Moderate call Cambio at 5 or under, Hard at 4 or under —
         plus, at every level, a "rogue" point on the threshold
         when the bot holds at least two fewer cards than every
         other player, mirroring the human's own stretch calls.
         NO bot at any level ever snaps blind: a bot only snaps a
         card it believes it knows matches. A snap can only fail
         when the bot misremembers which slot that known card
         sits in and taps the neighbouring card instead — Easy on
         about 1 in 5 of its snap attempts, Moderate on about 1 in
         10, Hard never. Hard's knowledge is kept by card id and
         every public sighting is recorded (cards taken openly
         from the discard pile, cards turned over by failed snaps,
         cards it has spied on), so it tracks cards as they are
         swapped around the table, snaps almost at once, and aims
         its powers at the player with the fewest cards.
         ============================================================ */
      const DIFF_LEVELS = {
        easy:     { snapChance: 0.65, snapDelayMin: 850, snapDelayVar: 1200, misrememberChance: 0.20, forget: 0.10, cambioMax: 5, cambioChance: 0.75, takeMax: 4, takeChance: 0.75, gambleMax: 2, rogueBonus: 1 },
        moderate: { snapChance: 0.85, snapDelayMin: 650, snapDelayVar: 900,  misrememberChance: 0.10, forget: 0.04, cambioMax: 5, cambioChance: 0.9,  takeMax: 5, takeChance: 0.9,  gambleMax: 3, rogueBonus: 1 },
        hard:     { snapChance: 0.98, snapDelayMin: 320, snapDelayVar: 550,  misrememberChance: 0,    forget: 0,    cambioMax: 4, cambioChance: 0.95, takeMax: 9, takeChance: 0.95, gambleMax: 4, rogueBonus: 1 }
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
      /* A red King is worth -1 — the best card in the game. A bot
         must NEVER put one on the discard pile: not by swapping it
         out, and not by throwing away a red King it just drew. The
         single exception is the defensive self-snap in
         scheduleBotSnaps. safeBotDiscardSlot() picks a slot whose
         card is safe to let go of (never a red King). */
      function isRedKing(c) { return !!c && c.rank === "K" && c.red; }
      function othersKnowCard(idx, card) {
        return G.players.some((q, qi) => qi !== idx && (q.memory.has(card.id) || q.spy.has(card.id)));
      }
      function safeBotDiscardSlot(p, preferred) {
        if (preferred >= 0 && p.hand[preferred] && !isRedKing(p.hand[preferred])) return preferred;
        const k = knownCards(p).filter(x => !isRedKing(x.card));
        if (k.length) return k.reduce((a, b) => (b.card.value > a.card.value ? b : a)).slot;
        return randomSlot(p, c => !isRedKing(c));
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
        /* Rogue call: a bot holding at least two fewer cards than
           EVERY other player is so well placed that its Cambio
           threshold rises by cfg.rogueBonus — the same judgement
           a strong human makes when they call at 4 or 5 with a
           short hand. */
        let cambioMax = cfg.cambioMax;
        if (allKnown && G.cambioCaller === null) {
          const myCount = p.hand.filter(Boolean).length;
          const fewestOther = Math.min.apply(null, G.players.filter((q, qi) => qi !== idx).map(q => q.hand.filter(Boolean).length));
          if (myCount + 2 <= fewestOther) cambioMax += cfg.rogueBonus || 0;
        }
        if (G.cambioCaller === null && allKnown && sum <= cambioMax && Math.random() < cfg.cambioChance) {
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
        if (takeSlot >= 0) takeSlot = safeBotDiscardSlot(p, takeSlot); // never swap out a red King
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

        if (swapSlot >= 0) swapSlot = safeBotDiscardSlot(p, swapSlot); // never swap out a red King
        if (isRedKing(c) && swapSlot < 0) swapSlot = safeBotDiscardSlot(p, -1); // a drawn red King is always kept
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
        /* The power pop-up names bots too, while their power runs. */
        G.powerPopupIdx = idx; G.powerPopupPw = pw;
        try { await botPowerInner(tok, idx, pw); }
        finally { if (G) { G.powerPopupIdx = null; G.powerPopupPw = null; render(); broadcast(); } }
      }
      async function botPowerInner(tok, idx, pw) {
        if (!pw || !alive(tok)) return;
        // Powers follow the same rule for computer players:
        // mandatory with three or more players, optional in
        // one-versus-one — with the same snap window on the card
        // they just discarded before the power fires.
        const landed = G.lastDiscard && G.lastDiscard.card;
        if (landed && powerOf(landed) === pw) {
          if (!(await snapBeforePower(tok, idx, landed))) return;
        }
        const p = G.players[idx];
        const cfg = diffCfg();
        const hard = settings.difficulty === "hard";
        const moderate = settings.difficulty === "moderate";
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
        const knownLowTargetFrom = (oi, maxVal) => {
          if (oi < 0) return null;
          const s = G.players[oi].hand.findIndex(c => c && knowsCard(p, c) && c.value <= maxVal);
          return s >= 0 ? { p: oi, slot: s, card: G.players[oi].hand[s] } : null;
        };
        // Hard only: the biggest threat is the opponent with the
        // FEWEST cards — fewest cards left is the best chance of
        // winning the round — so Hard bots aim their looks and
        // swaps at that player to learn, steal from or burden them.
        let threatIdx = -1;
        if (hard && others.length) {
          const count = i => G.players[i].hand.filter(Boolean).length;
          threatIdx = others.slice().sort((a, b) => (count(a) - count(b)) || (a - b))[0];
        }
        /* Powers are mandatory for bots too at tables of three or
           more, and optional in one-versus-one — the same rule as
           for human players. A swap NEVER has to involve this bot's
           own cards: with two or more opponents it may swap two
           opponents' cards with each other instead. */
        const headsUp = G.players.length === 2;
        const doBotSwap = (pwName, a, b) => {
          swapTwoCards(a.p, a.slot, b.p, b.slot);
          setFx("swap", { p: a.p, slot: a.slot }, { p: b.p, slot: b.slot }, 1600);
          const nm = pi => pi === idx ? "their own" : G.players[pi].name + "'s";
          const what = a.p === b.p
            ? "two of " + nm(a.p) + " cards"
            : "one of " + nm(a.p) + " cards with one of " + nm(b.p) + " cards";
          announce(p.name + " uses the " + pwName + " to swap " + what + ".", null);
        };
        /* An opponent-versus-opponent swap this bot KNOWS helps it:
           a low card it knows one opponent holds (ideally the
           threat — the player with the fewest cards) swapped for a
           high card it knows a DIFFERENT opponent holds. The low
           card's owner is left holding the high card, and none of
           the bot's own cards are risked. Needs two opponents, so
           it can only happen at tables of three or more. */
        const findOpponentOpponentSwap = () => {
          if (others.length < 2) return null;
          const lows = [], highs = [];
          for (const oi of others) {
            G.players[oi].hand.forEach((c, s) => {
              if (c && knowsCard(p, c)) {
                if (c.value <= 2) lows.push({ p: oi, slot: s, card: c });
                else if (c.value >= 6) highs.push({ p: oi, slot: s, card: c });
              }
            });
          }
          if (!lows.length || !highs.length) return null;
          lows.sort((a, b) => ((b.p === threatIdx) - (a.p === threatIdx)) || a.card.value - b.card.value);
          highs.sort((a, b) => b.card.value - a.card.value);
          for (const lo of lows) for (const hi of highs) if (lo.p !== hi.p) return { a: lo, b: hi, threat: lo.p === threatIdx };
          return null;
        };
        if (pw === "queen") {
          let looked = false;
          // Hard bots spy on the threat first: learning the cards of
          // the player with the fewest cards sets up a later steal.
          if (hard && threatIdx >= 0) {
            const s = randomSlot(G.players[threatIdx], c => !knowsCard(p, c));
            if (s >= 0) {
              p.spy.add(G.players[threatIdx].hand[s].id);
              setFx("look", { p: threatIdx, slot: s }, null, 2400);
              announce(p.name + " uses the Queen to look at one of " + G.players[threatIdx].name + "'s cards.", null);
              looked = true;
            }
          }
          // Hard and Moderate bots complete their own knowledge first
          // — knowing all of their own cards is what lets them call
          // Cambio early. (Easy, like the old Moderate, looks at an
          // opponent first and only checks its own cards if there is
          // nothing new to learn elsewhere.)
          if (!looked && (hard || moderate)) {
            const s = randomSlot(p, c => !knowsCard(p, c));
            if (s >= 0) {
              p.memory.add(p.hand[s].id);
              setFx("look", { p: idx, slot: s }, null, 2400);
              announce(p.name + " uses the Queen to look at one of their own cards.", null);
              looked = true;
            }
          }
          if (!looked) {
            // Hard still prefers the threat when looking elsewhere.
            const order = hard && threatIdx >= 0 ? [threatIdx].concat(others.filter(o => o !== threatIdx)) : others;
            for (const oi of order) {
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
          if (others.length) {
            // Sharper bots swap their worst card for a specific low
            // card they remember seeing in an opponent's hand. Easy
            // now plays this exactly as the old Moderate did (60%
            // chance to target a card worth 1 or less); Moderate does
            // it more often and for cards worth up to 2; Hard always
            // does it and checks the threat player first.
            let low = null;
            if (hard) low = knownLowTargetFrom(threatIdx, 2) || knownLowTarget(2);
            else if (moderate) low = Math.random() < 0.75 ? knownLowTarget(2) : null;
            else low = Math.random() < 0.6 ? knownLowTarget(1) : null;
            const beneficialOwn = !!(low && worst && low.card.value < worst.card.value);
            /* The swap does NOT have to involve this bot's own
               cards: a known opponent-versus-opponent swap (one
               opponent's low card exchanged for another's high
               card) is preferred when the bot has no good steal
               for itself, or when its own worst card is already
               low enough that risking it makes no sense. */
            const oo = findOpponentOpponentSwap();
            if (oo && (!beneficialOwn || (worst && worst.card.value <= 3))) {
              doBotSwap("Jack", oo.a, oo.b);
            } else if (beneficialOwn) {
              swapTwoCards(idx, mySlot, low.p, low.slot);
              setFx("swap", { p: idx, slot: mySlot }, { p: low.p, slot: low.slot }, 1600);
              announce(p.name + " uses the Jack to swap one of their cards with one of " + G.players[low.p].name + "'s.", null);
            } else if (oo) {
              doBotSwap("Jack", oo.a, oo.b);
            } else if (headsUp) {
              /* One-versus-one: the Jack is optional, and with no
                 known card worth taking, this bot chooses not to
                 gamble a swap at all. */
              announce(p.name + " chooses not to use the Jack power — powers are optional in one-versus-one.", null);
            } else if (hard && threatIdx >= 0 && worst) {
              // No known low card to steal: dump the worst card on
              // the threat anyway, so the player with the fewest
              // cards is left holding it. (3+ players: the swap is
              // mandatory, so a swap always happens.)
              const ts = randomSlot(G.players[threatIdx], () => true);
              if (ts >= 0) {
                swapTwoCards(idx, mySlot, threatIdx, ts);
                setFx("swap", { p: idx, slot: mySlot }, { p: threatIdx, slot: ts }, 1600);
                announce(p.name + " uses the Jack to swap one of their cards with one of " + G.players[threatIdx].name + "'s.", null);
              }
            } else if (mySlot >= 0) {
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
            // All levels now look at a card they don't know yet rather
            // than wasting the look on one they already know — that
            // was the old Moderate behaviour, and Easy matches it.
            // Hard looks at the threat player (fewest cards) first.
            let oi = others[Math.floor(Math.random() * others.length)];
            let ts = -1;
            const lookOrder = hard && threatIdx >= 0 ? [threatIdx].concat(others.filter(o => o !== threatIdx)) : others;
            for (const cand of lookOrder) { const s = randomSlot(G.players[cand], c => !knowsCard(p, c)); if (s >= 0) { oi = cand; ts = s; break; } }
            if (ts < 0) ts = randomSlot(G.players[oi], () => true);
            const worst = worstKnown(p);
            const kingFallbackSlot = worst ? worst.slot : randomSlot(p, () => true);
            if (ts >= 0) {
              const theirs = G.players[oi].hand[ts];
              p.spy.add(theirs.id);
              setFx("look", { p: oi, slot: ts }, null, 2400);
              announce(p.name + " uses the King to look at one of " + G.players[oi].name + "'s cards.", null);
              render();
              await wait(1150);
              if (!alive(tok)) return;
              /* The King's swap ALWAYS follows the look at tables
                 of three or more (mandatory) — the branches below
                 now cover every case there. In one-versus-one the
                 swap is optional, so the Easy / Moderate gambles
                 stay coin flips and may be skipped. The swap also
                 never has to involve this bot's own cards: a known
                 opponent-versus-opponent swap comes second only to
                 stealing the card it just looked at for itself. */
              const ooSwap = findOpponentOpponentSwap();
              if (worst && theirs.value < worst.card.value) {
                swapTwoCards(idx, worst.slot, oi, ts);
                setFx("swap", { p: idx, slot: worst.slot }, { p: oi, slot: ts }, 1600);
                announce(p.name + " uses the King to swap one of their cards with one of " + G.players[oi].name + "'s.", null);
              } else if (ooSwap) {
                doBotSwap("King", ooSwap.a, ooSwap.b);
              } else if (worst && hard) {
                // No luck with the look — but a Hard bot may already
                // know a low card worth taking, checking the threat
                // player's hand first, then anyone else's.
                const low = knownLowTargetFrom(threatIdx, 2) || knownLowTarget(2);
                if (low && low.card.value < worst.card.value) {
                  swapTwoCards(idx, worst.slot, low.p, low.slot);
                  setFx("swap", { p: idx, slot: worst.slot }, { p: low.p, slot: low.slot }, 1600);
                  announce(p.name + " uses the King to swap one of their cards with one of " + G.players[low.p].name + "'s.", null);
                } else if (threatIdx >= 0) {
                  // Nothing worth stealing: burden the threat with
                  // this bot's worst card instead.
                  const ts2 = randomSlot(G.players[threatIdx], () => true);
                  if (ts2 >= 0) {
                    swapTwoCards(idx, worst.slot, threatIdx, ts2);
                    setFx("swap", { p: idx, slot: worst.slot }, { p: threatIdx, slot: ts2 }, 1600);
                    announce(p.name + " uses the King to swap one of their cards with one of " + G.players[threatIdx].name + "'s.", null);
                  }
                }
              } else if (worst && moderate) {
                // Moderate's extra edge: if the look found nothing,
                // fall back to a known low card before gambling.
                const low = knownLowTarget(2);
                if (low && low.card.value < worst.card.value) {
                  swapTwoCards(idx, worst.slot, low.p, low.slot);
                  setFx("swap", { p: idx, slot: worst.slot }, { p: low.p, slot: low.slot }, 1600);
                  announce(p.name + " uses the King to swap one of their cards with one of " + G.players[low.p].name + "'s.", null);
                } else if (Math.random() < (headsUp ? 0.5 : 1)) {
                  // 3+ players: always swaps after the look.
                  // One-versus-one: a coin-flip gamble — it may
                  // choose not to swap at all.
                  const oi2 = others[Math.floor(Math.random() * others.length)];
                  const ts2 = randomSlot(G.players[oi2], () => true);
                  if (ts2 >= 0) {
                    swapTwoCards(idx, worst.slot, oi2, ts2);
                    setFx("swap", { p: idx, slot: worst.slot }, { p: oi2, slot: ts2 }, 1600);
                    announce(p.name + " uses the King to swap one of their cards with one of " + G.players[oi2].name + "'s.", null);
                  }
                }
              } else if (worst && Math.random() < (headsUp ? 0.5 : 1)) {
                // Same rule for Easy: always swaps after the look
                // at 3+ tables, optional gamble in one-versus-one.
                const oi2 = others[Math.floor(Math.random() * others.length)];
                const ts2 = randomSlot(G.players[oi2], () => true);
                if (ts2 >= 0) {
                  swapTwoCards(idx, worst.slot, oi2, ts2);
                  setFx("swap", { p: idx, slot: worst.slot }, { p: oi2, slot: ts2 }, 1600);
                  announce(p.name + " uses the King to swap one of their cards with one of " + G.players[oi2].name + "'s.", null);
                }
              } else if (!headsUp && kingFallbackSlot >= 0) {
                /* Mandatory-swap guarantee (3+ players): no branch
                   above swapped — usually because this bot knows
                   none of its own cards — so it still swaps, using
                   its fallback card against a random opponent. In
                   one-versus-one this branch never runs: skipping
                   the swap is allowed there. */
                const oi2 = others[Math.floor(Math.random() * others.length)];
                const ts2 = randomSlot(G.players[oi2], () => true);
                if (ts2 >= 0) {
                  swapTwoCards(idx, kingFallbackSlot, oi2, ts2);
                  setFx("swap", { p: idx, slot: kingFallbackSlot }, { p: oi2, slot: ts2 }, 1600);
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
         ACHIEVEMENTS — practice games only (mode "local": you
         against the computer players). A "game" here is a round:
         each round has a winner, so winning rounds back to back
         builds a streak at the difficulty the practice game was
         started on, and losing a round resets that difficulty's
         streak. Tracked for this visit only — the page keeps no
         storage between visits, so the list starts greyed out
         again on a fresh load.
         ============================================================ */
      const ACH_DEFS = [
        { id: "john", title: "Beat John Pork", desc: "Win a game with John Pork at the table" }
      ].concat([5, 10, 15].reduce((acc, n) => acc.concat(["easy", "moderate", "hard"].map(d => ({
        id: d + n,
        title: "Win " + n + " games in a row — " + (d === "easy" ? "Easy" : d === "moderate" ? "Moderate" : "Hard"),
        desc: "Win " + n + " practice games in a row against " + (d === "easy" ? "Easy" : d === "moderate" ? "Moderate" : "Hard"),
        diff: d, target: n
      }))), []));
      const ACH = { unlocked: {}, streaks: { easy: 0, moderate: 0, hard: 0 } };

      function renderAchievements() {
        const list = $("#ach-list");
        if (!list) return;
        list.innerHTML = "";
        ACH_DEFS.forEach(def => {
          const done = !!ACH.unlocked[def.id];
          const li = document.createElement("li");
          li.className = "ach-item " + (done ? "done" : "locked");
          const medal = document.createElement("span");
          medal.className = "medal"; medal.textContent = "★"; medal.setAttribute("aria-hidden", "true");
          const text = document.createElement("span");
          const b = document.createElement("b"); b.textContent = def.title;
          const desc = document.createElement("span"); desc.className = "ach-desc";
          if (done) desc.textContent = def.desc + " — completed";
          else if (def.diff && ACH.streaks[def.diff] > 0) desc.textContent = def.desc + " · current run: " + ACH.streaks[def.diff] + " in a row";
          else desc.textContent = def.desc;
          text.appendChild(b); text.appendChild(desc);
          li.appendChild(medal); li.appendChild(text);
          list.appendChild(li);
        });
      }

      function trackAchievements(winners) {
        if (!G || G.mode !== "local" || !G.achDiff) return;
        const diff = G.achDiff;
        const won = winners.indexOf(0) >= 0;
        if (won) {
          ACH.streaks[diff] = (ACH.streaks[diff] || 0) + 1;
          [5, 10, 15].forEach(n => { if (ACH.streaks[diff] >= n) ACH.unlocked[diff + n] = true; });
          // The John Pork challenge: win a game where that bot is
          // at the table.
          if (G.players.some(p => p.bot && p.name === "John Pork")) ACH.unlocked.john = true;
        } else {
          ACH.streaks[diff] = 0;
        }
        renderAchievements();
      }
      renderAchievements();

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
        winners.forEach(i => { G.roundWins[i] = (G.roundWins[i] || 0) + 1; });
        trackAchievements(winners);
        // Leaderboard order, first to last: lowest score first; ties
        // broken by most cards remaining, then by not being the
        // Cambio caller — the same order the winner was decided by.
        const ranking = G.players.map((p, i) => i).sort((a, b) =>
          (scores[a] - scores[b]) || (counts[b] - counts[a]) ||
          ((a === G.cambioCaller ? 1 : 0) - (b === G.cambioCaller ? 1 : 0)) || (a - b));
        const data = {
          round: G.round, scores, counts, totals: G.totals.slice(),
          winners, tieNote, cambioCaller: G.cambioCaller, ranking,
          roundWins: G.roundWins.slice(),
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
            : "") + (data.tieNote || "");
        const body = $("#score-body"); body.innerHTML = "";
        const order = (data.ranking && data.ranking.length) ? data.ranking : data.players.map((p, i) => i);
        order.forEach((i, pos) => {
          const p = data.players[i];
          const tr = document.createElement("tr");
          if (data.winners.indexOf(i) >= 0) tr.className = "winner";
          const td0 = document.createElement("td"); td0.textContent = String(pos + 1);
          const td1 = document.createElement("td"); td1.textContent = p.name + (i === data.cambioCaller ? " (called Cambio)" : "");
          const td3 = document.createElement("td"); td3.className = "num"; td3.textContent = data.scores[i];
          const td4 = document.createElement("td"); td4.className = "num"; td4.textContent = (data.roundWins ? data.roundWins[i] : 0);
          tr.appendChild(td0); tr.appendChild(td1); tr.appendChild(td3); tr.appendChild(td4);
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

      /* ---------- Winner fireworks around the scoreboard ----------
         When the final scoreboard pops up, bursts go off around
         the modal (never over its text) for as long as it stays
         open. Canvas-based, pointer-events: none, and skipped
         entirely for reduced-motion. Starts/stops automatically
         by watching the overlay's open class, so it works for
         practice, host and guest screens alike. */
      (function setupFireworks() {
        const overlay = $("#score-overlay");
        const canvas = $("#fireworks-canvas");
        if (!overlay || !canvas || !canvas.getContext) return;
        const ctx = canvas.getContext("2d");
        const COLORS = ["#e3b341", "#ffd76a", "#b3272d", "#ff8a75", "#7ec8a9", "#fdf3d0", "#ffffff"];
        /* Burst spots framing the modal: corners, sides and top —
           deliberately kept away from the centre where the
           scoreboard itself sits. */
        const SPOTS = [
          { x: .10, y: .20 }, { x: .90, y: .18 }, { x: .50, y: .10 },
          { x: .14, y: .52 }, { x: .86, y: .50 }, { x: .26, y: .13 },
          { x: .74, y: .12 }, { x: .08, y: .78 }, { x: .92, y: .76 }
        ];
        let raf = null, timers = [], particles = [], running = false, spotIdx = 0;
        function reducedMotion() {
          return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        }
        function sizeCanvas() {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
          canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        function burst(fx, fy) {
          const cx = fx * window.innerWidth, cy = fy * window.innerHeight;
          const base = COLORS[Math.floor(Math.random() * COLORS.length)];
          const n = 46 + Math.floor(Math.random() * 22);
          for (let i = 0; i < n; i++) {
            const ang = (i / n) * Math.PI * 2 + Math.random() * .18;
            const sp = 1.4 + Math.random() * 3.9;
            particles.push({
              x: cx, y: cy,
              vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - .6,
              life: 1, decay: .008 + Math.random() * .010,
              size: 1.6 + Math.random() * 2.2,
              color: Math.random() < .28 ? "#ffffff" : base
            });
          }
          /* A few falling sparks for the classic firework tail. */
          for (let i = 0; i < 10; i++) {
            particles.push({
              x: cx + (Math.random() - .5) * 30, y: cy + (Math.random() - .5) * 30,
              vx: (Math.random() - .5) * .7, vy: .6 + Math.random() * 1.2,
              life: 1, decay: .012 + Math.random() * .012,
              size: 1.2 + Math.random() * 1.4, color: "#ffd76a"
            });
          }
        }
        function tick() {
          if (!running) return;
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          particles = particles.filter(p => p.life > 0);
          for (const p of particles) {
            p.vy += .045; p.vx *= .985; p.vy *= .992;
            p.x += p.vx; p.y += p.vy; p.life -= p.decay;
            ctx.globalAlpha = Math.max(p.life, 0);
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          }
          ctx.globalAlpha = 1;
          raf = requestAnimationFrame(tick);
        }
        function launchNext(delay) {
          const t = setTimeout(() => {
            if (!running) return;
            const s = SPOTS[spotIdx % SPOTS.length]; spotIdx++;
            burst(s.x, s.y);
            /* Opening volley is brisk, then it settles to a
               gentle burst every second or so while the
               scoreboard stays up. */
            launchNext(spotIdx <= SPOTS.length ? 240 : 1150);
          }, delay);
          timers.push(t);
        }
        function start() {
          if (running || reducedMotion()) return;
          running = true; particles = []; spotIdx = 0;
          sizeCanvas();
          tick();
          launchNext(60);
        }
        function stop() {
          running = false;
          timers.forEach(clearTimeout); timers = [];
          if (raf) cancelAnimationFrame(raf); raf = null;
          particles = [];
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
        window.addEventListener("resize", () => { if (running) sizeCanvas(); });
        new MutationObserver(() => {
          if (overlay.classList.contains("open")) start(); else stop();
        }).observe(overlay, { attributes: true, attributeFilter: ["class"] });
        if (overlay.classList.contains("open")) start();
      })();

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
          /* Red King only: its memory-aid label is red so the
             player can tell at a glance it's the -1 red King,
             not a 10-point black King. All other labels stay black. */
          if (opts.chipRed || (card && card.rank === "K" && card.red) || opts.chip === "K♥" || opts.chip === "K♦") chip.classList.add("red-king");
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
          if (G.snap && G.snap.pendingGive && G.snap.pendingGive.idx === 0) { submitAction(0, { type: "give", slot }); return; }
          if (G.snap && G.snap.failed.has(0)) return;
          if (pIdx === G.cambioCaller) { submitAction(0, { type: "snap", p: pIdx, slot }); return; }
          /* Two-tap snap: first tap lifts/selects the card (still
             face down), second tap on the SAME card snaps it. */
          const topCard = G.discard[G.discard.length - 1];
          const discId = topCard ? topCard.id : null;
          if (localSnapPick && localSnapPick.p === pIdx && localSnapPick.slot === slot && localSnapPick.discId === discId) {
            localSnapPick = null;
            submitAction(0, { type: "snap", p: pIdx, slot });
          } else {
            localSnapPick = { p: pIdx, slot, discId };
            noteTo(0, "Card lifted and selected — tap the same card again to snap it, or tap a different card to change your selection.");
            pokeSnapTimer(6000); // give time for the confirming tap
            blip(500);
            render();
          }
          return;
        }
        if (G.phase === "powerReady") {
          /* Power is ready but no button has been pressed yet —
             card taps deliberately do nothing here. */
          noteTo(0, isHeadsUpGame()
            ? "Press Use power next to your cards to use the power, or Do not use power to skip it — tapping a card first does nothing."
            : "Press Use power next to your cards first, then tap a card to use the power.");
          render();
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
      /* No turn banner above the felt: it appeared and disappeared
         and pushed the whole table up and down. Whose turn it is is
         shown by the gold highlight around that player's area and
         the "Your turn" badge on your own name — all inside the
         felt, so the table never moves. The clockwise order itself
         is shown by the 1st / 2nd / 3rd … badge on every player's
         name — there is deliberately no separate turn-order strip
         on the felt, as the badges say everything it did. */

      const dealSeen = new Set(), dealSeenC = new Set();
      const flipSeen = new Set(), flipSeenC = new Set();
      const fxSeen = new Set(), fxSeenC = new Set();
      /* Power-effect highlight: the animation class for a card the
         first time a given look/swap effect touches it (the seen set
         stops re-renders restarting the animation). Face-up cards
         skip it — the flip animation already shows them being read. */
      function fxClassFor(fx, active, pIdx, slot, seen, faceUp) {
        if (!fx || !active) return "";
        const hit = fx.kind === "look"
          ? (fx.p === pIdx && fx.slot === slot)
          : ((fx.p === pIdx && fx.slot === slot) || (fx.p2 === pIdx && fx.slot2 === slot));
        if (!hit) return "";
        /* A LOOKED-AT card keeps its gold circle for the whole
           time the effect is live — every player must be able to
           see which card was looked at, on every re-render, not
           just the first one. (Face-up cards get it too: the ring
           sits around the card, the flip shows its face only to
           the player using the power.) */
        if (fx.kind === "look") return "fx-look";
        if (faceUp) return "";
        const key = fx.id + "-" + pIdx + "-" + slot;
        if (seen.has(key)) return "";
        seen.add(key);
        return "fx-swap";
      }
      function isLookHit(fx, active, pIdx, slot) {
        return !!(fx && active && fx.kind === "look" && fx.p === pIdx && fx.slot === slot);
      }
      function addLookTag(el) {
        const tag = document.createElement("span");
        tag.className = "look-tag"; tag.textContent = "Looked at";
        el.appendChild(tag);
      }
      /* Power pop-up: "Will is using a Queen" — shown to the
         whole table while a power is being used, so everyone
         knows who they are waiting for. */
      function renderPowerPopup(idx, pw, names) {
        const el = $("#power-popup");
        if (!el) return;
        if (idx === null || idx === undefined || idx < 0 || !pw || !names || !names[idx]) { el.hidden = true; el.textContent = ""; return; }
        const pwName = pw === "king" ? "King" : pw === "queen" ? "Queen" : "Jack";
        el.textContent = names[idx] + " is using a " + pwName;
        el.hidden = false;
      }
      /* Call Cambio button for the LEFT slot beside your cards.
         Always rendered: gold and tappable only when it really is
         your turn to call Cambio, greyed out and disabled at every
         other time (other players' turns, other phases, or once
         Cambio has already been called this round). */
      function makeCambioButton(opts) {
        const b = document.createElement("button");
        b.type = "button"; b.className = "side-cambio-btn";
        b.textContent = "Call Cambio!";
        if (opts && opts.active) {
          if (opts.onClick) b.addEventListener("click", opts.onClick);
        } else {
          b.classList.add("is-unavailable"); b.disabled = true;
          b.setAttribute("aria-disabled", "true");
        }
        return b;
      }
      /* "Do not use power" — one-versus-one ONLY. It sits under
         Use power in the same right-hand slot so the two choices
         read as a pair: use it, or skip it. It is never created
         for tables of three or more, where powers are mandatory. */
      function makeSkipPowerButton(opts) {
        const b = document.createElement("button");
        b.type = "button"; b.className = "skip-power-btn";
        b.textContent = "Do not use power";
        if (opts && opts.onClick) b.addEventListener("click", opts.onClick);
        return b;
      }
      /* The power-ready buttons for the right-hand slot: just
         Use power when powers are mandatory (3+ players), or a
         stacked Use / Do not use pair in one-versus-one. */
      function makePowerReadyButtons(opts) {
        opts = opts || {};
        if (!opts.optional) return makeUsePowerButton({ onClick: opts.onUse });
        const stack = document.createElement("div");
        stack.className = "power-choice-stack";
        stack.appendChild(makeUsePowerButton({ onClick: opts.onUse }));
        stack.appendChild(makeSkipPowerButton({ onClick: opts.onSkip }));
        return stack;
      }
      /* Use power button, in its three states: greyed out (no
         power waiting — the normal state), ready to press (gold),
         or — after it has been pressed — showing the 10-second
         countdown as a translucent sweep + number on top of it. */
      function makeUsePowerButton(opts) {
        const pb = document.createElement("button");
        pb.type = "button"; pb.className = "use-power-btn";
        const label = document.createElement("span"); label.className = "up-label";
        if (opts && opts.unavailable) {
          pb.classList.add("is-unavailable"); pb.disabled = true;
          pb.setAttribute("aria-disabled", "true");
          label.textContent = "✦ Use power";
          pb.appendChild(label);
        } else if (opts && opts.deadline) {
          pb.classList.add("timing"); pb.disabled = true;
          pb.dataset.powerDeadline = String(opts.deadline);
          pb.dataset.powerTotal = String(opts.total || 10000);
          const secs = Math.max(0, Math.ceil((opts.deadline - Date.now()) / 1000));
          label.textContent = "✦ Using power — " + secs + "s left";
          const sweep = document.createElement("span"); sweep.className = "up-sweep";
          const count = document.createElement("span"); count.className = "up-count"; count.textContent = String(secs);
          pb.appendChild(sweep); pb.appendChild(count); pb.appendChild(label);
        } else {
          label.textContent = "✦ Use power";
          pb.appendChild(label);
          if (opts && opts.onClick) pb.addEventListener("click", opts.onClick);
        }
        return pb;
      }
      /* One ticker keeps every on-screen power countdown honest:
         it updates the translucent number, the sweep and the
         label from the button's deadline, wherever it is. */
      setInterval(() => {
        document.querySelectorAll("[data-power-deadline]").forEach(btn => {
          const dl = Number(btn.dataset.powerDeadline), total = Number(btn.dataset.powerTotal) || 10000;
          const rem = Math.max(0, dl - Date.now());
          const secs = Math.ceil(rem / 1000);
          const count = btn.querySelector(".up-count"); if (count) count.textContent = String(secs);
          const sweep = btn.querySelector(".up-sweep"); if (sweep) sweep.style.width = Math.min(100, Math.max(0, (1 - rem / total) * 100)) + "%";
          const label = btn.querySelector(".up-label"); if (label) label.textContent = rem > 0 ? "✦ Using power — " + secs + "s left" : "✦ Time's up";
        });
      }, 100);
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
      /* Shared builder for the wheel spinner panel (every game).
         opts: names (the players still ON the wheel for this spin),
         allNames (every player, for the decided-order list),
         viewerIdx (index into names, or -1 if the viewer is already
         placed / not on this wheel), wheel (normalised, or null) */
      const WHEEL_COLORS = ["#b3272d", "#146638", "#12598c", "#c1912a", "#5f2f68", "#12736b"];
      let wheelAnimKey = null;
      function ordinalLabel(n) { return n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : n + "th"; }
      function buildWheelPanel(opts) {
        const panel = $("#wheel-panel");
        const w = opts.wheel;
        if (!w || !w.active) { panel.hidden = true; panel.innerHTML = ""; return; }
        panel.hidden = false; panel.innerHTML = "";
        const h = document.createElement("h3");
        h.textContent = w.done ? "Turn order decided!" : "Deciding the turn order — spinning for " + ordinalLabel(w.spinForPos || 1);
        panel.appendChild(h);
        const wrap = document.createElement("div"); wrap.className = "wheel-wrap";
        const pointer = document.createElement("div"); pointer.className = "wheel-pointer";
        wrap.appendChild(pointer);
        const disc = document.createElement("div"); disc.className = "wheel-disc";
        const displayNames = opts.names.length ? opts.names : (w.orderNames || []);
        const n = Math.max(displayNames.length, 1), seg = 360 / n;
        disc.style.background = "conic-gradient(" + displayNames.map((nm, i) => WHEEL_COLORS[i % WHEEL_COLORS.length] + " " + (i * seg) + "deg " + ((i + 1) * seg) + "deg").join(", ") + ")";
        displayNames.forEach((nm, i) => {
          const lab = document.createElement("div"); lab.className = "wheel-label";
          lab.style.transform = "rotate(" + (i * seg + seg / 2) + "deg)";
          const sp = document.createElement("span"); sp.textContent = nm + (i === opts.viewerIdx ? " (you)" : "");
          lab.appendChild(sp); disc.appendChild(lab);
        });
        wrap.appendChild(disc);
        const hub = document.createElement("div"); hub.className = "wheel-hub"; hub.textContent = "★";
        wrap.appendChild(hub);
        panel.appendChild(wrap);
        const st = document.createElement("p"); st.className = "fd-status";
        if (w.done) st.textContent = "Turn order: " + (w.orderNames || []).join(" → ") + " — dealing 4 cards each…";
        else if (w.intro) st.textContent = "Get ready — the wheel is about to spin for " + ordinalLabel(w.spinForPos || 1) + "…";
        else if (w.spinning) st.textContent = "Spinning for " + ordinalLabel(w.spinForPos || 1) + "…";
        else st.textContent = (opts.names[w.winner] || "") + " takes " + ordinalLabel(w.spinForPos || 1) + " — next spin coming up…";
        panel.appendChild(st);
        if (w.orderNames && w.orderNames.length) {
          const ord = document.createElement("p");
          ord.textContent = "Decided so far: " + w.orderNames.map((nm, i) => ordinalLabel(i + 1) + " " + nm).join(" · ");
          panel.appendChild(ord);
        }
        const key = (w.startedAt || 0) + "-" + w.rotation;
        if (!w.spinning) {
          wheelAnimKey = key;
          disc.style.transform = "rotate(" + w.rotation + "deg)";
        } else if (wheelAnimKey !== key) {
          wheelAnimKey = key;
          disc.style.transform = "rotate(0deg)";
          requestAnimationFrame(() => requestAnimationFrame(() => {
            disc.style.transition = "transform " + w.durationMs + "ms cubic-bezier(.1,.7,.08,1)";
            disc.style.transform = "rotate(" + w.rotation + "deg)";
          }));
        } else {
          disc.style.transform = "rotate(" + w.rotation + "deg)";
        }
      }

      /* Shared builder for the draw-to-go-first panel. opts:
         names, fd (normalised), viewerIdx, onPick(fanIdx) or null */
      function buildFirstDrawPanel(opts) {
        const panel = $("#first-draw-panel");
        if (!panel) return; // the draw-a-card panel has been removed — the wheel decides the order now
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
        if (G.phase !== "snap") localSnapPick = null;
        renderPowerPopup(G.powerPopupIdx, G.powerPopupPw, G.players.map(p => p.name));
        buildWheelPanel({
          names: !G.wheel ? [] : (G.wheel.remaining && G.wheel.remaining.length ? G.wheel.remaining.map(i => G.players[i].name) : (G.wheel.order || []).map(i => G.players[i].name)),
          viewerIdx: !G.wheel || !G.wheel.remaining ? -1 : G.wheel.remaining.indexOf(0),
          wheel: !G.wheel ? null : {
            active: G.phase === "wheel", spinning: !!G.wheel.spinning,
            winner: (G.wheel.winnerPos !== undefined && G.wheel.winnerPos >= 0) ? G.wheel.winnerPos : 0, rotation: G.wheel.rotation,
            durationMs: G.wheel.durationMs, startedAt: G.wheel.startedAt,
            spinForPos: G.wheel.spinForPos, done: !!G.wheel.done, intro: !!G.wheel.intro,
            orderNames: (G.wheel.order || []).map(i => G.players[i].name)
          }
        });
        $("#round-label").textContent = "Round " + G.round + (G.code ? " · Table " + G.code : "");
        $("#memory-chip").textContent = "Memory aid: " + (G.memoryAid === false ? "Off" : "On");
        $("#you-name").textContent = "";
        (function(){
          const ord = (G.turnOrder && G.turnOrder.length) ? G.turnOrder : G.players.map((p, i) => i);
          const pos = ord.indexOf(0);
          if (pos >= 0 && G.phase !== "wheel") {
            const ob = document.createElement("span"); ob.className = "order-badge"; ob.textContent = ordinal(pos + 1);
            $("#you-name").appendChild(ob);
          }
          const nt = document.createElement("span"); nt.textContent = G.players[0].name + " (you)";
          $("#you-name").appendChild(nt);
        })();
        if (G.turn === 0 && G.phase !== "over" && G.phase !== "peek") {
          const b = document.createElement("span"); b.className = "turn-badge"; b.textContent = "Your turn";
          $("#you-name").appendChild(b);
        }
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
        /* Opponents sit across the top of the felt, left to right in
           CLOCKWISE turn order from you: you are at the bottom, so
           going clockwise you meet the player who plays straight
           after you first (far left), then the next, and the player
           who plays just before you last (far right). Their seats
           therefore follow the decided 1-2-3-4 order around the
           table — e.g. order Marco, You, Ada, Priya shows Ada,
           Priya, Marco across the top, wrapping back to you. */
        const cwOrder = (G.turnOrder && G.turnOrder.length === G.players.length) ? G.turnOrder : G.players.map((p, i) => i);
        const cwYouPos = cwOrder.indexOf(0);
        const cwOpponents = [];
        for (let k = 1; k < cwOrder.length; k++) cwOpponents.push(cwOrder[(cwYouPos + k) % cwOrder.length]);
        cwOpponents.forEach((i) => {
          const p = G.players[i];
          const zone = document.createElement("div");
          zone.className = "player-zone" + (G.turn === i && G.phase !== "over" ? " active" : "") + (G.cambioCaller === i ? " cambio-immune" : "");
          const name = document.createElement("div"); name.className = "pname";
          if (G.phase !== "wheel") {
            const ob = document.createElement("span"); ob.className = "order-badge"; ob.textContent = ordinal(cwOrder.indexOf(i) + 1);
            name.appendChild(ob);
          }
          const nt = document.createElement("span"); nt.textContent = p.name;
          name.appendChild(nt);
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
            if (G.phase === "snap" && localSnapPick && localSnapPick.p === i && localSnapPick.slot === s && c && localSnapPick.discId === (G.discard[G.discard.length - 1] || {}).id) el.classList.add("snap-armed");
            const fxc = fxClassFor(G.fx, G.fx && Date.now() < G.fx.until, i, s, fxSeen, faceUp);
            if (fxc) el.classList.add(fxc);
            if (isLookHit(G.fx, G.fx && Date.now() < G.fx.until, i, s)) addLookTag(el);
            if (G.phase === "peek" && c) maybeDealAnim(dealSeen, el, c, ((turnOrderPos(i) - turnOrderPos(G.starter) + G.players.length) % G.players.length) * 4 + s);
            else { noteHandAnim(animPrev, i, s, c, el); maybeFlipAnim(flipSeen, el, c, !!faceUp); }
            hand.appendChild(el);
          });
          zone.appendChild(hand);
          if (G.cambioCaller === i) { zone.appendChild(makeCambioStamp(G.round + "-" + i)); zone.appendChild(makeImmuneBadge()); }
          opps.appendChild(zone);
        });

        // While the wheel is deciding the turn order, the draw and
        // discard piles stay off the table — they only appear once
        // the game begins and everyone's four cards are down.
        const pilesEl = $("#piles");
        if (pilesEl) pilesEl.style.display = G.phase === "wheel" ? "none" : "";
        /* While the wheel is spinning, the wheel is ALL that shows
           on the felt — nothing below it at all: the seats, your
           own area (name, gold turn ring, "Your turn" badge,
           cards), the status line and the controls all stay hidden
           until the game itself begins. */
        const wheelOnly = G.phase === "wheel";
        ["#opponents", "#you-zone", "#status", "#controls"].forEach(sel => {
          const el = $(sel); if (el) el.style.display = wheelOnly ? "none" : "";
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
          $("#discard-label").textContent = "Tap to put drawn card here";
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
          if (G.phase === "snap" && localSnapPick && localSnapPick.p === 0 && localSnapPick.slot === s && c && localSnapPick.discId === (G.discard[G.discard.length - 1] || {}).id) el.classList.add("snap-armed");
          const fxc = fxClassFor(G.fx, G.fx && Date.now() < G.fx.until, 0, s, fxSeen, faceUp);
          if (fxc) el.classList.add(fxc);
          if (isLookHit(G.fx, G.fx && Date.now() < G.fx.until, 0, s)) addLookTag(el);
          if (G.phase === "peek" && c && faceUp) maybeFlipAnim(flipSeen, el, c, true);
          else if (G.phase === "peek" && c) maybeDealAnim(dealSeen, el, c, ((turnOrderPos(0) - turnOrderPos(G.starter) + G.players.length) % G.players.length) * 4 + s);
          else { noteHandAnim(animPrev, 0, s, c, el); maybeFlipAnim(flipSeen, el, c, !!faceUp); }
          yh.appendChild(el);
        });

        youZone.querySelectorAll(".cambio-stamp, .immune-badge").forEach(el => el.remove());
        if (G.cambioCaller === 0) { youZone.appendChild(makeCambioStamp(G.round + "-0")); youZone.appendChild(makeImmuneBadge()); }
        /* Side buttons beside your cards — never beneath them, so
           on a phone neither needs scrolling down to. LEFT slot:
           Call Cambio, gold only on your turn in the choose-a-card
           phase when nobody has called yet, greyed out otherwise.
           RIGHT slot: Use power, gold only when you have just put
           down a Jack / Queen / King, greyed out otherwise (and
           showing its countdown once pressed). Both buttons are
           ALWAYS in their fixed slots, so nothing ever moves. */
        (function(){
          const left = $("#you-left");
          if (left) {
            left.innerHTML = "";
            const canCambio = G.turn === 0 && G.phase === "chooseSource" && G.cambioCaller === null;
            left.appendChild(makeCambioButton({ active: canCambio, onClick: () => submitAction(0, { type: "cambio" }) }));
          }
          const right = $("#you-right");
          if (right) {
            right.innerHTML = "";
            if (G.phase === "powerReady" && G.powerAwaitIdx === 0) {
              /* 3+ players: Use power only (mandatory). 1v1: the
                 Use / Do not use pair (optional). */
              right.appendChild(makePowerReadyButtons({
                optional: isHeadsUpGame(),
                onUse: () => submitAction(0, { type: "usePower" }),
                onSkip: () => submitAction(0, { type: "skipPower" })
              }));
            } else if (G.phase === "powerTarget" && G.powerUserIdx === 0 && G.powerDeadline) {
              right.appendChild(makeUsePowerButton({ deadline: G.powerDeadline, total: 10000 }));
            } else {
              right.appendChild(makeUsePowerButton({ unavailable: true }));
            }
          }
        })();

        // contextual controls for the local player (Call Cambio
        // no longer lives here — it is in the left slot, above)
        const btns = [];
        if (G.phase === "peek") {
          if (G.readySet.has(0)) btns.push({ label: "Waiting for the other players…", disabled: true });
          else btns.push({ label: "Got it — start round " + G.round, cls: "gold", fn: () => submitReady(0) });
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
      function serverUrl() {
        const q = new URLSearchParams(location.search);
        return q.get("server") || window.CAMBIO_SERVER || location.origin;
      }
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
      function socketAvailable() { return typeof window.io !== "undefined" && window.io && typeof window.io.connect === "function"; }
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
          return faceUp ? Object.assign(pubCard(c), { faceUp: true }) : { id: c.id, hidden: true, chip, chipRed: !!(c && c.rank === "K" && c.red) };
        }
        let drawn = null;
        if (G.drawn) {
          const pub = G.drawnFrom === "discard";
          drawn = {
            from: G.drawnFrom, owner: G.turn,
            card: (G.turn === viewerIdx || pub) ? Object.assign(pubCard(G.drawn), { faceUp: true }) : { id: G.drawn.id, hidden: true }
          };
        }
        const fd = null; // draw-a-card removed — the wheel decides the order in every game
        return {
          round: G.round, code: G.code, turn: G.turn, phase: G.phase,
          turnOrder: G.turnOrder ? G.turnOrder.slice() : null, turnPos: G.turnPos || 0,
          powerStage: G.powerStage, pendingPower: G.pendingPower, powerAwaitIdx: (G.powerAwaitIdx === undefined ? null : G.powerAwaitIdx),
          powerDeadline: G.powerDeadline || null, powerUserIdx: (G.powerUserIdx === undefined ? null : G.powerUserIdx),
          powerPopupIdx: (G.powerPopupIdx === undefined ? null : G.powerPopupIdx), powerPopupPw: G.powerPopupPw || null,
          cambioCaller: G.cambioCaller,
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
          wheel: (G.wheel && G.phase === "wheel") ? {
            active: true, spinning: !!G.wheel.spinning, winner: G.wheel.winner, winnerPos: G.wheel.winnerPos,
            rotation: G.wheel.rotation, durationMs: G.wheel.durationMs, startedAt: G.wheel.startedAt,
            remaining: (G.wheel.remaining || []).slice(), order: (G.wheel.order || []).slice(),
            spinForPos: G.wheel.spinForPos, done: !!G.wheel.done, intro: !!G.wheel.intro
          } : null,
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
        $("#host-size").value = "4";
        $("#host-diff").value = settings.difficulty;
        setToggleValue($("#host-memory"), settings.memoryAid);
        applyAppearance();
        setToggleValue($("#lobby-memory"), settings.memoryAid);
        $("#host-form").hidden = false; $("#host-lobby").hidden = true;
        $("#host-err").textContent = "";
        show("host");
      });
      $("#host-create").addEventListener("click", async () => {
        const err = $("#host-err");
        const nm = await askPlayerName("Hosting a table", "Choose the name your guests will see in your lobby.");
        if (nm === null) return;
        settings.name = nm;
        settings.difficulty = $("#host-diff").value;
        settings.memoryAid = $("#host-memory").value === "on";
        settings.pack = $("#host-pack").value; settings.felt = $("#host-felt").value;
        applyAppearance(); syncSettingsForm();
        if (!socketAvailable()) { err.textContent = "Online play couldn't load its connection tools — check your internet connection and try again. Practice games against the computer still work."; return; }
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
          setToggleValue($("#lobby-memory"), lobby.memoryAid);
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
        setToggleValue($("#host-memory"), settings.memoryAid);
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
        pickBotNames(Math.max(0, lobby.size - players.length), players.map(p => p.name)).forEach(name => players.push({ name, bot: true, conn: null }));
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
        $("#join-err").textContent = "";
        show("join");
      });
      $("#join-play-local").addEventListener("click", () => { $("#btn-play").click(); });
      $("#join-go").addEventListener("click", async () => {
        const err = $("#join-err");
        const code = $("#join-code").value.trim().toUpperCase();
        if (code.length !== 5) { err.textContent = "Table codes are 5 letters — check the code your host sent you and try again."; return; }
        const nm = await askPlayerName("Joining table " + code, "Choose the name the other players will see in the lobby.");
        if (nm === null) return;
        const name = nm;
        settings.name = nm;
        if (!socketAvailable()) { err.textContent = "Online play couldn't load its connection tools — check your internet connection and try again."; return; }
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
          if (v.pendingGiveMe) { guestSend({ type: "give", slot }); return; }
          if (v.snapFailedMe) return;
          if (pIdx === v.cambioCaller) { guestSend({ type: "snap", p: pIdx, slot }); return; }
          /* Two-tap snap, same as the host's screen: first tap
             lifts/selects, second tap on the same card snaps. */
          const discId = v.discardId || (v.discardTop ? v.discardTop.id : null);
          if (guestSnapPick && guestSnapPick.p === pIdx && guestSnapPick.slot === slot && guestSnapPick.discId === discId) {
            guestSnapPick = null;
            guestSend({ type: "snap", p: pIdx, slot });
          } else {
            guestSnapPick = { p: pIdx, slot, discId };
            guestSend({ type: "snapArm", p: pIdx, slot }); // asks the host to hold the snap window open
            renderGuest();
          }
          return;
        }
        if (v.phase === "powerReady") return; // must press Use power first — taps do nothing
        if (v.phase === "chooseSwap" && pIdx === C.myIdx) guestSend({ type: "swap", slot });
        else if (v.phase === "powerTarget") guestSend({ type: "target", p: pIdx, slot });
      }
      function guestCardEl(vc, opts) {
        if (!vc) return cardEl(null, opts || {});
        if (vc.hidden) {
          const el = cardEl({ hidden: true }, {});
          if (vc.chip) { const chip = document.createElement("span"); chip.className = "known-chip"; if (vc.chipRed || vc.chip === "K♥" || vc.chip === "K♦") chip.classList.add("red-king"); chip.textContent = vc.chip; el.appendChild(chip); }
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
        renderPowerPopup(v.powerPopupIdx, v.powerPopupPw, names);
        buildWheelPanel({
          names: !v.wheel ? [] : ((v.wheel.remaining && v.wheel.remaining.length) ? v.wheel.remaining.map(i => names[i]) : (v.wheel.order || []).map(i => names[i])),
          viewerIdx: !v.wheel || !v.wheel.remaining ? -1 : v.wheel.remaining.indexOf(me),
          wheel: !v.wheel ? null : Object.assign({}, v.wheel, {
            winner: (v.wheel.winnerPos !== undefined && v.wheel.winnerPos >= 0) ? v.wheel.winnerPos : 0,
            orderNames: (v.wheel.order || []).map(i => names[i])
          })
        });
        $("#round-label").textContent = "Round " + v.round + (v.code ? " · Table " + v.code : "");
        $("#memory-chip").textContent = "Memory aid: " + (v.memoryAid ? "On" : "Off") + " (set by host)";
        $("#you-name").textContent = "";
        (function(){
          const ord = (v.turnOrder && v.turnOrder.length) ? v.turnOrder : names.map((nm, i) => i);
          const pos = ord.indexOf(me);
          if (pos >= 0 && v.phase !== "wheel") {
            const ob = document.createElement("span"); ob.className = "order-badge"; ob.textContent = ordinal(pos + 1);
            $("#you-name").appendChild(ob);
          }
          const nt = document.createElement("span"); nt.textContent = (names[me] || "You") + " (you)";
          $("#you-name").appendChild(nt);
        })();
        if (v.turn === me && v.phase !== "over" && v.phase !== "peek") {
          const b = document.createElement("span"); b.className = "turn-badge"; b.textContent = "Your turn";
          $("#you-name").appendChild(b);
        }
        const statusEl = $("#status");
        statusEl.textContent = (v.phase === "snap" && guestSnapPick) ? "Card lifted and selected — tap the same card again to snap it, or tap a different card to change your selection." : (v.status || "");
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
        /* Same clockwise seating as the host's screen: opponents
           left to right in clockwise turn order from you (the
           player after you first, the player before you last),
           each badged with their 1st / 2nd / 3rd … position. */
        const cwOrderG = (v.turnOrder && v.turnOrder.length === v.players.length) ? v.turnOrder : v.players.map((p, i) => i);
        const cwYouPosG = cwOrderG.indexOf(me);
        const cwOpponentsG = [];
        for (let k = 1; k < cwOrderG.length; k++) cwOpponentsG.push(cwOrderG[(cwYouPosG + k) % cwOrderG.length]);
        cwOpponentsG.forEach((i) => {
          const p = v.players[i];
          const zone = document.createElement("div");
          zone.className = "player-zone" + (v.turn === i && v.phase !== "over" ? " active" : "") + (v.cambioCaller === i ? " cambio-immune" : "");
          const name = document.createElement("div"); name.className = "pname";
          if (v.phase !== "wheel") {
            const ob = document.createElement("span"); ob.className = "order-badge"; ob.textContent = ordinal(cwOrderG.indexOf(i) + 1);
            name.appendChild(ob);
          }
          const nt = document.createElement("span"); nt.textContent = p.name;
          name.appendChild(nt);
          if (v.turn === i && v.phase !== "over") { const b = document.createElement("span"); b.className = "turn-badge"; b.textContent = "Turn"; name.appendChild(b); }
          if (v.cambioCaller === i) { const th = document.createElement("span"); th.className = "thinking"; th.textContent = " · called Cambio!"; name.appendChild(th); }
          zone.appendChild(name);
          const hand = document.createElement("div");
          hand.className = "hand" + (p.hand.length > 4 ? " wide" : "");
          p.hand.forEach((vc, s) => {
            const tappable = guestCanTap(v, i, s);
            const el = guestCardEl(vc, { tappable, onClick: () => guestCardAction(v, i, s) });
            if (v.phase === "snap" && guestSnapPick && guestSnapPick.p === i && guestSnapPick.slot === s && vc && guestSnapPick.discId === (v.discardId || (v.discardTop ? v.discardTop.id : null))) el.classList.add("snap-armed");
            const fxc = fxClassFor(v.fx, !!v.fx, i, s, fxSeenC, !!(vc && vc.faceUp));
            if (fxc) el.classList.add(fxc);
            if (isLookHit(v.fx, !!v.fx, i, s)) addLookTag(el);
            noteHandAnim(animPrevG, i, s, vc, el);
            maybeFlipAnim(flipSeenC, el, vc, !!(vc && vc.faceUp));
            hand.appendChild(el);
          });
          zone.appendChild(hand);
          if (v.cambioCaller === i) { zone.appendChild(makeCambioStamp(v.round + "-" + i)); zone.appendChild(makeImmuneBadge()); }
          opps.appendChild(zone);
        });
        // Same rule for guests: no piles on screen during the wheel.
        const pilesElG = $("#piles");
        if (pilesElG) pilesElG.style.display = v.phase === "wheel" ? "none" : "";
        // And nothing else below the wheel either — same as the host.
        const wheelOnlyG = v.phase === "wheel";
        ["#opponents", "#you-zone", "#status", "#controls"].forEach(sel => {
          const el = $(sel); if (el) el.style.display = wheelOnlyG ? "none" : "";
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
          $("#discard-label").textContent = "Tap to put drawn card here";
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
          if (v.phase === "snap" && guestSnapPick && guestSnapPick.p === me && guestSnapPick.slot === s && vc && guestSnapPick.discId === (v.discardId || (v.discardTop ? v.discardTop.id : null))) el.classList.add("snap-armed");
          const fxc = fxClassFor(v.fx, !!v.fx, me, s, fxSeenC, !!(vc && vc.faceUp));
          if (fxc) el.classList.add(fxc);
          if (isLookHit(v.fx, !!v.fx, me, s)) addLookTag(el);
          noteHandAnim(animPrevG, me, s, vc, el);
          maybeFlipAnim(flipSeenC, el, vc, !!(vc && vc.faceUp));
          yh.appendChild(el);
        });
        youZone.querySelectorAll(".cambio-stamp, .immune-badge").forEach(el => el.remove());
        if (v.cambioCaller === me) { youZone.appendChild(makeCambioStamp(v.round + "-" + me)); youZone.appendChild(makeImmuneBadge()); }
        if (v.phase !== "snap") guestSnapPick = null;
        /* Side buttons beside your cards, same as the host's
           screen — never beneath them. LEFT: Call Cambio, gold
           only on your turn when you can call it, greyed out at
           every other time. RIGHT: Use power, gold only when you
           have just put down a Jack / Queen / King, greyed out
           otherwise, and showing the host's real 10-second
           countdown once pressed. Both always sit in their fixed
           slots, so nothing ever moves. */
        (function(){
          const left = $("#you-left");
          if (left) {
            left.innerHTML = "";
            const canCambio = v.turn === me && v.phase === "chooseSource" && (v.cambioCaller === null || v.cambioCaller === undefined);
            left.appendChild(makeCambioButton({ active: canCambio, onClick: () => guestSend({ type: "cambio" }) }));
          }
          const right = $("#you-right");
          if (right) {
            right.innerHTML = "";
            if (v.phase === "powerReady" && v.powerAwaitIdx === me) {
              /* 3+ players: Use power only (mandatory). 1v1: the
                 Use / Do not use pair (optional) — player count
                 comes from the view's own player list. */
              right.appendChild(makePowerReadyButtons({
                optional: !!(v.players && v.players.length === 2),
                onUse: () => guestSend({ type: "usePower" }),
                onSkip: () => guestSend({ type: "skipPower" })
              }));
            } else if (v.phase === "powerTarget" && v.powerUserIdx === me && v.powerDeadline) {
              right.appendChild(makeUsePowerButton({ deadline: v.powerDeadline, total: 10000 }));
            } else {
              right.appendChild(makeUsePowerButton({ unavailable: true }));
            }
          }
        })();
        const btns = [];
        if (v.phase === "peek") {
          if ((v.ready || []).indexOf(me) >= 0) btns.push({ label: "Waiting for the other players…", disabled: true });
          else btns.push({ label: "Got it — start round " + v.round, cls: "gold", fn: () => guestSend({ type: "ready" }) });
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
    