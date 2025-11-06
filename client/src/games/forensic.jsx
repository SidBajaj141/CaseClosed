import React, { useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";

const slices = [
  "src/assets/Fingerprints/00.png",
  "src/assets/Fingerprints/01.png",
  "src/assets/Fingerprints/02.png",
  "src/assets/Fingerprints/03.png",
  "src/assets/Fingerprints/04.png",
];

const correctOrder = [0, 1, 2, 3, 4];

const getRandomSlots = () =>
  Array.from({ length: correctOrder.length }, () =>
    Math.floor(Math.random() * slices.length)
  );

export default function Fingerprint() {
  const { state } = useLocation(); 
  const { username, roomCode } = state || {};
  const [slots, setSlots] = useState(getRandomSlots);
  const [msg, setMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [solved, setSolved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!started || gameOver) return;
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
    if (!started) setStarted(true);
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
      setSolved(true);
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
    setStarted(false);
    setSolved(false);
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
        {!solved && (
          <>
            <button
              onClick={submit}
              style={actionButtonStyle}
              disabled={gameOver}
            >
              Submit
            </button>
            <button
              onClick={reset}
              style={{ ...actionButtonStyle, marginLeft: "10px" }}
            >
              Reset
            </button>
          </>
        )}
        {solved && (
          <button
            onClick={() => {
  console.log("Navigating to chatroom with:", { roomCode, username });
  navigate("/chatroom", { state: { roomCode, username } });
}}
            style={{
              ...actionButtonStyle,
              background: "#4caf50",
              border: "2px solid #2e7d32",
            }}
          >
            Continue
          </button>
        )}
      </div>

      <p style={{ marginTop: "10px" }}>{msg}</p>

      {solved && (
        <div
          style={{
            background: "#2b1d11",
            color: "#f3e0c5",
            border: "2px solid #d4af37",
            borderRadius: "10px",
            padding: "20px",
            marginTop: "20px",
            width: "80%",
            maxWidth: "500px",
            textAlign: "left",
          }}
        >
          <h3 style={{ color: "#d4af37" }}>[FORENSICS REPORT]</h3>
          <p>
            You are matching a partial, smudged fingerprint found on the inside
            of the chair's power-conduit panel, which was forced open.
          </p>
          <p>
            After careful analysis, the print is a <b>6-point match</b> for{" "}
            <b>Marcus Cole (Security Chief)</b>.
          </p>
          <p>
            The print was mixed with a <b>graphite-based lubricant</b>, the same
            kind used to silence squeaky door hinges.
          </p>
        </div>
      )}
    </div>
  );
}

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
