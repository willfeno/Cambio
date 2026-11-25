/* Cambio — authoritative Socket.IO server.
 * One Node process serves public/ and the /socket.io endpoint.
 * The server owns the deck, every hand, the turn and the discard pile.
 * A player is only ever sent their OWN cards face-up. Opponents are
 * sent only a card count (and, when a card is turned over by a snap /
 * power, that one card). This is what makes hidden hands real online.
 * No PeerJS anywhere.
 */
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req, res) => res.json({ ok: true, rooms: rooms.size }));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

/* ---------- cards ---------- */
const SUITS = [
  { s: '♥', color: 'red' }, { s: '♦', color: 'red' },
  { s: '♣', color: 'black' }, { s: '♠', color: 'black' },
];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
function cardValue(rank, suit) {
  if (rank === 'JOKER') return 0;
  if (rank === 'A') return 1;
  if (rank === 'J' || rank === 'Q') return 10;
  if (rank === 'K') return suit === '♥' || suit === '♦' ? -1 : 10;
  return parseInt(rank, 10);
}
function buildDeck() {
  const d = [];
  let id = 0;
  for (const { s, color } of SUITS)
    for (const r of RANKS) d.push({ id: id++, rank: r, suit: s, color, value: cardValue(r, s) });
  d.push({ id: id++, rank: 'JOKER', suit: '★', color: 'red', value: 0 });
  d.push({ id: id++, rank: 'JOKER', suit: '★', color: 'black', value: 0 });
  return shuffle(d);
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
function handScore(hand) { return hand.reduce((t, c) => t + c.value, 0); }

/* ---------- rooms ---------- */
const rooms = new Map(); // code -> room
function makeCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let c = ''; do { c = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''); } while (rooms.has(c));
  return c;
}
function newRoom(hostSocket, name, opts) {
  const code = makeCode();
  const room = {
    code, hostId: hostSocket.id, memoryAid: !!opts.memoryAid,
    pack: opts.pack || 'Classic', felt: opts.felt || 'green',
    phase: 'lobby', players: [], deck: [], discard: [], drawFirst: null,
    turnIndex: 0, currentDraw: null, snapUntil: 0, pendingPower: null,
    cambioCallerId: null, finalTurnsLeft: null, log: [],
  };
  rooms.set(code, room);
  addPlayer(room, hostSocket, name);
  return room;
}
function addPlayer(room, socket, name) {
  const p = { id: socket.id, name: (name || 'Player').slice(0, 20), hand: [], known: [], penalty: false, drawCard: null };
  room.players.push(p); socket.join(room.code); socket.data.roomCode = room.code;
  return p;
}
function playerView(room, forId) {
  // Public state + only YOUR hand face-up. Everyone else: counts only.
  return {
    code: room.code, phase: room.phase, memoryAid: room.memoryAid, pack: room.pack, felt: room.felt,
    turnId: room.players[room.turnIndex]?.id || null,
    players: room.players.map(p => ({
      id: p.id, name: p.name, count: p.hand.length,
      score: room.phase === 'finished' ? handScore(p.hand) : null,
      isCaller: p.id === room.cambioCallerId,
      // Your own hand, with values. Opponents: face-down placeholders.
      hand: p.id === forId ? p.hand.map(c => ({ ...c, unknown: !!c.unknown })) : p.hand.map(() => ({ back: true })),
      // Cards you have legitimately seen (peeked / spied) — only for you.
      known: p.id === forId && room.memoryAid ? p.known : [],
      drawCard: p.id === forId ? p.drawCard : null,
    })),
    discardTop: room.discard.length ? room.discard[room.discard.length - 1] : null,
    discardCount: room.discard.length, deckCount: room.deck.length,
    snapOpen: Date.now() < room.snapUntil, snapEndsAt: room.snapUntil,
    pendingPower: room.pendingPower && room.pendingPower.playerId === forId ? room.pendingPower : (room.pendingPower ? { playerId: room.pendingPower.playerId, rank: room.pendingPower.rank } : null),
    drawFirst: room.drawFirst ? { picks: room.drawFirst.picks.map(x => ({ playerId: x.playerId, name: x.name, card: x.revealed ? x.card : null })), winnerId: room.drawFirst.winnerId } : null,
    log: room.log.slice(-6), cambioCallerId: room.cambioCallerId,
    winnerId: room.winnerId || null,
  };
}
function broadcast(room) { for (const p of room.players) io.to(p.id).emit('state', playerView(room, p.id)); }
function log(room, msg) { room.log.push(msg); }

