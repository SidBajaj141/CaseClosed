import React, { useState, useEffect } from "react";

export default function Interrogator({ onComplete }) {
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

  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [typing, setTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [guesses, setGuesses] = useState([]);

  const typeText = (text, callback) => {
    let i = 0;
    setDisplay("");
    setTyping(true);

    const interval = setInterval(() => {
      // Stop before we exceed string length
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
      typeText("> Interrogation session complete.\n> Results logged.", () => {
        if (onComplete) onComplete(guesses);
      });
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
      actualTruth: s.truth,
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
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#218838")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#28a745")
            }
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
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#c82333")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#dc3545")
            }
          >
            Lie
          </button>
        </div>
      )}
    </div>
  );
}
