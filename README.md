# Cambio — public website (online multiplayer)

A standalone, deployable version of the Cambio card game. **Not the Muse artifact** — this is a separate project you own, for real hosting.

## How it works

- `public/` — the game website (home: Play / Host Game / Join Game / How to Play / Settings, 2–6 players, 54-card deck, snaps, mandatory J/Q/K powers after a ~4s snap window, Cambio call, tie-break, draw-to-go-first, card-memory setting, Easy/Moderate/Hard AI solo play, card packs + felt colours).
- `server.js` — a Node + Socket.IO server, the "server in the middle". It creates lobbies with a 5-character code, deals, holds every hand server-side, and only sends each player *their own* cards. It broadcasts the public state (turn, top discard, snap window) and validates moves. No PeerJS.
- Solo play works without a server. Online play needs the server running.

## Deploy — free, in about 15 minutes

You need three free accounts (all free to start): **GitHub, Vercel, Render**.

### 1. Put the code on GitHub
1. Create a new GitHub repository (e.g. `cambio-game`), public or private.
2. Upload this whole folder, or from a terminal in this folder:
   ```
   git init && git add . && git commit -m "Cambio website"
   git remote add origin https://github.com/YOURNAME/cambio-game.git
   git push -u origin main
   ```

### 2. Deploy the server on Render (free)
1. Go to render.com → sign up / log in → **New → Blueprint** → connect the GitHub repo.
2. `render.yaml` in this repo does the rest: Node, `npm install`, `npm start`, free plan.
3. Wait for it to go live and copy its URL, e.g. `https://cambio-server.onrender.com`
4. Check it: open `https://cambio-server.onrender.com/health` — you should see `{"ok":true}`.

> **Free Render sleeps:** after ~15 minutes with no players, the free server sleeps. The first connection after a sleep can take **30–50 seconds** — the game shows a "server may be waking up" note while it waits. Paid Render (~$7/month) stays awake. This is the normal free-tier trade-off.

### 3. Deploy the website on Vercel (free)
1. Go to vercel.com → sign up / log in → **Add New → Project** → import the same GitHub repo.
2. Framework: leave as "Other". Root directory: `.` (the repo root). Vercel serves `public/` via `vercel.json`.
3. Deploy. You get a free URL like `https://cambio-game.vercel.app`

### 4. Point the website at the server
Edit `public/config.js` and set:
```js
window.CAMBIO_SERVER = 'https://cambio-server.onrender.com';
```
Commit + push — Vercel redeploys automatically in a minute or two. (Or pass `?server=https://cambio-server.onrender.com` in the page URL to test without editing.)

### 5. Test it
Open the Vercel URL on your phone and on a computer (or two browsers). Host a game, copy the 5-letter code, join from the other device, and play a full round.

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
