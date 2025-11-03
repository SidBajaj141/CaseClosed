import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "./socket.js";

export default function RoleScreen() {
  const { state } = useLocation();
  const { username, roomCode } = state || {};
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log("🔌 Connected to backend socket");
    }

    console.log("🧭 Listening for roles in room:", roomCode);

    // 1️⃣ Try to receive the role via socket
    socket.on("roleAssigned", (data) => {
      console.log("📩 roleAssigned received:", data);
      if (data.roomCode === roomCode && data.username === username) {
        setRole(data.role);
        console.log(`🧩 Role for ${username}: ${data.role}`);
      }
    });

    // 2️⃣ If no role arrives in 2 seconds, fallback to DB fetch
    const fallbackTimer = setTimeout(async () => {
      if (!role) {
        console.log("⏳ No socket role received — fetching from DB...");
        try {
          const res = await fetch(
            `http://localhost:5000/get-role/${roomCode}/${username}`
          );
          const data = await res.json();
          if (data.role) {
            setRole(data.role);
            console.log(`✅ Fetched role from DB: ${data.role}`);
          } else {
            console.warn("⚠️ Role not found yet in DB:", data);
          }
        } catch (err) {
          console.error("❌ Error fetching role from DB:", err);
        }
      }
    }, 2000);

    return () => {
      clearTimeout(fallbackTimer);
      socket.off("roleAssigned");
    };
  }, [roomCode, username]);

  const startMiniGame = () => {
    navigate(`/${role.toLowerCase()}`, {
      state: { username, roomCode, role },
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {role ? `Your Role: ${role}` : "Assigning your role..."}
      </h1>
      {!role && (
        <p style={styles.subText}>
          Waiting for the server to assign roles...
        </p>
      )}
      {role && (
        <button style={styles.btn} onClick={startMiniGame}>
          Proceed to Mission
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    background: "#1a1a1a",
    color: "#f3e0c5",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  title: { fontSize: "2rem", marginBottom: "1rem" },
  subText: { color: "#bba98a", marginBottom: "2rem" },
  btn: {
    padding: "12px 24px",
    background: "#d4af37",
    border: "none",
    borderRadius: "8px",
    color: "#2b1d0e",
    fontSize: "1.2rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
