import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { socket } from "./socket"; // ✅ shared socket import

export default function Startup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [players, setPlayers] = useState([]);

  // 🧩 Create new room
  const handleCreateRoom = async () => {
    if (!username.trim()) return alert("Enter username first");
    try {
      const res = await axios.post("http://localhost:5000/create-room");
      const newRoomCode = res.data.roomCode;
      setRoomCode(newRoomCode);
      joinRoom(newRoomCode);
    } catch (err) {
      console.error("Room creation failed:", err);
    }
  };

  // 🚪 Join room
  const handleJoinRoom = () => {
    if (!username.trim() || !roomCode.trim())
      return alert("Enter both username and room code");
    joinRoom(roomCode.trim().toUpperCase());
  };

  // 🔌 Common join logic
  const joinRoom = (code) => {
    if (!socket.connected) {
      socket.connect();
      console.log("🔌 Connected to backend socket");
    }

    console.log(`📤 Joining room ${code} as ${username}`);
    socket.emit("joinRoom", { roomCode: code, username });
  };

  // 🎧 Socket event listeners
  useEffect(() => {
    socket.on("roomUpdate", (playersList) => {
      console.log("👥 Updated players:", playersList);
      setPlayers(playersList);

      const isInRoom = playersList.some(
        (p) => p.username.trim().toLowerCase() === username.trim().toLowerCase()
      );
      if (isInRoom) setIsCreating(true);
    });

    socket.on("roomNotFound", () => {
      alert("Room not found!");
      setIsCreating(false);
    });

    socket.on("roomFull", () => {
      alert("Room is full!");
      setIsCreating(false);
    });

    socket.on("usernameTaken", () => {
      alert("That username already exists in this room. Please choose another one.");
      setIsCreating(false);
    });

    // ✅ Go to story page when all ready
    socket.on("storyStart", () => {
      console.log("🎬 Story starting — navigating...");
      navigate("/story", { state: { roomCode, username } });
    });

    return () => {
      socket.off("roomUpdate");
      socket.off("roomNotFound");
      socket.off("roomFull");
      socket.off("usernameTaken");
      socket.off("storyStart");
    };
  }, [username, roomCode, navigate]);

  // 🟢 Start game
  const startGame = () => {
    console.log("🚀 Starting game for room", roomCode);
    socket.emit("sendStoryReady", roomCode);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Case Closed 🎯</h1>

      {!isCreating ? (
        <>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Room code (optional)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleJoinRoom} style={styles.btn}>
              Join
            </button>
            <button onClick={handleCreateRoom} style={styles.btnAlt}>
              Create
            </button>
          </div>
        </>
      ) : (
        <div style={styles.roomBox}>
          <h2>Room Code: {roomCode}</h2>
          <h3>Players Joined:</h3>
          <ul>
            {players.map((p) => (
              <li key={p.socketId}>{p.username}</li>
            ))}
          </ul>

          {players.length >= 2 && (
            <button onClick={startGame} style={styles.startBtn}>
              Start Game
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    color: "#f3e0c5",
    background: "#2b1d0e",
    minHeight: "100vh",
    padding: "3rem",
    fontFamily: "serif",
  },
  title: { fontSize: "2.5rem", marginBottom: "2rem" },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #d4af37",
    background: "#f3e0c5",
    color: "#2b1d0e",
    fontSize: "1rem",
    marginBottom: "10px",
  },
  btn: {
    padding: "10px 20px",
    background: "#d4af37",
    color: "#2b1d0e",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  btnAlt: {
    padding: "10px 20px",
    background: "#8b0000",
    color: "#f3e0c5",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  roomBox: {
    border: "2px solid #d4af37",
    padding: "1rem",
    borderRadius: "10px",
    background: "#3a2614",
    display: "inline-block",
  },
  startBtn: {
    padding: "10px 20px",
    background: "#228b22",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    marginTop: "20px",
    cursor: "pointer",
  },
};
