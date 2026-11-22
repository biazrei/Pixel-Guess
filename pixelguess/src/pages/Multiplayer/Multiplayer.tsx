import "./Multiplayer.css";
import { useNavigate } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { StepBack } from "lucide-react";
import Text from "../../components/Text/Text";
import Button from "../../components/Button/Button";
import Title from "../../components/Title/Title";
import Subtitle from "../../components/Subtitle/Subtitle";
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
    const [resultadoFinal, setResultadoFinal] = useState<{
    meusPontos: number;
    pontosOponente: number;
} | null>(null);

    const [enviouPontuacao, setEnviouPontuacao] = useState(false);
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

    function receberResultadoFinal(dados: {
    meusPontos: number;
    pontosOponente: number;
}) {
    setResultadoFinal(dados);
}

    socket.on("atualizar-prontos", atualizarProntos);
    socket.on("partida-iniciada", iniciarPartida);
    socket.on("proxima-rodada", receberProximaRodada);
    socket.on("jogador-desconectou", jogadorDesconectou);
    socket.on("partida-encerrada", encerrarPartida);
    socket.on("resultado-final", receberResultadoFinal);

    return () => {
    socket.off("atualizar-prontos", atualizarProntos);
    socket.off("partida-iniciada", iniciarPartida);
    socket.off("proxima-rodada", receberProximaRodada);
    socket.off("jogador-desconectou", jogadorDesconectou);
    socket.off("partida-encerrada", encerrarPartida);
    socket.off("resultado-final", receberResultadoFinal);
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
    
const tituloResultado = resultadoFinal
    ? resultadoFinal.meusPontos > resultadoFinal.pontosOponente
        ? "VITÓRIA!"
        : resultadoFinal.meusPontos < resultadoFinal.pontosOponente
            ? "DERROTA!"
            : "EMPATE!"
    : "";

        return (
        <main className="multiplayer">

            {resultadoFinal ? (
    <div className="multiplayer__final">
        <div className="multiplayer__final-info">
            <Subtitle>RESULTADO FINAL</Subtitle>

            <Text>{tituloResultado}</Text>

            <div className="multiplayer__final-scores">
                <div className="multiplayer__final-score">
                    <strong>VOCÊ</strong>
                    <span>{resultadoFinal.meusPontos} pontos</span>
                </div>

                <div className="multiplayer__final-score">
                    <strong>OPONENTE</strong>
                    <span>{resultadoFinal.pontosOponente} pontos</span>
                </div>
            </div>
        </div>

        <div className="multiplayer__final-buttons">
            <Button
                   cor="purple"
                   type="button"
                   onClick={() => navigate("/escolha-modo")}
             >
                    VOLTAR AO MENU
            </Button>
        </div>
    </div>
) : oponenteDesconectou ? (
        <div className="multiplayer__desconexao">
            <Subtitle>SEU OPONENTE DESCONECTOU!</Subtitle>
            <p>A partida foi encerrada.</p>

            <Button
                   cor="purple"
                   type="button"
                   onClick={() => navigate("/escolha-modo")}
     >
                    VOLTAR
            </Button>

        </div>
    ) : !partidaIniciada ? (
        <div className="multiplayer__preparacao">
            
            <Subtitle>PREPARE-SE PARA JOGAR!</Subtitle>

            <p>O jogo terá 5 rodadas.</p>
            <p>Cada rodada terá 40 segundos.</p>
            <p>Descubra a imagem para ganhar pontos!</p>

            <p>Jogadores prontos: {jogadoresProntos}/2</p>

            <Button
                   cor="purple"
                   type="button"
                   onClick={confirmarPronto}
                   disabled={jaEstouPronto}
        >
                {jaEstouPronto ? "AGUARDANDO JOGADOR..." : "PRONTO"}
            </Button>

        </div>
    ) : (
        <>
            <header className="multiplayer__header">
    <button
        className="multiplayer__back"
        onClick={() => {
            socket.emit("finalizar-partida");
            navigate("/escolha-modo");
        }}
        aria-label="Voltar para a Home"
    >
        <StepBack size={18} />
    </button>

    <Title>MULTIPLAYER</Title>

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
    <Subtitle>RODADA FINALIZADA!</Subtitle>
    <p>Sua pontuação: {pontos}</p>

    {rodadaAtual < 5 ? (
    <>
        <Button
               cor="purple"
               onClick={avancarRodada}
               disabled={aguardandoOponente}
  >
               Próxima rodada
        </Button>

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

<Button
    cor="purple"
    type="button"
    onClick={() => {
        setEnviouPontuacao(true);
        socket.emit("jogador-finalizou", pontuacaoTotal);
    }}
    disabled={enviouPontuacao}
>
    {enviouPontuacao ? "AGUARDANDO OPONENTE..." : "FINALIZAR PARTIDA"}
</Button>

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