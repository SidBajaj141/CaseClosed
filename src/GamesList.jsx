import { Link } from "react-router-dom";

export default function GamesList() {
  return (
    <div style={{ background: "#2b1d0e", color: "#f3e0c5", minHeight: "100vh", padding: "2rem", fontFamily: "serif" }}>
      <h1>Sherlock’s Game Room</h1>
      <ul>
        <li><Link to="/finger" style={{ color: "#d4af37" }}>Fingerprint Hack</Link></li>
        <li><Link to="/code" style={{ color: "#d4af37" }}>Matrix Code Hack</Link></li>
        <li><Link to="/sketch" style={{ color: "#d4af37" }}>Sketch Artist</Link></li>

      </ul>
    </div>
  );
}
