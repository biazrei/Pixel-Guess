"./Imagem-do-dia.css"
import { useNavigate } from 'react-router'
import Button from '../../components/Button/Button'

export default function ImagemDoDia () {
    const navigate = useNavigate()
    
    return (
        <main>
            <h1>Imagem do Dia</h1>
            <Button onClick={() => navigate("/")}>Voltar</Button>
        </main>
    )
}