function startDrawFirst(room) {
  room.phase = 'drawFirst';
  room.drawFirst = { picks: room.players.map(p => ({ playerId: p.id, name: p.name, card: null, revealed: false })), winnerId: null, fan: shuffle(buildDeck()).slice(0, 18) };
  // Fan cards are per-player random draws: reveal a random fan card on pick.
  broadcast(room);
}
function deal(room) {
  room.deck = buildDeck(); room.discard = [];
  for (const p of room.players) { p.hand = room.deck.splice(0, 4); p.known = p.hand.slice(2).map(c => c.id); /* nearest two = indexes 2,3 */ }
  room.phase = 'peek'; room.turnIndex = room.players.findIndex(p => p.id === room.drawFirst.winnerId);
  if (room.turnIndex < 0) room.turnIndex = 0;
  log(room, `${room.players[room.turnIndex].name} won the draw and goes first. Peek at your two nearest cards, then play.`);
  broadcast(room);
}
function advanceTurn(room) {
  if (room.cambioCallerId) {
    room.finalTurnsLeft--;
    if (room.finalTurnsLeft <= 0) return finish(room);
  }
  room.turnIndex = (room.turnIndex + 1) % room.players.length;
  room.currentDraw = null;
  if (room.cambioCallerId && room.players[room.turnIndex].id === room.cambioCallerId) return finish(room);
  broadcast(room);
}
function finish(room) {
  room.phase = 'finished';
  const scored = room.players.map(p => ({ p, score: handScore(p.hand) }));
  const best = Math.min(...scored.map(x => x.score));
  const tied = scored.filter(x => x.score === best);
  // Tie-break: most cards wins; if card counts equal, non-caller wins.
  tied.sort((a, b) => (b.p.hand.length - a.p.hand.length) || ((a.p.id === room.cambioCallerId) - (b.p.id === room.cambioCallerId)));
  room.winnerId = tied[0].p.id;
  log(room, `${tied[0].p.name} wins with ${best}!`);
  broadcast(room);
}
function openSnapWindow(room, ms = 4000) { room.snapUntil = Date.now() + ms; }

function discardCard(room, player, card) {
  room.discard.push(card);
  openSnapWindow(room, 4000);
  log(room, `${player.name} discarded ${card.rank}${card.suit}. Snap window open — 4 seconds.`);
  // After the snap window, a J/Q/K power is MANDATORY (no skip).
  const isPower = ['J', 'Q', 'K'].includes(card.rank);
  setTimeout(() => {
    if (room.phase !== 'playing' || room.discard[room.discard.length - 1] !== card) return;
    if (!isPower) return advanceTurn(room);
    room.pendingPower = { playerId: player.id, rank: card.rank, cardId: card.id, step: card.rank === 'K' ? 'look' : (card.rank === 'Q' ? 'look' : 'swap') };
    log(room, `${player.name} must use the ${card.rank} power.`);
    broadcast(room);
  }, 4100);
  broadcast(room);
}

