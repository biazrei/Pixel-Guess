import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./Modo-aleatorio.css";
import Text from "../../components/Text/Text";
import socket from "../../services/socket";

export default function ModoAleatorio() {
    const navigate = useNavigate();
    const [mensagem, setMensagem] = useState("Conectando ao servidor...");
    const [erro, setErro] = useState("");

    useEffect(() => {
        function entrarNaBusca() {
            setMensagem("Procurando jogador...");
            socket.emit("entrar-aleatorio");
        }

        function aguardarJogador(dados: { mensagem: string }) {
            setMensagem(dados.mensagem);
        }

        function jogadoresReunidos() {
            navigate("/multiplayer");
        }

        function mostrarErro(mensagemErro: string) {
            setErro(mensagemErro);
        }

        socket.on("aguardando-jogador", aguardarJogador);
        socket.on("jogadores-reunidos", jogadoresReunidos);
        socket.on("erro-sala", mostrarErro);

        if (socket.connected) {
            entrarNaBusca();
        } else {
            socket.once("connect", entrarNaBusca);
            socket.connect();
        }

        return () => {
            socket.off("connect", entrarNaBusca);
            socket.off("aguardando-jogador", aguardarJogador);
            socket.off("jogadores-reunidos", jogadoresReunidos);
            socket.off("erro-sala", mostrarErro);
        };
    }, [navigate]);

    return (
        <main className="modo-aleatorio">
            <div className="modo-aleatorio__content">
                <svg
                    className="modo-aleatorio__icon"
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                >
                    <circle cx="32" cy="32" r="29" />
                    <circle cx="32" cy="23" r="11" />
                    <path d="M13 51c3-12 10-18 19-18s16 6 19 18" />
                </svg>

                <Text>{erro || mensagem}</Text>

                {erro && (
                    <button
                        type="button"
                        onClick={() => navigate("/escolha-modo")}
                    >
                        VOLTAR
                    </button>
                )}
            </div>
        </main>
    );
}