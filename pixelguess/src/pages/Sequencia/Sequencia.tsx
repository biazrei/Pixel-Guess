import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import Text from "../../components/Text/Text"
import Title from "../../components/Title/Title"
import "./Sequencia.css"
import { useNavigate } from "react-router"

export default function Sequencia(){
    const navigate = useNavigate();
    return(
        <main className="sequencia">
            <div className="seq__grid">
                <Title> GAME CONTAINER AQUI</Title>
            </div>

            <form className="seq__form">
                <Text cor="aviso"> APENAS 1 TENTATIVA   </Text>
                <Input
                type="text"
                placeholder="Digite sua resposta"
                ></Input>
                <Button type="submit" cor="green"> ENVIAR RESPOSTA</Button>
                <Button type="button"
                onClick={() => navigate("/")}>SAIR</Button>

            </form>



        </main>
    )
}