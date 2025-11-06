import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "./socket.js";
import bgImage from "./assets/bgCommon.png";

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

    socket.on("roleAssigned", (data) => {
      console.log("📩 roleAssigned received:", data);
      if (data.roomCode === roomCode && data.username === username) {
        setRole(data.role);
        console.log(`🧩 Role for ${username}: ${data.role}`);
      }
    });

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
    <div
      style={{
        ...styles.container,
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            {role ? `Your Role: ${role}` : "Assigning your role..."}
          </h1>

          {!role && (
            <p style={styles.subText}>
              Please stand by.
            </p>
          )}

          {role && (
            <button style={styles.btn} onClick={startMiniGame}>
              Proceed to Mission
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.8)",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "rgba(20, 20, 20, 0.9)",
    border: "3px solid #d4af37",
    borderRadius: "15px",
    padding: "3rem 4rem",
    boxShadow: "0 0 25px rgba(212, 175, 55, 0.4)",
    color: "#f3e0c5",
    textAlign: "center",
    maxWidth: "700px",
  },
  title: {
    fontSize: "2.8rem",
    marginBottom: "1.5rem",
    fontFamily: "'Courier New', monospace",
  },
  subText: {
    fontSize: "1.2rem",
    color: "#bba98a",
    marginBottom: "2rem",
    lineHeight: "1.8",
    fontFamily: "'Courier New', monospace",
  },
  btn: {
    padding: "14px 30px",
    background: "#d4af37",
    border: "2px solid #b88b2b",
    borderRadius: "10px",
    color: "#0a0a0a",
    fontSize: "1.3rem",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  },
};
