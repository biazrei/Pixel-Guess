import "./styles/global.css"
import "./styles/variables.css"

import Home from "./pages/Home/Home"
import { Routes, Route } from "react-router"
import Login from "./pages/Login/Login"


export default function App(){
  return (
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>

    </Routes>
  

  )
}
