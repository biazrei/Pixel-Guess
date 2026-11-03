import "./Criar-sala.css"
import Button from "../../components/Button/Button"
import Text from "../../components/Text/Text"
import { useNavigate } from "react-router"

export default function Sala() {
    const navigate = useNavigate()
    const numeroSala = "#0202FG0"

    return (
        <main className="sala">
            <div className="sala__codigo">
                <Text>Nº da sala</Text>
                <Text>{numeroSala}</Text>
            </div>

            <div className="sala__status">
                <Text>Aguardando jogador...</Text>

                <Button type="button" onClick={() => navigate("/escolha-modo")}>
                    SAIR
                </Button>
            </div>
        </main>
    )
}