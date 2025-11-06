import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "./socket.js";

export default function ChatRoom() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { roomCode, username } = state || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [vote, setVote] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [voteProgress, setVoteProgress] = useState(null);
  const [voteResult, setVoteResult] = useState(null);
  const [showEndScreen, setShowEndScreen] = useState(false);

  useEffect(() => {
    if (!roomCode || !username) return;

    socket.on("chatMessage", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("voteProgress", (data) => setVoteProgress(data));
    socket.on("voteResult", (data) => {
      setVoteResult(data);
      setVoteProgress(null);
      // Delay before showing win/lose screen
      setTimeout(() => setShowEndScreen(true), 2000);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("voteProgress");
      socket.off("voteResult");
    };
  }, [roomCode, username]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = { roomCode, username, text: input };
    socket.emit("chatMessage", msg);
    setInput("");
  };

  const submitVote = () => {
    if (!vote) return alert("Select a suspect before voting.");
    socket.emit("submitVote", { roomCode, username, suspect: vote });
    setHasVoted(true);
  };

  const handleReplay = () => {
    navigate("/");
  };

  if (showEndScreen && voteResult) {
    return (
      <div
        style={{
          background: voteResult.correct ? "#0d1f0d" : "#2a0000",
          color: "#f3e0c5",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "monospace",
          transition: "all 0.5s ease",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            color: voteResult.correct ? "#00ff88" : "#ff5555",
            marginBottom: "1rem",
          }}
        >
          {voteResult.correct ? "🎉 Victory!" : "💀 Mission Failed!"}
        </h1>

        <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
          {voteResult.message}
        </p>
        <p style={{ opacity: 0.8 }}>
          Real culprit: <strong>{voteResult.criminal}</strong>
        </p>

        <button
          onClick={handleReplay}
          style={{
            marginTop: "2rem",
            padding: "12px 24px",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "2px solid #d4af37",
            background: "#d4af37",
            color: "#3e2c1c",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#c29e36")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#d4af37")}
        >
          🔁 Replay
        </button>
      </div>
    );
  }

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
      <h2 style={{ color: "#d4af37", marginBottom: "1rem" }}>
        🗨️ Secure Comms Terminal
      </h2>

      <div
        style={{
          background: "#2e1f13",
          border: "2px solid #d4af37",
          borderRadius: "8px",
          padding: "20px",
          width: "90%",
          maxWidth: "900px",
          height: "750px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#1b120b",
            border: "1px solid #b88b2b",
            borderRadius: "6px",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.6 }}>
              No transmissions yet...
            </p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "8px",
                  textAlign: msg.username === username ? "right" : "left",
                }}
              >
                <strong
                  style={{
                    color: msg.username === username ? "#d4af37" : "#00bfff",
                  }}
                >
                  {msg.username}
                </strong>
                : {msg.text}
              </div>
            ))
          )}
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{
              flex: 1,
              borderRadius: "6px",
              border: "1px solid #b88b2b",
              padding: "10px",
              background: "#3a2615",
              color: "#f3e0c5",
              outline: "none",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "10px 18px",
              background: "#d4af37",
              color: "#3e2c1c",
              fontWeight: "bold",
              border: "2px solid #b88b2b",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#c29e36")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#d4af37")}
          >
            Send
          </button>
        </div>

        <div
          style={{
            background: "#1b120b",
            border: "1px solid #b88b2b",
            borderRadius: "6px",
            padding: "12px",
          }}
        >
          <h3 style={{ color: "#d4af37", marginBottom: "10px" }}>
            🗳️ Vote for the Suspect
          </h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            {["Marcus Cole", "Evelyn Reed", "Dr. Aris Thorne"].map((suspect) => (
              <button
                key={suspect}
                disabled={hasVoted}
                onClick={() => setVote(suspect)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border:
                    vote === suspect
                      ? "2px solid #d4af37"
                      : "1px solid #b88b2b",
                  background:
                    vote === suspect ? "#d4af37" : "rgba(212,175,55,0.1)",
                  color: vote === suspect ? "#3e2c1c" : "#f3e0c5",
                  cursor: hasVoted ? "not-allowed" : "pointer",
                }}
              >
                {suspect}
              </button>
            ))}
          </div>

          <button
            onClick={submitVote}
            disabled={hasVoted || !vote}
            style={{
              width: "100%",
              padding: "10px",
              background: hasVoted ? "#555" : "#00bfff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: hasVoted ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {hasVoted ? "Vote Submitted" : "Submit Vote"}
          </button>

          {voteProgress && !voteResult && (
            <p style={{ marginTop: "10px", color: "#d4af37" }}>
              Votes received: {voteProgress.totalVotes}/{voteProgress.totalPlayers}
            </p>
          )}
        </div>
      </div>

      <p style={{ marginTop: "1rem", fontSize: "0.9rem", opacity: 0.8 }}>
        Room Code: <span style={{ color: "#d4af37" }}>{roomCode}</span> | User:{" "}
        <span style={{ color: "#00bfff" }}>{username}</span>
      </p>
    </div>
  );
}
