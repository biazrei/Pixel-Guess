import "./styles/global.css"
import "./styles/variables.css"
import Multiplayer from "./pages/Multiplayer/Multiplayer"
import Home from "./pages/Home/Home"
import { Routes, Route } from "react-router"
import Sequencia from "./pages/Sequencia/Sequencia"
import ImagemDoDia from "./pages/Imagem do dia/Imgdia"
import Modo from "./pages/Multiplayer/Modo"
import CriarSala from "./pages/Multiplayer/Criar-sala"
import EntrarSala from "./pages/Multiplayer/EntrarSala"
import ModoAleatorio from "./pages/Multiplayer/Modo-aleatorio"


export default function App(){
  return (
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/multiplayer" element={<Multiplayer/>}/>
    <Route path="/sequencia" element={<Sequencia/>}/>
    <Route path="/ImagemDoDia" element={<ImagemDoDia/>}/>
    <Route path="/escolha-modo" element={<Modo />} />
    <Route path="/criar-sala" element={<CriarSala />} />
    <Route path="/entrar-sala" element={<EntrarSala />} />
    <Route path="/modo-aleatorio" element={<ModoAleatorio />} />
    </Routes>
    
  

  )
}
