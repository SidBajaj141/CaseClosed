const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("../config/db");
const Room = require("../models/Room");
const { nanoid } = require("nanoid");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

/* -------------------------- ROOM CREATION -------------------------- */
app.post("/create-room", async (req, res) => {
  try {
    const roomCode = nanoid(6).toUpperCase();
    const newRoom = new Room({ roomCode, players: [], chat: [] });
    await newRoom.save();
    console.log("✅ Room saved:", newRoom);
    res.json({ roomCode });
  } catch (err) {
    console.error("❌ Room creation error:", err);
    res.status(500).json({ error: "Failed to create room" });
  }
});

/* --------------------------- ROLE LOOKUP --------------------------- */
app.get("/get-role/:roomCode/:username", async (req, res) => {
  try {
    const { roomCode, username } = req.params;
    const room = await Room.findOne({ roomCode });
    if (!room) return res.status(404).json({ error: "Room not found" });

    const player = room.players.find(
      (p) => p.username.trim().toLowerCase() === username.trim().toLowerCase()
    );

    if (!player || !player.role)
      return res.status(404).json({ error: "Role not assigned yet" });

    res.json({ role: player.role });
  } catch (err) {
    console.error("❌ Error fetching role:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* --------------------------- GET ROOM INFO ------------------------- */
app.get("/api/room/:roomCode", async (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = await Room.findOne({ roomCode }).lean();
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  } catch (err) {
    console.error("Error fetching room:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ----------------------- GLOBAL VOTE STORAGE ----------------------- */
const votes = {}; // { roomCode: { username: "Marcus Cole" } }
const criminal = "Marcus Cole";

/* -------------------------- SOCKET LOGIC --------------------------- */
io.on("connection", (socket) => {
  console.log(`🟢 Player connected: ${socket.id}`);

  /* ----------------------- JOIN ROOM ----------------------- */
  socket.on("joinRoom", async ({ roomCode, username }) => {
    try {
      const room = await Room.findOne({ roomCode });
      if (!room) return socket.emit("roomNotFound");
      if (room.players.length >= 4) return socket.emit("roomFull");

      const usernameExists = room.players.some(
        (p) => p.username.trim().toLowerCase() === username.trim().toLowerCase()
      );
      if (usernameExists) return socket.emit("usernameTaken");

      room.players.push({ username, socketId: socket.id });
      await room.save();

      socket.join(roomCode);
      io.to(roomCode).emit("roomUpdate", room.players);

      console.log(`👤 ${username} joined ${roomCode}`);
    } catch (err) {
      console.error("Join room error:", err);
    }
  });

  /* ----------------------- ROLE ASSIGNMENT ----------------------- */
  socket.on("sendStoryReady", async (roomCode) => {
    try {
      const room = await Room.findOne({ roomCode });
      if (!room) return;

      const roles = ["Interogator", "SketchArtist", "Technical", "Forensic"];

      room.players.forEach((player, i) => {
        player.role = roles[i % roles.length];
        io.to(player.socketId).emit("roleAssigned", {
          role: player.role,
          roomCode,
          username: player.username,
        });
      });

      await room.save();
      io.to(roomCode).emit("storyStart");
      console.log(`🕵️ Roles assigned and story started for ${roomCode}`);
    } catch (err) {
      console.error("sendStoryReady error:", err);
    }
  });

  /* ----------------------- CHAT MESSAGE ----------------------- */
  socket.on("chatMessage", ({ roomCode, username, text }) => {
    const msg = { username, text, time: new Date() };
    io.to(roomCode).emit("chatMessage", msg);
    console.log(`💬 [${roomCode}] ${username}: ${text}`);
  });

  /* ----------------------- VOTING SYSTEM ----------------------- */
  socket.on("submitVote", async ({ roomCode, username, suspect }) => {
    if (!votes[roomCode]) votes[roomCode] = {};
    votes[roomCode][username] = suspect;

    console.log(`🗳️ ${username} voted for ${suspect} in ${roomCode}`);

    const room = await Room.findOne({ roomCode });
    if (!room) return;

    const totalPlayers = room.players.length;
    const totalVotes = Object.keys(votes[roomCode]).length;

    console.log(`[DEBUG] Votes in ${roomCode}: ${totalVotes}/${totalPlayers}`);

    // ✅ Trigger result only when everyone has voted
    if (totalVotes === totalPlayers) {
      const tally = {};
      Object.values(votes[roomCode]).forEach((v) => {
        tally[v] = (tally[v] || 0) + 1;
      });

      const topSuspect = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
      const correct = topSuspect === criminal;

      io.to(roomCode).emit("voteResult", {
        tally,
        topSuspect,
        correct,
        criminal,
        message: correct
          ? `✅ The team voted ${topSuspect} — correct!`
          : `❌ The team voted ${topSuspect}, but the real culprit was ${criminal}.`,
      });

      console.log(
        `🏁 Voting finished in ${roomCode}. Top suspect: ${topSuspect}. Correct: ${correct}`
      );

      // 🔁 Reset for next round
      delete votes[roomCode];
    } else {
      io.to(roomCode).emit("voteProgress", {
        totalVotes,
        totalPlayers,
      });
    }
  });

  /* ----------------------- DISCONNECT ----------------------- */
  socket.on("disconnect", async () => {
    try {
      const room = await Room.findOne({ "players.socketId": socket.id });
      if (room) {
        room.players = room.players.filter((p) => p.socketId !== socket.id);
        await room.save();
        io.to(room.roomCode).emit("roomUpdate", room.players);

        if (room.players.length === 0) {
          await Room.deleteOne({ _id: room._id });
          console.log(`🗑️ Deleted empty room ${room.roomCode}`);
        }
      }
      console.log(`🔴 Player disconnected: ${socket.id}`);
    } catch (err) {
      console.error("Disconnect cleanup error:", err);
    }
  });
});

server.listen(5000, () => console.log("🚀 Server running on port 5000"));
