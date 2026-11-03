"./Sequencia.css"
import Button from "../../components/Button/Button"
import { useNavigate } from 'react-router'
import Input from "../../components/Input/Input"

export default function Sequencia() {
     const navigate = useNavigate()
    return (
        <main>
            <h1>Sequência</h1>
            <Input/>
            <Button onClick={() => navigate("/")}>Voltar</Button>
            
        </main>
    )
}