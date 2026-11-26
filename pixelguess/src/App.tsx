import "./styles/global.css"
import "./styles/variables.css"
import Multiplayer from "./pages/Multiplayer/Multiplayer"
import Home from "./pages/Home/Home"
import { Routes, Route } from "react-router"
import Sequencia from "./pages/Sequencia/Sequencia"
import ImagemDoDia from "./pages/Imagem do dia/Imgdia"
import Modo from "./pages/Multiplayer/Modo"
import MusicaFundo from "./components/MusicaFundo/MusicaFundo";

export default function App() {
  return (
    <MusicaFundo>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/multiplayer" element={<Multiplayer />} />
        <Route path="/sequencia" element={<Sequencia />} />
        <Route path="/ImagemDoDia" element={<ImagemDoDia />} />
        <Route path="/escolha-modo" element={<Modo />} />
      </Routes>
    </MusicaFundo>
  );
}