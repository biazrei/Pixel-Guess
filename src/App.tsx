import "./styles/global.css"
import "./styles/variables.css"
import Multiplayer from "./pages/Multiplayer/Multiplayer"
import Home from "./pages/Home/Home"
import { Routes, Route } from "react-router"
import Login from "./pages/Login/Login"
import Sequencia from "./pages/Sequencia/Sequencia"
import ImagemDoDia from "./pages/Imagem do dia/Imagem-do-dia"


export default function App(){
  return (
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/multiplayer" element={<Multiplayer/>}/>
    <Route path="/sequencia" element={<Sequencia/>}/>
    <Route path="/ImagemDoDia" element={<ImagemDoDia/>}/>
    </Routes>
  

  )
}
