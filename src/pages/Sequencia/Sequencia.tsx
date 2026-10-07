"./Sequencia.css"
import Button from "../../components/Button/Button"
import { useNavigate } from 'react-router'

export default function Sequencia() {
     const navigate = useNavigate()
    return (
        <main>
            <h1>Sequência</h1>
            <Button onClick={() => navigate("/")}>Voltar</Button>
            
        </main>
    )
}