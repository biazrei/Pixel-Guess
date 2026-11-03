import "./Modo.css"
import { useNavigate } from "react-router"
import Button from "../../components/Button/Button"
import Title from "../../components/Title/Title"

export default function Modo() {
    const navigate = useNavigate()

    return (
        <main className="modo">
            <div className="modo__text">

                <Title> ESCOLHA O MODO </Title>

            </div>

            <div className="modo__buttons">
                <Button type="button" cor="purple"  onClick={() => navigate("/modo-aleatorio")}>
                    ALEATÓRIO
                </Button>

                <Button type="button" cor="purple" onClick={() => navigate("/criar-sala")}>
                    CRIAR UMA SALA
                </Button>

                <Button type="button" cor="purple" onClick={() => navigate("/entrar-sala")}>
                    ENTRAR EM UMA SALA
                </Button>

                <Button type="button" onClick={() => navigate("/")}>
                    VOLTAR
                </Button>
            </div>
        </main>
    )
}