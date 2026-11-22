import "./Criar-sala.css"
import Button from "../../components/Button/Button"
import Text from "../../components/Text/Text"
import { useNavigate } from "react-router"
import { useEffect, useState } from "react";
import socket from "../../services/socket";

export default function Sala() {
    const navigate = useNavigate()
    const [numeroSala, setNumeroSala] = useState("");

    useEffect(() => {
        function receberCodigo(dados: { codigo: string }) {
            setNumeroSala(dados.codigo);
        }

        function jogadoresReunidos() {
            navigate("/multiplayer");
      }

        socket.on("sala-criada", receberCodigo);
        socket.on("jogadores-reunidos", jogadoresReunidos);

        socket.emit("criar-sala-privada");

        return () => {
            socket.off("sala-criada", receberCodigo);
            socket.off("jogadores-reunidos", jogadoresReunidos);
        };
    }, [navigate]);

    return (
        <main className="sala">
            <div className="sala__codigo">
                <Text>Nº da sala</Text>
                <Text>{numeroSala || "Gerando código..."}</Text>
            </div>

            <div className="sala__status">
                <Text>Aguardando jogador...</Text>

                    <Button type="button" onClick={() => { socket.emit("finalizar-partida"); navigate("/escolha-modo")}}>
                    SAIR
                </Button>
            </div>
        </main>
    )
}