import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import socket from "../../services/socket";
import { useMusicaFundo } from "../../components/MusicaFundo/MusicaFundo";
import type { ImagemMultiplayer } from "./Service/MultiplayerService";

export type RoundResult = "completed" | "active" | "pending";

export interface ResultadoFinal {
    meusPontos: number;
    pontosOponente: number;
}

export function useMultiplayerPartida() {
    const navigate = useNavigate();
    const setResultadoMusica = useMusicaFundo();

    const [partidaIniciada, setPartidaIniciada] = useState(false);
    const [jogadoresProntos, setJogadoresProntos] = useState(0);
    const [jaEstouPronto, setJaEstouPronto] = useState(false);
    const [oponenteDesconectou, setOponenteDesconectou] = useState(false);
    const [tempo, setTempo] = useState(40);
    const [imagemAtual, setImagemAtual] = useState<ImagemMultiplayer | null>(null);
    const [pontos, setPontos] = useState(0);
    const [rodadaFinalizada, setRodadaFinalizada] = useState(false);
    const [rodadaAtual, setRodadaAtual] = useState(1);
    const [pontuacoesRodadas, setPontuacoesRodadas] = useState<number[]>([]);
    const [partidaEncerrada, setPartidaEncerrada] = useState(false);
    const [aguardandoOponente, setAguardandoOponente] = useState(false);
    const [resultadoFinal, setResultadoFinal] = useState<ResultadoFinal | null>(null);
    const [enviouPontuacao, setEnviouPontuacao] = useState(false);

    const erro = "";

    const atualizarPontos = useCallback((novosPontos: number) => {
        setPontos(novosPontos);
    }, []);

    const rounds: RoundResult[] = Array.from({ length: 5 }, (_, index) => {
        if (index < pontuacoesRodadas.length) return "completed";
        if (index === rodadaAtual - 1) return "active";
        return "pending";
    });

    const pontuacaoTotal = pontuacoesRodadas.reduce(
        (total, pontosRodada) => total + pontosRodada,
        0
    );

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

        function receberResultadoFinal(dados: ResultadoFinal) {
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
                setPontuacoesRodadas((anteriores) => [...anteriores, pontos]);
                setRodadaFinalizada(true);
            }
            return;
        }

        const intervalo = setInterval(() => {
            setTempo((tempoAtual) => tempoAtual - 1);
        }, 1000);

        return () => clearInterval(intervalo);
    }, [tempo, rodadaFinalizada, pontos, partidaIniciada]);

    const tituloResultado = resultadoFinal
        ? resultadoFinal.meusPontos > resultadoFinal.pontosOponente
            ? "VITÓRIA!"
            : resultadoFinal.meusPontos < resultadoFinal.pontosOponente
                ? "DERROTA!"
                : "EMPATE!"
        : "";

    const tipoResultado: "vitoria" | "derrota" | null = resultadoFinal
        ? resultadoFinal.meusPontos > resultadoFinal.pontosOponente
            ? "vitoria"
            : resultadoFinal.meusPontos < resultadoFinal.pontosOponente
                ? "derrota"
                : null
        : null;

    useEffect(() => {
        if (tipoResultado) {
            setResultadoMusica(tipoResultado);
        }

        return () => {
            setResultadoMusica(null);
        };
    }, [tipoResultado, setResultadoMusica]);

    function confirmarPronto() {
        if (jaEstouPronto) return;
        setJaEstouPronto(true);
        socket.emit("jogador-pronto");
    }

    function avancarRodada() {
        if (rodadaAtual >= 5) return;
        setAguardandoOponente(true);
        socket.emit("jogador-proxima-rodada");
    }

    function finalizarPartidaAoSair() {
        socket.emit("finalizar-partida");
        navigate("/escolha-modo");
    }

    function enviarPontuacaoFinal() {
        setEnviouPontuacao(true);
        socket.emit("jogador-finalizou", pontuacaoTotal);
    }

    function voltarAoMenu() {
        navigate("/escolha-modo");
    }

    return {
        partidaIniciada,
        jogadoresProntos,
        jaEstouPronto,
        oponenteDesconectou,
        tempo,
        imagemAtual,
        erro,
        pontos,
        rodadaFinalizada,
        rodadaAtual,
        partidaEncerrada,
        aguardandoOponente,
        resultadoFinal,
        enviouPontuacao,
        rounds,
        pontuacaoTotal,
        tituloResultado,
        tipoResultado,
        atualizarPontos,
        confirmarPronto,
        avancarRodada,
        finalizarPartidaAoSair,
        enviarPontuacaoFinal,
        voltarAoMenu,
    };
}