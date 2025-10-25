// Story.jsx
import { useNavigate } from "react-router-dom";

export default function Story() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#3e2c1c", // dark brown
        color: "#f3e0c5", // soft gold
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Courier New', monospace", // optional Minecraft font here
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          background: "#5a3e2b", // lighter brown for box
          border: "3px solid #d4af37", // gold border
          borderRadius: "15px",
          padding: "2rem",
          boxShadow: "0 0 20px rgba(212, 175, 55, 0.5)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", fontSize: "2rem" }}>
          🌙 Case 4: Room 6 at the Neon Motel
        </h2>
        <p style={{ marginBottom: "2rem", lineHeight: "1.6", fontSize: "1.1rem" }}>
          The neon glow of the Silver Star Motel casts eerie pink and blue reflections on the
          wet asphalt. Inside Room 6, Victor Harlow lies sprawled on the bed, a half-empty
          whiskey glass beside him and a burned matchbook in his pocket reading <b>“Rose”</b>.  
          The clerk claims he arrived alone, yet traces of perfume and partial footprints
          hint otherwise. Outside, a trucker may have seen more than he admits, and Victor’s
          phone might hold secret messages.  
          Your team’s skills—Forensics, Hacking, Sketching, and Interrogation—will reveal the truth,
          but only if you share clues wisely.
        </p>
        <button
          onClick={() => navigate("/games")}
          style={{
            padding: "12px 25px",
            fontWeight: "bold",
            fontSize: "1rem",
            background: "#d4af37", // gold button
            color: "#3e2c1c", // dark text
            border: "2px solid #b88b2b",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#c29e36")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#d4af37")}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
