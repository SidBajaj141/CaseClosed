import React, { useState } from "react";

// Add image paths for your assets
const options = {
  face: [
    { name: "face1", label: "Face 1", img: "src/SketchArtist/head 1.png" },
    { name: "face2", label: "Face 2", img: "src/SketchArtist/head 2.png" },
    { name: "face3", label: "Face 3", img: "src/SketchArtist/head 3.png" },
  ],
  eyes: [
    { name: "eyes1", label: "Eyes 1", img: "src/SketchArtist/eye 1.png" },
    { name: "eyes2", label: "Eyes 2", img: "src/SketchArtist/eye 2.png" },
    { name: "eyes3", label: "Eyes 3", img: "src/SketchArtist/eye 3.png" },
  ],
  hair: [
    { name: "hair1", label: "Hair 1", img: "src/SketchArtist/hair 1.png" },
    { name: "hair2", label: "Hair 2", img: "src/SketchArtist/hair 2.png" },
    { name: "hair3", label: "Hair 3", img: "src/SketchArtist/hair 3.png" },
  ],
};

const randomSuspect = () => ({
  face: options.face[Math.floor(Math.random() * options.face.length)],
  eyes: options.eyes[Math.floor(Math.random() * options.eyes.length)],
  hair: options.hair[Math.floor(Math.random() * options.hair.length)],
});

export default function PurbleShopLogic() {
  const [suspect] = useState(randomSuspect());
  const [guess, setGuess] = useState([options.face[0], options.eyes[0], options.hair[0]]);
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState([]);
  const maxAttempts = 8;
  const [message, setMessage] = useState("");

  // Cycle forward/backward for a given attribute
  const cycleOption = (idx, direction = 1) => {
    const cat = Object.keys(options)[idx];
    const currentIndex = options[cat].findIndex((o) => o.name === guess[idx].name);
    const nextIndex = (currentIndex + direction + options[cat].length) % options[cat].length;
    const newGuess = [...guess];
    newGuess[idx] = options[cat][nextIndex];
    setGuess(newGuess);
  };

  const checkGuess = () => {
    if (attempts >= maxAttempts) return;

    let correctCount = 0;
    guess.forEach((val, idx) => {
      const cat = Object.keys(options)[idx];
      if (val.name === suspect[cat].name) correctCount += 1;
    });

    setHistory([...history, { guess: [...guess], correctCount }]);
    setAttempts(attempts + 1);

    if (correctCount === 3) setMessage("✅ Correct! You matched the suspect!");
    else if (attempts + 1 === maxAttempts)
      setMessage(`❌ Out of attempts! Suspect was: Face-${suspect.face.label}, Eyes-${suspect.eyes.label}, Hair-${suspect.hair.label}`);
    else setMessage(`You have ${correctCount} correct attributes`);
  };

  // Render a layered preview image, optional scale for history
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
      {/* Eyes */}
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
      {/* Hair */}
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

        {/* Shifted container */}
        <div style={{ marginTop: "20%" }}>
          {/* Preview Box */}
          <div style={{ margin: "1rem auto" }}>{renderPreview(guess)}</div>

          {/* Arrow Controls */}
          {["Face", "Eyes", "Hair"].map((cat, idx) => (
            <div
              key={cat}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}
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

          {/* Attempts line moved below submit button */}
          <p style={{ marginTop: "1rem" }}>Attempts: {attempts}/{maxAttempts}</p>
          {message && <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>{message}</p>}
        </div>
      </div>

      {/* Right: History */}
      <div style={{ textAlign: "left", backgroundColor: "#d4af37", padding: "1rem", borderRadius: "8px" }}>
        <h3 style={{ marginBottom: "1rem" }}>Previous Guesses</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {history.map((h, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {renderPreview(h.guess, 0.3)} {/* 60% size for history */}
              <span style={{ fontWeight: "bold", marginLeft: "0.5rem" }}>{h.correctCount} correct</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
