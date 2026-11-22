import "./Multiplayer.css";
import { useNavigate } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { StepBack } from "lucide-react";
import Text from "../../components/Text/Text";
import Puzzle from "../../components/Puzzle/Puzzle";
import type { ImagemMultiplayer } from "./Service/MultiplayerService";
import socket from "../../services/socket";

type RoundResult = "completed" | "active" | "pending";

export default function Multiplayer() {
    const navigate = useNavigate();
    const [partidaIniciada, setPartidaIniciada] = useState(false);
    const [jogadoresProntos, setJogadoresProntos] = useState(0);
    const [jaEstouPronto, setJaEstouPronto] = useState(false);
    const [oponenteDesconectou, setOponenteDesconectou] = useState(false);
    const [tempo, setTempo] = useState(40);
    const [imagemAtual, setImagemAtual] = useState<ImagemMultiplayer | null>(null);
    const erro = "";
    const [pontos, setPontos] = useState(0);
    const [rodadaFinalizada, setRodadaFinalizada] = useState(false);
    const [rodadaAtual, setRodadaAtual] = useState(1);
    const [pontuacoesRodadas, setPontuacoesRodadas] = useState<number[]>([]);
    const [partidaEncerrada, setPartidaEncerrada] = useState(false);
    const [aguardandoOponente, setAguardandoOponente] = useState(false);
    const atualizarPontos = useCallback((novosPontos: number) => {setPontos(novosPontos);
    
}, []);

    const rounds: RoundResult[] = Array.from(
    { length: 5 },
    (_, index) => {
        if (index < pontuacoesRodadas.length) return "completed";
        if (index === rodadaAtual - 1) return "active";
        return "pending";
    }
);

    const pontuacaoTotal = pontuacoesRodadas.reduce(
    (total, pontosRodada) => total + pontosRodada,
    0
);

    function avancarRodada() {
    if (rodadaAtual >= 5) return;

    setAguardandoOponente(true);
    socket.emit("jogador-proxima-rodada");
}

    useEffect(() => {
    function atualizarProntos(dados: { quantidade: number }) {
        setJogadoresProntos(dados.quantidade);
    }

    function iniciarPartida(dados: {
    rodada: number;
    imagem: ImagemMultiplayer;
}) {
    setRodadaAtual(dados.rodada);
    setImagemAtual(dados.imagem);
    setPontos(0);
    setTempo(40);
    setPartidaIniciada(true);
}

    function receberProximaRodada(dados: {
    rodada: number;
    imagem: ImagemMultiplayer;
    
}) {

    setRodadaAtual(dados.rodada);
    setImagemAtual(dados.imagem);
    setPontos(0);
    setTempo(40);
    setRodadaFinalizada(false);
    setAguardandoOponente(false);
}

    function jogadorDesconectou() {
    setOponenteDesconectou(true);
    }

    function encerrarPartida() {
    setPartidaEncerrada(true);
    }

    socket.on("atualizar-prontos", atualizarProntos);
    socket.on("partida-iniciada", iniciarPartida);
    socket.on("proxima-rodada", receberProximaRodada);
    socket.on("jogador-desconectou", jogadorDesconectou);
    socket.on("partida-encerrada", encerrarPartida);

    return () => {
    socket.off("atualizar-prontos", atualizarProntos);
    socket.off("partida-iniciada", iniciarPartida);
    socket.off("proxima-rodada", receberProximaRodada);
    socket.off("jogador-desconectou", jogadorDesconectou);
    socket.off("partida-encerrada", encerrarPartida);
    };
}, []);

    useEffect(() => {
    if (!partidaIniciada || rodadaFinalizada) return;

    if (tempo <= 0) {
        if (!rodadaFinalizada) {
            setPontuacoesRodadas((anteriores) => [
                ...anteriores,
                pontos
            ]);

            setRodadaFinalizada(true);
        }

        return;
    }

    const intervalo = setInterval(() => {
        setTempo((tempoAtual) => tempoAtual - 1);
    }, 1000);

    return () => clearInterval(intervalo);
}, [tempo, rodadaFinalizada, pontos, partidaIniciada]);

    function confirmarPronto() {
    if (jaEstouPronto) return;

    setJaEstouPronto(true);
    socket.emit("jogador-pronto");
}
    return (
        <main className="multiplayer">

    {oponenteDesconectou ? (
        <div className="multiplayer__desconexao">
            <Text>SEU OPONENTE DESCONECTOU!</Text>
            <p>A partida foi encerrada.</p>

            <button
                type="button"
                onClick={() => navigate("/escolha-modo")}
            >
                VOLTAR
            </button>
        </div>
    ) : !partidaIniciada ? (
        <div className="multiplayer__preparacao">
            <Text>PREPARE-SE PARA JOGAR!</Text>

            <p>O jogo terá 5 rodadas.</p>
            <p>Cada rodada terá 40 segundos.</p>
            <p>Descubra a imagem para ganhar pontos!</p>

            <p>Jogadores prontos: {jogadoresProntos}/2</p>

            <button
                type="button"
                onClick={confirmarPronto}
                disabled={jaEstouPronto}
            >
                {jaEstouPronto ? "AGUARDANDO JOGADOR..." : "PRONTO"}
            </button>
        </div>
    ) : (
        <>
            <header className="multiplayer__header">

                <button
                    className="multiplayer__back"
                    onClick={() => {socket.emit("finalizar-partida"); navigate("/escolha-modo");}}
                    aria-label="Voltar para a Home"
                >
                    <StepBack size={18} />
                </button>

                <Text>MULTIPLAYER</Text>

            </header>

            <div className="multiplayer__info">
                <div className="multiplayer__score">
                     <p>Seus pontos: {pontos}</p>
                     <p>Rodada {rodadaAtual} de 5</p>
                     <p>Pontuação total: {pontuacaoTotal}</p>
                </div>

                <div className="multiplayer__rounds">
                    {rounds.map((result, index) => (
                        <span
                            key={index}
                            className={`multiplayer__round multiplayer__round--${result}`}
                        />
                    ))}
                </div>

               <span className="multiplayer__timer">
                    00:{String(tempo).padStart(2, "0")}
               </span>

            </div>

            <div className="multiplayer__puzzle">
    {erro ? (
        <p>{erro}</p>
    ) : rodadaFinalizada ? (
        <div className="multiplayer__result">
    <Text>RODADA FINALIZADA!</Text>
    <p>Sua pontuação: {pontos}</p>

    {rodadaAtual < 5 ? (
    <>
        <button
            className="multiplayer__next"
            onClick={avancarRodada}
            disabled={aguardandoOponente}
        >
            Próxima rodada
        </button>

        {aguardandoOponente && (
            <p>
                Aguardando o outro jogador confirmar...
            </p>
        )}
    </>
) : (
        <>
    <Text>VOCÊ CONCLUIU AS 5 RODADAS!</Text>
<p>Pontuação final: {pontuacaoTotal}</p>

{partidaEncerrada ? (
    <Text>PARTIDA ENCERRADA! OS DOIS JOGADORES CONCLUÍRAM!</Text>
) : (
    <p>Aguardando o outro jogador terminar...</p>
)}

<button
    type="button"
    onClick={() => socket.emit("jogador-finalizou")}
>
    FINALIZAR PARTIDA
</button>
</>
    )}
</div>
    ) : imagemAtual ? (
        <Puzzle
            imagem={imagemAtual.caminho.split("/").pop() ?? ""}
            pastaImagem="imgmultiplayer"
            estadoEtapa="jogando"
            onPontosChange={atualizarPontos}
        />
    ) : (
        <p>Carregando quebra-cabeça...</p>
    )}
</div>
    </>
)}

        </main>
    );
}