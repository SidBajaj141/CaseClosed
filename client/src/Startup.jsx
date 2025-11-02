import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Startup() {
  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("roomUpdate", (updatedPlayers) => {
      setPlayers(updatedPlayers);
      setStatus(`Room: ${roomId} | Players: ${updatedPlayers.length}/4`);
    });

    socket.on("roomFull", () => {
      setStatus("❌ Room is full (max 4 players)");
    });

    socket.on("storyStart", () => {
      navigate("/story");
    });

    return () => {
      socket.off("roomUpdate");
      socket.off("roomFull");
      socket.off("storyStart");
    };
  }, [navigate, roomId]);

  const handleJoin = () => {
    if (!roomId.trim()) {
      setStatus("⚠️ Enter a room code first");
      return;
    }
    socket.emit("joinRoom", roomId.trim());
    setStatus(`Joining room ${roomId}...`);
  };

  const handleCreate = async () => {
  try {
    const res = await fetch("http://localhost:5000/create-room", {
      method: "POST",
    });
    const data = await res.json();
    const newRoom = data.roomId;
    setRoomId(newRoom);
    socket.emit("joinRoom", newRoom);
    setStatus(`✅ Room created: ${newRoom}`);
  } catch (err) {
    console.error("Error creating room:", err);
    setStatus("❌ Failed to create room");
  }
};


  const handleStart = () => {
    if (players.length > 1) {
      socket.emit("sendStoryReady", roomId);
    } else {
      setStatus("Need at least 2 players to start");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>🕵️ Case Closed – Lobby</h1>
      <input
        type="text"
        placeholder="Enter or create room code"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ padding: "8px", fontSize: "16px", marginBottom: "10px" }}
      />
      <div>
        <button onClick={handleJoin} style={{ margin: "5px", padding: "10px 20px" }}>
          Join Room
        </button>
        <button onClick={handleCreate} style={{ margin: "5px", padding: "10px 20px" }}>
          Create Room
        </button>
      </div>

      <p style={{ color: "#aaa" }}>{status}</p>

      {players.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Players Connected:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {players.map((id) => (
              <li key={id} style={{ color: "#f3e0c5" }}>{id}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleStart}
        style={{ marginTop: "30px", padding: "10px 30px" }}
      >
        Start Story
      </button>
    </div>
  );
}
