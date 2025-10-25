// Startup.jsx
import { useNavigate } from "react-router-dom";

export default function Startup() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Game Hub</h1>
      <button
        onClick={() => navigate("/story")}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Play
      </button>
      <button
        onClick={() => alert("Server logic not implemented")}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Server
      </button>
    </div>
  );
}
