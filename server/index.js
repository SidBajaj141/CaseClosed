const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const rooms = {}; // { roomId: [socketIds...] }

// ✅ API route to create unique room
app.post("/create-room", (req, res) => {
  let roomId;
  do {
    roomId = Math.random().toString(36).substring(2, 7);
  } while (rooms[roomId]); // ensure uniqueness

  rooms[roomId] = [];
  res.json({ roomId });
});

// 🔌 Socket events
io.on("connection", (socket) => {
  console.log(`🟢 Player connected: ${socket.id}`);

  socket.on("joinRoom", (roomId) => {
    if (!rooms[roomId]) {
      socket.emit("roomNotFound");
      return;
    }

    if (rooms[roomId].length >= 4) {
      socket.emit("roomFull");
      return;
    }

    rooms[roomId].push(socket.id);
    socket.join(roomId);
    io.to(roomId).emit("roomUpdate", rooms[roomId]);
    console.log(`Player ${socket.id} joined room ${roomId}`);
  });

  socket.on("sendStoryReady", (roomId) => {
    io.to(roomId).emit("storyStart");
  });

  // WebRTC Signaling
  socket.on("offer", (data) => socket.to(data.roomId).emit("offer", data));
  socket.on("answer", (data) => socket.to(data.roomId).emit("answer", data));
  socket.on("ice-candidate", (data) => socket.to(data.roomId).emit("ice-candidate", data));

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
      if (rooms[roomId].length === 0) delete rooms[roomId];
      else io.to(roomId).emit("roomUpdate", rooms[roomId]);
    }
    console.log(`🔴 Player disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => console.log("🚀 Server running on port 5000"));
