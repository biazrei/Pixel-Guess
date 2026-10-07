import "./styles/global.css"
import "./styles/variables.css"
import Multiplayer from "./pages/Multiplayer/Multiplayer"
import Home from "./pages/Home/Home"
import { Routes, Route } from "react-router"
import Login from "./pages/Login/Login"
import Sequencia from "./pages/Sequencia/Sequencia"
import ImagemDoDia from "./pages/Imagem do dia/Imagem-do-dia"
import Registro from "./pages/Registro/Registro"
import Recuperar from "./pages/Recuperar conta/Recuperar"


export default function App(){
  return (
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/multiplayer" element={<Multiplayer/>}/>
    <Route path="/sequencia" element={<Sequencia/>}/>
    <Route path="/ImagemDoDia" element={<ImagemDoDia/>}/>
    <Route path="/registro" element={<Registro/>}/>
    <Route path="/recuperar-senha" element={<Recuperar/>}/>
    </Routes>
    
  

  )
}
