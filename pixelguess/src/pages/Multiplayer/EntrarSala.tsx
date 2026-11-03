import "./EntrarSala.css"
import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import Text from "../../components/Text/Text"
import { useNavigate } from "react-router"

export default function EntrarSala() {
    const navigate = useNavigate()

    return (
        <main className="entrar-sala">
            <div className="entrar-sala__content">
                <Text>
                    Digite o código
                    <br />
                    da sala
                </Text>

                <Input type="text" />

                <div className="entrar-sala__buttons">
                    <Button
                        type="button" cor="button--purple">
                        ENTRAR
                    </Button>

                    <Button type="button" onClick={() => navigate("/escolha-modo")}>
                        VOLTAR
                    </Button>
                </div>
            </div>
        </main>
    )
}