io.on('connection', (socket) => {
  socket.emit('hello', { id: socket.id });

  socket.on('createRoom', ({ name, memoryAid, pack, felt }) => {
    const room = newRoom(socket, name, { memoryAid, pack, felt });
    socket.emit('roomJoined', { code: room.code });
    broadcast(room);
  });
  socket.on('joinRoom', ({ code, name }) => {
    const room = rooms.get((code || '').toUpperCase().trim());
    if (!room) return socket.emit('errorMsg', 'No lobby with that code — check the code and try again.');
    if (room.phase !== 'lobby') return socket.emit('errorMsg', 'That game has already started.');
    if (room.players.length >= 6) return socket.emit('errorMsg', 'That lobby is full (6 players max).');
    addPlayer(room, socket, name);
    socket.emit('roomJoined', { code: room.code });
    broadcast(room);
  });
  socket.on('setMemory', ({ memoryAid }) => {
    const room = rooms.get(socket.data.roomCode); if (!room || room.hostId !== socket.id || room.phase !== 'lobby') return;
    room.memoryAid = !!memoryAid; broadcast(room);
  });
  socket.on('startGame', () => {
    const room = rooms.get(socket.data.roomCode); if (!room || room.hostId !== socket.id) return;
    if (room.players.length < 2) return socket.emit('errorMsg', 'Need at least 2 players to start.');
    startDrawFirst(room);
  });
  socket.on('pickDrawFirst', ({ index }) => {
    const room = rooms.get(socket.data.roomCode); if (!room || room.phase !== 'drawFirst') return;
    const pick = room.drawFirst.picks.find(x => x.playerId === socket.id);
    if (!pick || pick.card) return;
    pick.card = room.drawFirst.fan[index % room.drawFirst.fan.length] || room.drawFirst.fan[0];
    pick.revealed = false; broadcast(room);
    if (room.drawFirst.picks.every(x => x.card)) {
      // Reveal together, lowest Cambio value wins; ties redraw among tied.
      room.drawFirst.picks.forEach(x => x.revealed = true);
      const best = Math.min(...room.drawFirst.picks.map(x => x.card.value));
      const winners = room.drawFirst.picks.filter(x => x.card.value === best);
      broadcast(room);
      setTimeout(() => {
        if (winners.length === 1) { room.drawFirst.winnerId = winners[0].playerId; log(room, `${winners[0].name} drew ${winners[0].card.rank}${winners[0].card.suit} and goes first.`); deal(room); }
        else { log(room, `Tie on the draw — ${winners.map(w => w.name).join(', ')} draw again.`); room.drawFirst.picks = winners.map(w => ({ playerId: w.playerId, name: w.name, card: null, revealed: false })); room.drawFirst.fan = shuffle(buildDeck()).slice(0, 18); broadcast(room); }
      }, 1800);
    }
  });
  socket.on('peekDone', () => {
    const room = rooms.get(socket.data.roomCode); if (!room || room.phase !== 'peek') return;
    room.phase = 'playing'; log(room, 'Game on — lowest score wins.'); broadcast(room);
  });
  function current(room) { return room.players[room.turnIndex]; }
  function mustBeTurn(room) { return room && room.phase === 'playing' && current(room).id === socket.id && !room.pendingPower && Date.now() >= room.snapUntil; }

  socket.on('drawCard', () => {
    const room = rooms.get(socket.data.roomCode); if (!mustBeTurn(room)) return;
    const p = current(room); if (p.drawCard) return;
    if (!room.deck.length) { room.deck = shuffle(room.discard.splice(0, room.discard.length - 1)); }
    p.drawCard = room.deck.pop(); log(room, `${p.name} drew from the pile.`); broadcast(room);
  });
  socket.on('takeDiscard', () => {
    const room = rooms.get(socket.data.roomCode); if (!mustBeTurn(room)) return;
    const p = current(room); if (p.drawCard || !room.discard.length) return;
    p.drawCard = room.discard.pop(); p.drawCard.fromDiscard = true;
    log(room, `${p.name} took the top discard (${p.drawCard.rank}${p.drawCard.suit}) — everyone saw it.`); broadcast(room);
  });
  socket.on('discardDrawn', () => {
    const room = rooms.get(socket.data.roomCode); if (!mustBeTurn(room)) return;
    const p = current(room); if (!p.drawCard || p.drawCard.fromDiscard) return; // discard-pile cards must be swapped in
    const c = p.drawCard; p.drawCard = null; discardCard(room, p, c);
  });
  socket.on('swapIn', ({ handIndex }) => {
    const room = rooms.get(socket.data.roomCode); if (!mustBeTurn(room)) return;
    const p = current(room); if (!p.drawCard || handIndex == null || !p.hand[handIndex]) return;
    const drawn = p.drawCard; p.drawCard = null;
    const old = p.hand[handIndex]; p.hand[handIndex] = drawn;
    p.known = p.known.filter(id => id !== old.id); if (room.memoryAid) p.known.push(drawn.id);
    discardCard(room, p, old);
  });
  socket.on('snap', ({ targetId, handIndex }) => {
    const room = rooms.get(socket.data.roomCode); if (!room || room.phase !== 'playing' || Date.now() > room.snapUntil || !room.discard.length) return;
    const target = room.players.find(p => p.id === targetId); if (!target || !target.hand[handIndex]) return;
    if (target.id === room.cambioCallerId) return socket.emit('errorMsg', 'That player called Cambio — their cards are immune.');
    const top = room.discard[room.discard.length - 1];
    const card = target.hand[handIndex];
    const snapper = room.players.find(p => p.id === socket.id); if (!snapper) return;
    if (card.rank === top.rank) {
      target.hand.splice(handIndex, 1);
      log(room, `${snapper.name} snapped ${card.rank}${card.suit} off ${target.name}!`);
      if (target.id !== snapper.id) { // penalty: snapper gives target one of their cards
        const give = snapper.hand.pop(); if (give) target.hand.push(give);
        log(room, `${snapper.name} gives ${target.name} a card as the snap penalty.`);
      }
      room.snapUntil = 0; broadcast(room);
    } else {
      // Failed snap: card goes back, snapper draws a face-down penalty card they cannot look at.
      const penalty = room.deck.pop() || { id: Date.now(), rank: '?', suit: '?', color: 'black', value: 0, unknown: true };
      penalty.unknown = true; snapper.hand.push(penalty);
      log(room, `Wrong snap by ${snapper.name} — ${card.rank}${card.suit} goes back, and ${snapper.name} takes a face-down penalty card.`);
      io.to(snapper.id).emit('errorMsg', 'Wrong snap — that card goes back, and you take a face-down penalty card you cannot look at.');
      broadcast(room);
    }
  });
  socket.on('powerLook', ({ targetId, handIndex }) => {
    const room = rooms.get(socket.data.roomCode); if (!room || !room.pendingPower || room.pendingPower.playerId !== socket.id || room.pendingPower.step !== 'look') return;
    const target = room.players.find(p => p.id === targetId); if (!target || target.id === room.cambioCallerId || !target.hand[handIndex]) return;
    const me = room.players.find(p => p.id === socket.id);
    if (room.memoryAid) me.known.push(target.hand[handIndex].id);
    socket.emit('lookedCard', { targetName: target.name, card: target.hand[handIndex] });
    log(room, `${me.name} looked at one of ${target.name}'s cards.`);
    if (room.pendingPower.rank === 'Q') { room.pendingPower = null; return advanceTurn(room); }
    room.pendingPower.step = 'swap'; broadcast(room);
  });
  socket.on('powerSwap', ({ aPlayerId, aIndex, bPlayerId, bIndex }) => {
    const room = rooms.get(socket.data.roomCode); if (!room || !room.pendingPower || room.pendingPower.playerId !== socket.id || room.pendingPower.step !== 'swap') return;
    const A = room.players.find(p => p.id === aPlayerId), B = room.players.find(p => p.id === bPlayerId);
    if (!A || !B || !A.hand[aIndex] || !B.hand[bIndex]) return;
    if (A.id === room.cambioCallerId || B.id === room.cambioCallerId) return socket.emit('errorMsg', 'The Cambio caller is immune — you cannot swap their cards.');
    [A.hand[aIndex], B.hand[bIndex]] = [B.hand[bIndex], A.hand[aIndex]];
    log(room, `${room.players.find(p => p.id === socket.id).name} swapped two cards.`);
    room.pendingPower = null; advanceTurn(room);
  });
  socket.on('callCambio', () => {
    const room = rooms.get(socket.data.roomCode); if (!mustBeTurn(room)) return;
    room.cambioCallerId = socket.id; room.finalTurnsLeft = room.players.length - 1;
    log(room, `${current(room).name} called CAMBIO! Everyone else gets one more turn.`);
    broadcast(room); advanceTurn(room);
  });
  socket.on('disconnect', () => {
    const room = rooms.get(socket.data.roomCode); if (!room) return;
    room.players = room.players.filter(p => p.id !== socket.id);
    if (!room.players.length) { rooms.delete(room.code); return; }
    if (room.hostId === socket.id) room.hostId = room.players[0].id;
    log(room, 'A player left the game.'); broadcast(room);
  });
});

server.listen(PORT, () => console.log(`Cambio server listening on ${PORT}`));
