import React, { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom"; // 👈 import navigation hook

// Add image paths for your assets
const options = {
  face: [
    { name: "face1", label: "Face 1", img: "src/assets/SketchArtist/head 1.png" },
    { name: "face2", label: "Face 2", img: "src/assets/SketchArtist/head 2.png" },
    { name: "face3", label: "Face 3", img: "src/assets/SketchArtist/head 3.png" },
  ],
  eyes: [
    { name: "eyes1", label: "Eyes 1", img: "src/assets/SketchArtist/eye 1.png" },
    { name: "eyes2", label: "Eyes 2", img: "src/assets/SketchArtist/eye 2.png" },
    { name: "eyes3", label: "Eyes 3", img: "src/assets/SketchArtist/eye 3.png" },
  ],
  hair: [
    { name: "hair1", label: "Hair 1", img: "src/assets/SketchArtist/hair 1.png" },
    { name: "hair2", label: "Hair 2", img: "src/assets/SketchArtist/hair 2.png" },
    { name: "hair3", label: "Hair 3", img: "src/assets/SketchArtist/hair 3.png" },
  ],
};

const randomSuspect = () => ({
  face: options.face[Math.floor(Math.random() * options.face.length)],
  eyes: options.eyes[Math.floor(Math.random() * options.eyes.length)],
  hair: options.hair[Math.floor(Math.random() * options.hair.length)],
});

export default function PurbleShopLogic() {
  const { state } = useLocation(); 
  const { username, roomCode } = state || {};
  const navigate = useNavigate(); // 👈 initialize navigate function
  const [suspect] = useState(randomSuspect());
  const [guess, setGuess] = useState([options.face[0], options.eyes[0], options.hair[0]]);
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState([]);
  const maxAttempts = 8;
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null); // 'win' or 'lose'

  const cycleOption = (idx, direction = 1) => {
    const cat = Object.keys(options)[idx];
    const currentIndex = options[cat].findIndex((o) => o.name === guess[idx].name);
    const nextIndex = (currentIndex + direction + options[cat].length) % options[cat].length;
    const newGuess = [...guess];
    newGuess[idx] = options[cat][nextIndex];
    setGuess(newGuess);
  };

  const checkGuess = () => {
    if (attempts >= maxAttempts || gameOver) return;

    let correctCount = 0;
    guess.forEach((val, idx) => {
      const cat = Object.keys(options)[idx];
      if (val.name === suspect[cat].name) correctCount += 1;
    });

    setHistory([...history, { guess: [...guess], correctCount }]);
    setAttempts(attempts + 1);

    if (correctCount === 3) {
      setMessage("✅ Correct! You matched the suspect!");
      setGameOver(true);
      setGameResult("win");
    } else if (attempts + 1 === maxAttempts) {
      setMessage(
        `❌ Out of attempts! Suspect was: Face-${suspect.face.label}, Eyes-${suspect.eyes.label}, Hair-${suspect.hair.label}`
      );
      setGameOver(true);
      setGameResult("lose");
    } else {
      setMessage(`You have ${correctCount} correct attributes`);
    }
  };

  const renderPreview = (g, scale = 1) => (
    <div
      style={{
        position: "relative",
        width: `${150 * scale}px`,
        height: `${150 * scale}px`,
      }}
    >
      <img
        src={g[0].img}
        alt="Face"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          zIndex: 1,
        }}
      />
      <img
        src={g[1].img}
        alt="Left Eye"
        style={{
          position: "absolute",
          top: `${50 * scale}px`,
          left: `${30 * scale}px`,
          width: `${40 * scale}px`,
          height: `${40 * scale}px`,
          zIndex: 2,
        }}
      />
      <img
        src={g[1].img}
        alt="Right Eye"
        style={{
          position: "absolute",
          top: `${50 * scale}px`,
          left: `${80 * scale}px`,
          width: `${40 * scale}px`,
          height: `${40 * scale}px`,
          transform: "scaleX(-1)",
          zIndex: 2,
        }}
      />
      <img
        src={g[2].img}
        alt="Hair"
        style={{
          position: "absolute",
          top: `${-40 * scale}px`,
          left: `${3 * scale}px`,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          zIndex: 3,
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        background: "#3e2c1c",
        color: "#f3e0c5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "monospace",
        padding: "2rem",
        gap: "4rem",
      }}
    >
      {/* Left: Current Guess */}
      <div className="text-center">
        <h2 style={{ marginBottom: "1rem" }}>👤 Sketch Artist</h2>

        <div style={{ marginTop: "20%" }}>
          <div style={{ margin: "1rem auto" }}>{renderPreview(guess)}</div>

          {!gameOver && (
            <>
              {["Face", "Eyes", "Hair"].map((cat, idx) => (
                <div
                  key={cat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <button onClick={() => cycleOption(idx, -1)}>&lt;</button>
                  <span style={{ width: "80px" }}>{guess[idx].label}</span>
                  <button onClick={() => cycleOption(idx, 1)}>&gt;</button>
                </div>
              ))}

              <button
                onClick={checkGuess}
                style={{
                  marginTop: "1rem",
                  padding: "10px 20px",
                  background: "#d4af37",
                  border: "2px solid #b88b2b",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Confirm Guess
              </button>
              <p style={{ marginTop: "1rem" }}>
                Attempts: {attempts}/{maxAttempts}
              </p>
            </>
          )}

          {message && (
            <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>{message}</p>
          )}

          {/* 🧩 NEW: Clue + Continue button */}
          {gameOver && (
            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                backgroundColor: "#1e130a",
                border: "2px solid #d4af37",
                borderRadius: "8px",
                textAlign: "left",
                width: "320px",
              }}
            >
              {gameResult === "win" ? (
                <>
                  <h3 style={{ color: "#d4af37", marginBottom: "0.5rem" }}>
                    [WITNESS COMPOSITE]
                  </h3>
                  <p style={{ fontSize: "0.9rem", lineHeight: "1.4rem" }}>
                    A janitor cleaning the 87th-floor stairwell saw someone dash
                    from the 88th-floor emergency exit around 11:50 PM. The
                    janitor was flustered and only caught a glimpse.
                    <br />
                    <br />
                    Your composite sketch, based on the janitor's panicked
                    description, shows a person with:
                    <br />
                    <br />
                    • A sharp, defined jawline. <br />
                    • Short, sleek hair, possibly tied back. <br />
                    • Notably expensive-looking "augmented-reality" glasses,
                    glowing faintly blue. <br />
                    <br />
                    (Of the suspects, only <b>Evelyn Reed</b> wears that specific,
                    high-fashion brand of AR glasses.)
                  </p>
                </>
              ) : (
                <h3 style={{ color: "#ff4444", textAlign: "center" }}>
                  ❌ Failed to identify the suspect.
                </h3>
              )}

              {/* Continue button */}
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <button
                  onClick={() => {
  console.log("Navigating to chatroom with:", { roomCode, username });
  navigate("/chatroom", { state: { roomCode, username } });
}}
                  style={{
                    padding: "10px 25px",
                    background: "#d4af37",
                    border: "2px solid #b88b2b",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: History */}
      <div
        style={{
          textAlign: "left",
          backgroundColor: "#d4af37",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>Previous Guesses</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {history.map((h, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {renderPreview(h.guess, 0.3)}
              <span style={{ fontWeight: "bold", marginLeft: "0.5rem" }}>
                {h.correctCount} correct
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
