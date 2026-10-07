"./Multiplayer.css"
import { useNavigate } from 'react-router'
import Button from '../../components/Button/Button'

export default function Multiplayer() {
     const navigate = useNavigate()

    return (
        <main>
            <h1>Multiplayer</h1>
            <Button onClick={() => navigate("/")}>Voltar</Button>
        </main>
    )
}