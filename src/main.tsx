import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './styles/global.css'
import Home from './pages/Home/Home.tsx'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter>
   <Home/>
   </BrowserRouter> 
  </StrictMode>,
)
