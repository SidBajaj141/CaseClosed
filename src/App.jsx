import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Startup from "./Startup";
import Story from "./Story";
import GamesList from "./gameslist";
import Code from "./games/technicalHack.jsx";
import Finger from "./games/ForensicFingerprint.jsx";
import PurbleShopLogic from "./games/sketchArtist.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startup />} />
        <Route path="/story" element={<Story />} />
        <Route path="/games" element={<GamesList />} />
        <Route path="/finger" element={<Finger />} />
        <Route path="/code" element={<Code />} />
        <Route path="/sketch" element={<PurbleShopLogic />} />
      </Routes>
    </Router>
  );
}
