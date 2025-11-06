import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { socket } from "./socket";
import bgImage from "./assets/bg startup.jpg"; // 👈 place your bg image in src/assets

export default function Startup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [players, setPlayers] = useState([]);

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

  const handleJoinRoom = () => {
    if (!username.trim() || !roomCode.trim())
      return alert("Enter both username and room code");
    joinRoom(roomCode.trim().toUpperCase());
  };

  const joinRoom = (code) => {
    if (!socket.connected) {
      socket.connect();
      console.log("🔌 Connected to backend socket");
    }
    socket.emit("joinRoom", { roomCode: code, username });
    localStorage.setItem("roomCode", roomCode);
    localStorage.setItem("username", username);

  };

  useEffect(() => {
    socket.on("roomUpdate", (playersList) => {
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
      alert("That username already exists in this room.");
      setIsCreating(false);
    });

    socket.on("storyStart", () => {
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

  const startGame = () => {
    socket.emit("sendStoryReady", roomCode);
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.title}> Case Closed</h1>

        {!isCreating ? (
          <>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
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
            <ul style={{ listStyle: "none", padding: 0 }}>
              {players.map((p) => (
                <li key={p.socketId} style={{ fontSize: "1.2rem", margin: "6px 0" }}>
                  {p.username}
                </li>
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
    </div>
  );
}

const styles = {
  container: {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    margin: 0,
    padding: 0,
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    background: "rgba(15, 10, 10, 0.8)",
    borderRadius: "15px",
    padding: "3rem 4rem",
    textAlign: "center",
    color: "#f3e0c5",
    border: "2px solid #d4af37",
    boxShadow: "0 0 30px rgba(0,0,0,0.6)",
    fontFamily: "'Cinzel', serif",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "2rem",
    color: "#ffd700",
    textShadow: "0 0 15px rgba(255,215,0,0.6)",
  },
  input: {
    padding: "15px 20px",
    borderRadius: "8px",
    border: "2px solid #d4af37",
    background: "#f3e0c5",
    color: "#2b1d0e",
    fontSize: "1.2rem",
    marginBottom: "15px",
    width: "300px",
  },
  btn: {
    padding: "12px 25px",
    fontSize: "1.2rem",
    background: "#d4af37",
    color: "#0a0a0a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnAlt: {
    padding: "12px 25px",
    fontSize: "1.2rem",
    background: "#8b0000",
    color: "#f3e0c5",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  roomBox: {
    border: "2px solid #d4af37",
    padding: "2rem",
    borderRadius: "12px",
    background: "rgba(40, 20, 10, 0.85)",
    display: "inline-block",
    fontSize: "1.2rem",
  },
  startBtn: {
    padding: "12px 25px",
    fontSize: "1.2rem",
    background: "#228b22",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    marginTop: "20px",
    cursor: "pointer",
  },
};
