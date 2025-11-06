import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "./assets/bgCommon.png";

export default function Story() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { roomCode, username } = state || {};

  const handleContinue = () => {
    if (!roomCode || !username) {
      alert("Missing room or username — please rejoin.");
      navigate("/");
      return;
    }
    navigate("/roles", { state: { roomCode, username } });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        margin: 0,
        padding: "3rem",
        color: "#f3e0c5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Courier New', monospace",
      }}
    >
      <div
        style={{
          width: "900px",
          background: "rgba(15, 10, 8, 0.9)",
          border: "3px solid #d4af37",
          borderRadius: "15px",
          boxShadow: "0 0 25px rgba(212, 175, 55, 0.4)",
          padding: "2.5rem",
          lineHeight: "1.8",
        }}
      >
        <h2
          style={{
            color: "#d4af37",
            textAlign: "center",
            fontSize: "2.2rem",
            borderBottom: "2px solid #d4af37",
            paddingBottom: "1rem",
            marginBottom: "2rem",
            textShadow: "0 0 12px rgba(212,175,55,0.6)",
          }}
        >
          ⚡ CASE FILE: THE CHRONO-TECH OVERLOAD ⚡
        </h2>

        <div
          style={{
            background: "rgba(60, 40, 25, 0.8)",
            border: "1px solid #d4af37",
            padding: "1.2rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ fontSize: "1.1rem" }}>
            <b>Case Number:</b> 88-VANCE<br />
            <b>Time of Incident:</b> 11:45 PM<br />
            <b>Location:</b> Chrono-Tech HQ — Penthouse Lab<br />
            <b>Victim:</b> Elias Vance, CEO of Chrono-Tech
          </p>
        </div>

        <p style={{ fontSize: "1.1rem" }}>
          At 11:45 PM, a massive voltage surge overloaded the neural-link
          interface in the CEO’s private lab. Security arrived moments later to
          find <b>Elias Vance</b> dead — safety protocols had been manually
          overridden. The system logs confirm that only three other personnel
          accessed the 88th floor that night.
        </p>

        <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
          Your investigation team will analyze their statements, digital traces,
          and forensic evidence. Only one of them is lying — and the truth
          determines whether this was murder or sabotage.
        </p>

        <h3
          style={{
            color: "#d4af37",
            marginTop: "2rem",
            marginBottom: "1rem",
            borderBottom: "1px solid #d4af37",
            paddingBottom: "0.5rem",
            fontSize: "1.4rem",
          }}
        >
          👥 SUSPECT DOSSIER
        </h3>

        {[
          {
            name: "Dr. Aris Thorne — “The Scientist”",
            desc: "Lead neural engineer. Claims he spent the night in Sub-Lab 88-B 'running diagnostics.' Vance allegedly stole his patent — motive for revenge.",
          },
          {
            name: "Evelyn Reed — “The Rival”",
            desc: "CEO of Bio-Syn Industries. She met Vance for merger negotiations but left at 11:30 PM 'furious but alive.' Known for corporate espionage.",
          },
          {
            name: "Marcus Cole — “The Security Chief”",
            desc: "Head of Vance’s personal security. Drowning in gambling debt. Claims he was monitoring external cams in Room 88-C. Internal feeds were 'disabled for maintenance.'",
          },
        ].map((suspect, i) => (
          <div
            key={i}
            style={{
              background: "rgba(75, 50, 30, 0.85)",
              border: "1px solid #d4af37",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <b>{suspect.name}</b>
            <p style={{ marginTop: "0.5rem", fontSize: "1.05rem" }}>
              {suspect.desc}
            </p>
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={handleContinue}
            style={{
              padding: "14px 28px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              background: "#d4af37",
              color: "#0a0a0a",
              border: "2px solid #b88b2b",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#c29e36")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#d4af37")
            }
          >
            PROCEED TO ROLE SELECTION →
          </button>
        </div>
      </div>
    </div>
  );
}
