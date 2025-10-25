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

  // Cycle forward for a given attribute
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
        <p>Attempts: {attempts}/{maxAttempts}</p>

        {/* Attribute selectors */}
        {["face", "eyes", "hair"].map((cat, idx) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <button onClick={() => cycleOption(idx, -1)}>&lt;</button>
            <div style={{ position: "relative", width: "150px", height: "150px" }}>
              {cat === "eyes" ? (
                <>
                  <img
                    src={guess[idx].img}
                    alt="Left Eye"
                    style={{ position: "absolute", top: "50px", left: "30px", width: "40px", height: "40px" }}
                  />
                  <img
                    src={guess[idx].img}
                    alt="Right Eye"
                    style={{ position: "absolute", top: "50px", left: "80px", width: "40px", height: "40px", transform: "scaleX(-1)" }}
                  />
                </>
              ) : (
                <img src={guess[idx].img} alt={guess[idx].label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              )}
            </div>
            <button onClick={() => cycleOption(idx, 1)}>&gt;</button>
          </div>
        ))}

        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={checkGuess}
            style={{
              background: "#d4af37",
              color: "#3e2c1c",
              fontWeight: "bold",
              border: "2px solid #b88b2b",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Confirm Guess
          </button>
        </div>

        {message && <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>}
      </div>

      {/* Right: History */}
      <div style={{ textAlign: "left" }}>
        <h3 style={{ marginBottom: "1rem" }}>Previous Guesses</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {history.map((h, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {h.guess.map((val, i) => (
                <div
                  key={i}
                  style={{
                    width: "60px",
                    height: "60px",
                    border: "2px solid #d4af37",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f3e0c5",
                    color: "#3e2c1c",
                  }}
                >
                  <img src={val.img} alt={val.label} style={{ width: "90%", height: "90%", objectFit: "contain" }} />
                </div>
              ))}
              <span style={{ fontWeight: "bold" }}>{h.correctCount} correct</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
