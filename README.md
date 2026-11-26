# Cambio — public website (online multiplayer)

A standalone, deployable version of the Cambio card game. **Now ported from the canonical Muse version** (the game as it plays in Muse), so the public site works exactly the same as the game Will built there — same look, same rules, same pace and animations. It is a separate project you own, for real hosting.

## What changed in this rebuild (25 November 2026)

- `public/index.html`, `public/style.css` and `public/client.js` are now the canonical game itself, split into three files: the light-cream theme, DM Serif Display / DM Sans, serif "Cambio" heading, icon-tile menu, Settings, Host options, pack/felt previews, detailed How to Play, and all animations (flying cards, bending flips, slow pace, turn banner, snap slam, CAMBIO! stamp) are byte-for-byte the canonical ones.
- **The start bugs Will found testing with Alex are fixed:**
  - Draw-to-go-first: one pick per player, and the game now shows "You picked X — waiting for Alex…" / "Waiting for <name> to pick" at every gate, with tied players redrawn from a fresh fan.
  - Your hand is face-down in a 2×2 square (not face-up in a row), and you peek at your two nearest cards like the canonical game.
  - Peek is per-player: each player taps "Got it — start round" for themselves; there is no longer a phase only the draw winner can advance, so the first turn is drawable immediately after peek/deal.
- **Online AI:** empty seats are filled with computer players at the host's chosen difficulty (Easy / Moderate / Hard, Hard has perfect memory), and if a human guest leaves mid-game a computer player takes over their seat — matching the canonical rules.
- **Online hands are face-down** to their owner except for legitimately peeked/spied cards, with memory-aid reminder labels only when the host turned memory on for the whole table.
- **The server changed role:** `server.js` used to own the deck, hands and rules (a separate, simplified game). It is now a dumb relay only — it just forwards messages between the host's browser and the guests in the same 5-letter room, stores nothing, and never sees a hand. The host's browser runs the game, exactly as in the canonical version. That is what makes the two versions play identically.
- The old authoritative server logic is **not** in this folder any more (a backup copy is kept outside the repo by Muse, not uploaded). If the relay ever needs to be reverted, ask Muse for it.

## How it works

- `public/` — the game website (home: Play / Join Game / Host Game / How to Play / Settings, 2–6 players, 54-card deck, draw-to-go-first, peek at 2 nearest cards, draw or take top discard — discard card must be swapped in, drawn card may be discarded straight — snaps, failed-snap penalty card, mandatory J/Q/K powers after a ~4s snap window, Cambio call with caller immunity, tie-break: lowest score, then most cards, then non-caller wins, card-memory setting, Easy/Moderate/Hard AI, card packs + felt colours with previews, game pace and sounds).
- `server.js` — a Node + Socket.IO relay (see above). It creates no game state; it only routes messages by 5-letter room code. No PeerJS, no MQTT.
- `public/config.js` — points the site at the Render server: `https://cambio-server-tukm.onrender.com`.
- Solo play works without a server. Online play needs the server running.

## Deploy — free, in about 15 minutes

You need three free accounts (all free to start): **GitHub, Vercel, Render**.

### 1. Put the code on GitHub
The repo is already `willfeno/Cambio`. Upload the changed files one at a time from your phone, as before, replacing the old versions:
- `server.js`, `README.md`, `package.json`, `render.yaml`, `vercel.json` (root)
- `public/index.html`, `public/client.js`, `public/style.css`, `public/config.js` (in `public/`)

Do **not** upload `node_modules/` — Render installs dependencies itself from `package.json`.

### 2. Deploy the server on Render (free)
Already set up: `render.yaml` in this repo deploys it (Node, `npm install`, `npm start`, free plan). After the new files are pushed, Render redeploys automatically — same URL: `https://cambio-server-tukm.onrender.com`. Check it: open `https://cambio-server-tukm.onrender.com/health` — you should see `{"ok":true,"rooms":0}`.

> **Free Render sleeps:** after ~15 minutes with no players, the free server sleeps. The first connection after a sleep can take **30–50 seconds** — the game shows a "server may be waking up" note while it waits. Paid Render (~$7/month) stays awake. This is the normal free-tier trade-off.

### 3. Deploy the website on Vercel (free)
Already set up: Vercel serves `public/` via `vercel.json` from the same GitHub repo. After the new files are pushed, Vercel redeploys automatically — same URL: `https://cambio-woad.vercel.app`.

### 4. Point the website at the server
Already done: `public/config.js` is set to `https://cambio-server-tukm.onrender.com`. (Or pass `?server=https://cambio-server-tukm.onrender.com` in the page URL to test without editing.)

### 5. Test it
Open the Vercel URL on your phone and on a computer (or two browsers). Host a game, copy the 5-letter code, join from the other device, and play a full round: draw to go first, peek, first turn, snap, a J/Q/K power, call Cambio, finish.

## A domain — optional
You do **not** need a domain to start: the free `*.vercel.app` and `*.onrender.com` URLs work. If you want one later (e.g. `cambiogame.co.uk`, ~£10–15/year from Namecheap / Cloudflare / GoDaddy), buy it and in Vercel go to Settings → Domains → add it; Vercel tells you the DNS record to add. No code change needed.

## Run it locally (optional)
```
npm install
npm start
# open http://localhost:3000
```

## Costs
- GitHub, Vercel Hobby, Render Free: **£0** to start.
- Later, if lots of people play: Render paid plan (~$7/month) to stop the sleep, and a domain (~£10–15/year). App Store / Google Play are a separate step for later — Apple Developer $99/year, Google Play $25 one-off — and are not needed for the website.
