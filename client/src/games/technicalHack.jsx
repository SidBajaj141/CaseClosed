import React, { useState, useEffect } from "react";

export default function Code() {
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

  useEffect(() => {
    const idx = Math.floor(Math.random() * matrices.length);
    setMatrixData(matrices[idx]);
    setUsedCells([]);
    setInput("");
    setMsg("");
    setIsRow(true);
    setAllowedIndex(0);
  }, []);

  const clickCell = (r, c) => {
    if ((isRow && r !== allowedIndex) || (!isRow && c !== allowedIndex)) return;
    if (usedCells.some(([ur, uc]) => ur === r && uc === c)) return;

    setInput(input + matrixData.matrix[r][c]);
    setUsedCells([...usedCells, [r, c]]);

    if (isRow) setAllowedIndex(c);
    else setAllowedIndex(r);
    setIsRow(!isRow);
  };

  const submit = () => {
    if (input === matrixData.key) setMsg("✅ Chat Access Granted ");
    else setMsg("❌ Wrong Key");
  };

  const reset = () => {
    setInput("");
    setMsg("");
    setIsRow(true);
    setAllowedIndex(0);
    setUsedCells([]);
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
      <p>Recreate the encryption key: <b>{matrixData.key}</b></p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${matrixData.matrix[0]?.length}, 60px)`, gap: "10px" }}>
        {matrixData.matrix.map((row, r) =>
          row.map((cell, c) => {
            const isUsed = usedCells.some(([ur, uc]) => ur === r && uc === c);
            const isAllowed = !isUsed && ((isRow && r === allowedIndex) || (!isRow && c === allowedIndex));

            let style = {
              padding: "15px",
              fontWeight: "bold",
              border: "2px solid #d4af37",
              background: "transparent",
              color: "#d4af37",
              cursor: "not-allowed",
              transition: "all 0.2s ease",
            };

            if (isAllowed) {
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
              <button key={`${r}-${c}`} onClick={() => clickCell(r, c)} disabled={isUsed} style={style}>
                {cell}
              </button>
            );
          })
        )}
      </div>

      <p style={{ marginTop: "1rem" }}>Current Input: {input}</p>
      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
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
    onMouseEnter={e => (e.currentTarget.style.background = "#c29e36")}
    onMouseLeave={e => (e.currentTarget.style.background = "#d4af37")}
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
    onMouseEnter={e => (e.currentTarget.style.background = "#c29e36")}
    onMouseLeave={e => (e.currentTarget.style.background = "#d4af37")}
  >
    Reset
  </button>
</div>

      <p style={{ marginTop: "1rem" }}>{msg}</p>
      <p>Allowed {isRow ? "Row" : "Column"}: {allowedIndex + 1}</p>
    </div>
  );
}