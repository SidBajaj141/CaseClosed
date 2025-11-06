import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Startup from "./Startup";
import Story from "./Story";
import GamesList from "./GamesList.jsx";
import Code from "./games/technical.jsx";
import Fingerprint from "./games/forensic.jsx";
import PurbleShopLogic from "./games/sketchArtist.jsx";
import RoleScreen from "./RoleScreen.jsx";
import Interrogator from "./games/interrogator.jsx"
import ChatRoom from "./chatroom.jsx";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startup />} />
        <Route path="/story" element={<Story />} />
        <Route path="/roles" element={<RoleScreen />} />
        <Route path="/games" element={<GamesList />} />
        <Route path="/forensic" element={<Fingerprint />} />
        <Route path="/technical" element={<Code />} />
        <Route path="/sketchartist" element={<PurbleShopLogic />} />
        <Route path="/interogator" element={<Interrogator />} />
        <Route path="/chatroom" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}