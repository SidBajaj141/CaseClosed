import React, { useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";

export default function Interrogator({ onComplete }) {
  const { state } = useLocation(); 
  const { username, roomCode } = state || {};
  const suspects = [
    {
      name: "Dr. Aris Thorne",
      statement: "I was in Lab 88-B all night running diagnostics.",
      truth: true,
    },
    {
      name: "Evelyn Reed",
      statement: "I left at 11:30 PM after the meeting ended.",
      truth: true,
    },
    {
      name: "Marcus Cole",
      statement:
        "I was in the Security Hub monitoring perimeter cams all night.",
      truth: false,
    },
  ];

  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [typing, setTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [showLog, setShowLog] = useState(false);

  const typeText = (text, callback) => {
    let i = 0;
    setDisplay("");
    setTyping(true);

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplay((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setTyping(false);
        if (callback) setTimeout(callback, 400);
      }
    }, 25);
  };

  const randomBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const startRound = (idx) => {
    if (idx >= suspects.length) {
      typeText(
        "> Interrogation session complete.\n> Compiling field notes...",
        () => {
          setShowLog(true);
          if (onComplete) onComplete(guesses);
        }
      );
      return;
    }

    const s = suspects[idx];
    const stress = s.truth ? randomBetween(18, 36) : randomBetween(65, 93);
    const deviation = s.truth ? randomBetween(10, 25) : randomBetween(60, 95);

    const text = `> ${s.name}: "${s.statement}"\n> Stress Level: ${stress}%\n> Speech Deviation Index: ${deviation}%\n\n> Evaluate statement credibility...`;
    typeText(text, () => setShowChoices(true));
  };

  const handleGuess = (guess) => {
    const s = suspects[index];
    const newEntry = {
      suspect: s.name,
      statement: s.statement,
      guessedTruth: guess === "truth",
    };
    setGuesses((prev) => [...prev, newEntry]);
    setShowChoices(false);

    const next = index + 1;
    setIndex(next);

    setTimeout(() => startRound(next), 400);
  };

  useEffect(() => {
    startRound(0);
  }, []);

  return (
    <div
      style={{
        background: "#3e2c1c",
        color: "#f3e0c5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
        padding: "2rem",
      }}
    >
      <h2 style={{ color: "#d4af37" }}>Interrogation Terminal</h2>

      {!showLog ? (
        <>
          <div
            style={{
              background: "#2e1f13",
              border: "2px solid #d4af37",
              borderRadius: "8px",
              padding: "20px",
              width: "80%",
              height: "300px",
              whiteSpace: "pre-line",
              overflowY: "auto",
              fontSize: "1rem",
            }}
          >
            {display}
          </div>

          {showChoices && (
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "15px" }}>
              <button
                onClick={() => handleGuess("truth")}
                disabled={typing}
                style={{
                  padding: "10px 20px",
                  background: "#28a745",
                  color: "#fff",
                  fontWeight: "bold",
                  border: "2px solid #1e7e34",
                  cursor: "pointer",
                }}
              >
                Truth
              </button>

              <button
                onClick={() => handleGuess("lie")}
                disabled={typing}
                style={{
                  padding: "10px 20px",
                  background: "#dc3545",
                  color: "#fff",
                  fontWeight: "bold",
                  border: "2px solid #b52a37",
                  cursor: "pointer",
                }}
              >
                Lie
              </button>
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            background: "#2e1f13",
            border: "2px solid #d4af37",
            borderRadius: "8px",
            padding: "20px",
            width: "80%",
            minHeight: "300px",
            fontSize: "1rem",
            overflowY: "auto",
            textAlign: "left",
          }}
        >
          <h3 style={{ color: "#d4af37", marginBottom: "1rem" }}>
            🗒 Field Notes — Interrogation Log
          </h3>
          {guesses.map((g, i) => (
            <div
              key={i}
              style={{
                marginBottom: "1rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid #d4af37",
              }}
            >
              <p>
                <strong>{g.suspect}</strong>: "{g.statement}"
              </p>
              <p>
                ▶ You marked this as:{" "}
                <span
                  style={{
                    color: g.guessedTruth ? "#28a745" : "#dc3545",
                    fontWeight: "bold",
                  }}
                >
                  {g.guessedTruth ? "Truth" : "Lie"}
                </span>
              </p>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button
              onClick={() => {
  console.log("Navigating to chatroom with:", { roomCode, username });
  navigate("/chatroom", { state: { roomCode, username } });
}}
              style={{
                padding: "12px 28px",
                background: "#d4af37",
                color: "#3e2c1c",
                fontWeight: "bold",
                border: "2px solid #b88b2b",
                borderRadius: "6px",
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
              Continue →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
