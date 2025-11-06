const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  socketId: { type: String },
  role: { type: String, default: null },
});


const roomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  players: [playerSchema], 
  isActive: { type: Boolean, default: false },
});

module.exports = mongoose.model("Room", roomSchema);
