// Cambio — online relay server (Render).
//
// This server is a DUMB RELAY, not a game server. The host's browser
// runs the game (deals, enforces the rules, runs the computer players,
// decides who goes first) exactly as in the canonical Cambio game.
// This server only forwards messages between the host and the guests
// in the same 5-letter room, in the moment. It never sees a hand,
// never deals a card, and stores nothing.
//
// Message routing (topics keep the canonical "cambio/v1/<CODE>/<part>"
// shape, sent as { code, part, payload }):
//   part "join" or "act"  -> forwarded to the host of that room
//   part "lobby"          -> broadcast to all guests in the room
//   part "to/<clientId>"  -> forwarded to that one guest
//
// Disconnects are turned into the messages the game already expects:
//   guest disconnects -> host gets { kind: "leave", clientId } so the
//                         guest's seat is taken over by a computer player
//   host disconnects  -> guests get { type: "closed" } so they go home
//
// The same server also serves the static site in public/ when it is
// the origin (locally, or on Render), and answers /health for Render.
"use strict";

const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

// Rooms: code -> { hostSocketId, hostClientId, guests: Map<clientId, socketId> }
const rooms = new Map();

function roomFor(code) {
  if (!rooms.has(code)) rooms.set(code, { hostSocketId: null, hostClientId: null, guests: new Map() });
  return rooms.get(code);
}

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ ok: true, rooms: rooms.size });
});

// Any other path serves the game (single-page app).
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  let myCode = null;
  let myClientId = null;
  let myRole = null;

  socket.on("register", (msg) => {
    if (!msg || typeof msg.code !== "string" || typeof msg.clientId !== "string") return;
    const code = msg.code.toUpperCase();
    const role = msg.role === "host" ? "host" : "guest";
    myCode = code; myClientId = msg.clientId; myRole = role;
    socket.join(code);
    const room = roomFor(code);
    if (role === "host") {
      if (!room.hostSocketId) { room.hostSocketId = socket.id; room.hostClientId = msg.clientId; }
    } else {
      room.guests.set(msg.clientId, socket.id);
    }
  });

  socket.on("relay", (msg) => {
    if (!msg || typeof msg.code !== "string" || typeof msg.part !== "string") return;
    const code = msg.code.toUpperCase();
    const room = rooms.get(code);
    if (!room) return; // no table with that code: dropped (guest times out and is told)
    const out = { code, part: msg.part, payload: typeof msg.payload === "string" ? msg.payload : JSON.stringify(msg.payload) };
    if (msg.part === "join" || msg.part === "act") {
      if (room.hostSocketId) io.to(room.hostSocketId).emit("relay", out);
    } else if (msg.part === "lobby") {
      for (const sid of room.guests.values()) io.to(sid).emit("relay", out);
    } else if (msg.part.startsWith("to/")) {
      const target = room.guests.get(msg.part.slice(3));
      if (target) io.to(target).emit("relay", out);
    } else {
      for (const sid of room.guests.values()) io.to(sid).emit("relay", out);
    }
  });

  socket.on("disconnect", () => {
    if (!myCode) return;
    const room = rooms.get(myCode);
    if (!room) return;
    if (myRole === "host" && room.hostSocketId === socket.id) {
      // Host left: close the table for the guests.
      const closed = { code: myCode, part: "lobby", payload: JSON.stringify({ type: "closed" }) };
      for (const sid of room.guests.values()) io.to(sid).emit("relay", closed);
      rooms.delete(myCode);
    } else if (myRole === "guest" && myClientId) {
      room.guests.delete(myClientId);
      // Guest left: host's game takes over their seat with a computer player.
      if (room.hostSocketId) {
        io.to(room.hostSocketId).emit("relay", {
          code: myCode, part: "join",
          payload: JSON.stringify({ kind: "leave", clientId: myClientId })
        });
      }
      if (!room.hostSocketId && room.guests.size === 0) rooms.delete(myCode);
    }
  });
});

server.listen(PORT, () => {
  console.log("Cambio relay listening on port " + PORT);
});
