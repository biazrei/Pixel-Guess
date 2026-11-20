import "./styles/global.css"
import "./styles/variables.css"
import Multiplayer from "./pages/Multiplayer/Multiplayer"
import Home from "./pages/Home/Home"
import { Routes, Route } from "react-router"
import Sequencia from "./pages/Sequencia/Sequencia"
import ImagemDoDia from "./pages/Imagem do dia/Imgdia"
import Salas from "./pages/Multiplayer/Salas"


export default function App(){
  return (
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/Multiplayer" element={<Multiplayer/>}/>
    <Route path="/Sequencia" element={<Sequencia/>}/>
    <Route path="/ImagemDoDia" element={<ImagemDoDia/>}/>
    <Route path="/Salas" element={<Salas />} />
    </Routes>
    
  

  )
}
