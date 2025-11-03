import React, { useState, useEffect } from "react";

// Example: fingerprint slices (replace with actual image URLs)
const slices = [
  "src/assets/Fingerprints/00.png",
  "src/assets/Fingerprints/01.png",
  "src/assets/Fingerprints/02.png",
  "src/assets/Fingerprints/03.png",
  "src/assets/Fingerprints/04.png",
];

// Correct order
const correctOrder = [0, 1, 2, 3, 4];

// Utility: randomize initial state
const getRandomSlots = () =>
  Array.from({ length: correctOrder.length }, () =>
    Math.floor(Math.random() * slices.length)
  );

export default function Fingerprint() {
  const [slots, setSlots] = useState(getRandomSlots);
  const [msg, setMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false); // ⬅ track if game has started

  // Timer countdown
  useEffect(() => {
    if (!started || gameOver) return; // ⬅ timer only runs after first move & while active
    if (timeLeft <= 0) {
      setGameOver(true);
      setMsg("⏰ Time's up! Puzzle failed.");
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver, started]);

  const changeSlice = (slotIndex, direction) => {
    if (gameOver) return;
    if (!started) setStarted(true); // ⬅ first interaction triggers timer
    setSlots((prev) => {
      const newSlots = [...prev];
      newSlots[slotIndex] =
        (newSlots[slotIndex] + direction + slices.length) % slices.length;
      return newSlots;
    });
  };

  const submit = () => {
    if (gameOver) return;
    const isCorrect = slots.every((val, i) => val === correctOrder[i]);
    if (isCorrect) {
      setMsg("✅ Fingerprint Identified");
      setGameOver(true);
    } else {
      setMsg("❌ Incorrect, try again");
    }
  };

  const reset = () => {
    setSlots(getRandomSlots());
    setMsg("");
    setTimeLeft(15);
    setGameOver(false);
    setStarted(false); // ⬅ wait again for first move
  };

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
      <h2>Forensic Fingerprint Puzzle</h2>
      <p>Arrange the fingerprint slices in correct order!</p>
      <p>
        Time left: {started ? `${timeLeft}s` : "⏳ Waiting for first move..."}
      </p>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {slots.map((sliceIndex, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => changeSlice(i, -1)}
              style={arrowStyle}
              disabled={gameOver}
            >
              &lt;
            </button>
            <img
              src={slices[sliceIndex]}
              alt={`slice ${sliceIndex}`}
              style={{
                width: "250px",
                height: "60px",
                margin: "0 6px",
              }}
            />
            <button
              onClick={() => changeSlice(i, 1)}
              style={arrowStyle}
              disabled={gameOver}
            >
              &gt;
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={submit} style={actionButtonStyle} disabled={gameOver}>
          Submit
        </button>
        <button
          onClick={reset}
          style={{ ...actionButtonStyle, marginLeft: "10px" }}
        >
          Reset
        </button>
      </div>

      <p style={{ marginTop: "10px" }}>{msg}</p>
    </div>
  );
}

// Reusable button styles
const arrowStyle = {
  background: "#d4af37",
  color: "#3e2c1c",
  fontWeight: "bold",
  border: "2px solid #b88b2b",
  padding: "5px 10px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const actionButtonStyle = {
  background: "#d4af37",
  color: "#3e2c1c",
  fontWeight: "bold",
  border: "2px solid #b88b2b",
  padding: "10px 20px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};
