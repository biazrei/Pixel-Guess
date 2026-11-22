import "./EntrarSala.css"
import { useEffect, useState } from "react";
import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import Text from "../../components/Text/Text"
import { useNavigate } from "react-router"
import socket from "../../services/socket";

export default function EntrarSala() {
    const navigate = useNavigate()
    const [codigo, setCodigo] = useState("");
    const [erro, setErro] = useState("");

     useEffect(() => {
        function jogadoresReunidos() {
            navigate("/multiplayer");
        }

        function receberErro(mensagem: string) {
            setErro(mensagem);
        }

        socket.on("jogadores-reunidos", jogadoresReunidos);
        socket.on("erro-sala", receberErro);

        return () => {
            socket.off("jogadores-reunidos", jogadoresReunidos);
            socket.off("erro-sala", receberErro);
        };
    }, [navigate]);

    function entrarNaSala() {
        const codigoFormatado = codigo.trim().toUpperCase();

        if (!codigoFormatado) {
            setErro("Digite o código da sala.");
            return;
        }

        setErro("");
        socket.emit("entrar-sala-privada", codigoFormatado);
    }

    return (
        <main className="entrar-sala">
            <div className="entrar-sala__content">
                <Text>
                    Digite o código
                    <br />
                    da sala
                </Text>

                <Input type="text"
                       placeholder="Código da sala"
                       value={codigo}
                       aoDigitar={setCodigo}  
                    />

                    {erro && <p>{erro}</p>}

                <div className="entrar-sala__buttons">
                    <Button
                        type="button" cor="button--purple" onClick={entrarNaSala}
                        >
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