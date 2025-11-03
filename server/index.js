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

// ✅ Create a new unique room
app.post("/create-room", async (req, res) => {
  try {
    const roomCode = nanoid(6).toUpperCase(); // e.g. "A1B2C3"
    const newRoom = new Room({ roomCode, players: [] });
    await newRoom.save();
    console.log("✅ Room saved:", newRoom);
    res.json({ roomCode });
  } catch (err) {
    console.error("❌ Room creation error:", err);
    res.status(500).json({ error: "Failed to create room" });
  }
});
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
// 🔌 Socket events
io.on("connection", (socket) => {
  console.log(`🟢 Player connected: ${socket.id}`);

  socket.on("joinRoom", async ({ roomCode, username }) => {
  try {
    const room = await Room.findOne({ roomCode });
    if (!room) return socket.emit("roomNotFound");
    if (room.players.length >= 4) return socket.emit("roomFull");

    // ✅ Check if username already exists in the room
    const usernameExists = room.players.some(
      (p) => p.username.trim().toLowerCase() === username.trim().toLowerCase()
    );
    if (usernameExists) {
      socket.emit("usernameTaken");
      console.log(`⚠️ Username '${username}' already taken in room ${roomCode}`);
      return; // stop right here — don’t add
    }

    // ✅ Safe to add now
    room.players.push({ username, socketId: socket.id });
    await room.save();

    socket.join(roomCode);
    io.to(roomCode).emit("roomUpdate", room.players);
    console.log(`👤 ${username} joined ${roomCode}`);
  } catch (err) {
    console.error("Join room error:", err);
  }
});



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
    
    await room.save(); // persist assigned roles
    io.to(roomCode).emit("storyStart");
    console.log(`🕵️ Roles assigned and story started for ${roomCode}`);
  } catch (err) {
    console.error("sendStoryReady error:", err);
  }
});


  // WebRTC Signaling
  socket.on("offer", (data) => socket.to(data.roomCode).emit("offer", data));
  socket.on("answer", (data) => socket.to(data.roomCode).emit("answer", data));
  socket.on("ice-candidate", (data) => socket.to(data.roomCode).emit("ice-candidate", data));

  socket.on("disconnect", async () => {
    try {
      const room = await Room.findOne({ "players.socketId": socket.id });
      if (room) {
        room.players = room.players.filter((p) => p.socketId !== socket.id);
        await room.save();
        io.to(room.roomCode).emit("roomUpdate", room.players);
        if (room.players.length === 0) await Room.deleteOne({ _id: room._id });
      }
      console.log(`🔴 Player disconnected: ${socket.id}`);
    } catch (err) {
      console.error("Disconnect cleanup error:", err);
    }
  });
});

server.listen(5000, () => console.log("🚀 Server running on port 5000"));
