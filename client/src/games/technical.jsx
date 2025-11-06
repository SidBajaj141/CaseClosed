
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export default function Code() {
  const { state } = useLocation(); 
  const { username, roomCode } = state || {}; 
  const matrices = [
    {
      matrix: [
        ["1", "3", "X", "B"],
        ["9", "C", "D", "E"],
        ["A", "2", "7", "4"],
      ],
      key: "X7A9",
    },
    {
      matrix: [
        ["A", "B", "C", "D"],
        ["1", "X", "2", "7"],
        ["9", "3", "7", "G"],
      ],
      key: "B372",
    },
    {
      matrix: [
        ["M", "N", "X", "O"],
        ["1", "3", "3", "A"],
        ["B", "C", "7", "9"],
      ],
      key: "N3A9",
    },
  ];

  const [matrixData, setMatrixData] = useState({ matrix: [], key: "" });
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");
  const [isRow, setIsRow] = useState(true);
  const [allowedIndex, setAllowedIndex] = useState(0);
  const [usedCells, setUsedCells] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null); // 'win' or 'lose'
  const navigate = useNavigate();

  useEffect(() => {
    const idx = Math.floor(Math.random() * matrices.length);
    setMatrixData(matrices[idx]);
    setUsedCells([]);
    setInput("");
    setMsg("");
    setIsRow(true);
    setAllowedIndex(0);
    setGameOver(false);
    setGameResult(null);
  }, []);

  const clickCell = (r, c) => {
    if (gameOver) return;
    if ((isRow && r !== allowedIndex) || (!isRow && c !== allowedIndex)) return;
    if (usedCells.some(([ur, uc]) => ur === r && uc === c)) return;

    setInput((prev) => prev + matrixData.matrix[r][c]);
    setUsedCells((prev) => [...prev, [r, c]]);

    if (isRow) setAllowedIndex(c);
    else setAllowedIndex(r);
    setIsRow(!isRow);
  };

  const submit = () => {
    if (gameOver) return;
    if (input === matrixData.key) {
      setMsg("✅ Chat Access Granted");
      setGameOver(true);
      setGameResult("win");
    } else {
      setMsg("❌ Wrong Key");
      // keep playing — user can reset or attempt again
    }
  };

  const reset = () => {
    const idx = Math.floor(Math.random() * matrices.length);
    setMatrixData(matrices[idx]);
    setInput("");
    setMsg("");
    setIsRow(true);
    setAllowedIndex(0);
    setUsedCells([]);
    setGameOver(false);
    setGameResult(null);
  };

  const handleContinue = () => {
    navigate("/chatroom");
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
      <h2> Matrix Hack</h2>
      <p>
        Recreate the encryption key:{" "}
        <b style={{ letterSpacing: "1px" }}>{matrixData.key}</b>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${matrixData.matrix[0]?.length || 4}, 60px)`,
          gap: "10px",
          marginBottom: "1rem",
        }}
      >
        {matrixData.matrix.map((row, r) =>
          row.map((cell, c) => {
            const isUsed = usedCells.some(([ur, uc]) => ur === r && uc === c);
            const isAllowed =
              !isUsed && ((isRow && r === allowedIndex) || (!isRow && c === allowedIndex));

            let style = {
              padding: "15px",
              fontWeight: "bold",
              border: "2px solid #d4af37",
              background: "transparent",
              color: "#d4af37",
              cursor: "not-allowed",
              transition: "all 0.2s ease",
            };

            if (isAllowed && !gameOver) {
              style = {
                ...style,
                background: "#d4af37",
                color: "#3e2c1c",
                cursor: "pointer",
              };
            } else if (isUsed) {
              style = {
                ...style,
                background: "#362e24ff",
                color: "#f3e0c5",
                cursor: "not-allowed",
                transform: "scale(0.95)",
              };
            }

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => clickCell(r, c)}
                disabled={isUsed || gameOver || !isAllowed}
                style={style}
              >
                {cell}
              </button>
            );
          })
        )}
      </div>

      <p style={{ marginTop: "1rem" }}>Current Input: {input}</p>

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        {!gameOver && (
          <>
            <button
              onClick={submit}
              style={{
                padding: "10px 20px",
                background: "#d4af37",
                color: "#3e2c1c",
                fontWeight: "bold",
                border: "2px solid #b88b2b",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#c29e36")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#d4af37")}
            >
              Submit
            </button>

            <button
              onClick={reset}
              style={{
                padding: "10px 20px",
                background: "#d4af37",
                color: "#3e2c1c",
                fontWeight: "bold",
                border: "2px solid #b88b2b",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#c29e36")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#d4af37")}
            >
              Reset
            </button>
          </>
        )}

        {gameResult === "win" && (
          <button
            onClick={() => {
              console.log("Navigating to chatroom with:", { roomCode, username });
              navigate("/chatroom", { state: { roomCode, username } });
                }}
            style={{
              padding: "10px 20px",
              background: "#d4af37",
              color: "#3e2c1c",
              fontWeight: "bold",
              border: "2px solid #b88b2b",
              cursor: "pointer",
            }}
          >
            Continue →
          </button>
        )}
      </div>

      <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{msg}</p>

      {/* Decrypted log fragment shown on success */}
      {gameResult === "win" && (
        <div
          style={{
            marginTop: "20px",
            background: "#1e130a",
            border: "2px solid #d4af37",
            borderRadius: "8px",
            padding: "16px",
            maxWidth: "720px",
            width: "90%",
            color: "#f3e0c5",
            textAlign: "left",
          }}
        >
          <h3 style={{ color: "#d4af37" }}>[DECRYPTED LOG FRAGMENT]</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              lineHeight: "1.4",
              margin: 0,
            }}
          >
            {`You successfully breach the victim's neural-link chair terminal. Most logs are wiped, but you recover one corrupted data packet from the system's core memory:

SYS_ALERT: MANUAL OVERRIDE INITIATED AUTH_USER: A.THORNE_ADMIN COMMAND: //BYPASS_SAFETY_REGULATOR// TIMESTAMP: 23:40:12

...

REMOTE_PING: Command routed from Terminal 88-B.`}
          </pre>
        </div>
      )}

      <p style={{ marginTop: "10px" }}>
        Allowed {isRow ? "Row" : "Column"}: {allowedIndex + 1}
      </p>
    </div>
  );
}
