import "./Multiplayer.css";
import { useNavigate } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { StepBack } from "lucide-react";
import Text from "../../components/Text/Text";
import Puzzle from "../../components/Puzzle/Puzzle";
import {buscarImagensMultiplayer, type ImagemMultiplayer} from "./Service/MultiplayerService";

type RoundResult = "completed" | "active" | "pending";

export default function Multiplayer() {
    const navigate = useNavigate();
    const [tempo, setTempo] = useState(40);
    const [imagemAtual, setImagemAtual] = useState<ImagemMultiplayer | null>(null);
    const [erro, setErro] = useState("");
    const [pontos, setPontos] = useState(0);
    const [rodadaFinalizada, setRodadaFinalizada] = useState(false);
    const [imagensDisponiveis, setImagensDisponiveis] = useState<ImagemMultiplayer[]>([]);
    const [rodadaAtual, setRodadaAtual] = useState(1);
    const [pontuacoesRodadas, setPontuacoesRodadas] = useState<number[]>([]);
    const atualizarPontos = useCallback((novosPontos: number) => {
    setPontos(novosPontos);
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

    const proximaImagem = imagensDisponiveis[rodadaAtual];

    if (!proximaImagem) {
        setErro("Não há imagens disponíveis para a próxima rodada.");
        return;
    }

    setRodadaAtual((atual) => atual + 1);
    setImagemAtual(proximaImagem);
    setPontos(0);
    setTempo(40);
    setRodadaFinalizada(false);
}

    useEffect(() => {
        let ativo = true;

        async function carregarImagem() {
    try {
        const imagens = await buscarImagensMultiplayer();

        if (imagens.length === 0) {
            throw new Error("Nenhuma imagem encontrada.");
        }

        if (ativo) {
            const imagensEmbaralhadas = [...imagens].sort(
                () => Math.random() - 0.5
            );

            setImagensDisponiveis(imagensEmbaralhadas);
            setImagemAtual(imagensEmbaralhadas[0]);
        }
    } catch {
        if (ativo) {
            setErro("Não foi possível carregar as imagens.");
        }
    }
}

        carregarImagem();

        return () => {
            ativo = false;
        };
    }, []);

    useEffect(() => {
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
}, [tempo, rodadaFinalizada, pontos]);

    return (
        <main className="multiplayer">
            <header className="multiplayer__header">

                <button
                    className="multiplayer__back"
                    onClick={() => navigate(-1)}
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
        <button
            className="multiplayer__next"
            onClick={avancarRodada}
        >
            Próxima rodada
        </button>
    ) : (
        <>
    <Text>VOCÊ CONCLUIU AS 5 RODADAS!</Text>
    <p>Pontuação final: {pontuacaoTotal}</p>
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

        </main>
    );
}