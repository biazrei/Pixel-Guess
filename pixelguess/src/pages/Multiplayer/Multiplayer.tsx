import "./Multiplayer.css";
import Subtitle from "../../components/Subtitle/Subtitle";
import Text from "../../components/Text/Text";
import Button from "../../components/Button/Button";
import Puzzle from "../../components/Puzzle/Puzzle";
import Timer from "../../components/Timer/Timer";
import { PixelConfetti } from "../../components/PixelConfetti/PixelConfetti";
import { useMultiplayerPartida } from "./useMultiplayerPartida";

export default function Multiplayer() {
    const {
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
    } = useMultiplayerPartida();

    return (
        <>
            <main className="multiplayer">
                <div className="multiplayer__grid">
                    {resultadoFinal ? (
                        <>
                            <Subtitle>{tituloResultado}</Subtitle>
                            <div className="multiplayer__final-scores">
                                <div className="multiplayer__final-score">
                                    <strong>VOCÊ</strong>
                                    <span>{resultadoFinal.meusPontos} pts</span>
                                </div>
                                <div className="multiplayer__final-score">
                                    <strong>OPONENTE</strong>
                                    <span>{resultadoFinal.pontosOponente} pts</span>
                                </div>
                            </div>
                        </>
                    ) : oponenteDesconectou ? (
                        <>
                            <Subtitle>OPONENTE DESCONECTOU</Subtitle>
                            <p>A partida foi encerrada.</p>
                        </>
                    ) : !partidaIniciada ? (
                        <>
                            <Subtitle>PREPARE-SE</Subtitle>
                            <p>5 rodadas • 40s por rodada</p>
                            <p>Descubra a imagem para ganhar pontos!</p>
                        </>
                    ) : erro ? (
                        <p>{erro}</p>
                    ) : imagemAtual && !rodadaFinalizada ? (
                        <Puzzle
                            imagem={imagemAtual.caminho.split("/").pop() ?? ""}
                            pastaImagem="imgmultiplayer"
                            estadoEtapa="jogando"
                            onPontosChange={atualizarPontos}
                        />
                    ) : (
                        <Subtitle>
                            {rodadaFinalizada ? `RODADA ${rodadaAtual} CONCLUÍDA` : "CARREGANDO..."}
                        </Subtitle>
                    )}
                </div>

                <section className="multiplayer__painel">
                    <Subtitle>MULTIPLAYER</Subtitle>

                    {resultadoFinal ? (
                        <>
                            <Text>RESULTADO FINAL</Text>
                            <Button cor="purple" type="button" onClick={voltarAoMenu}>
                                VOLTAR AO MENU
                            </Button>
                        </>
                    ) : oponenteDesconectou ? (
                        <Button cor="purple" type="button" onClick={voltarAoMenu}>
                            VOLTAR
                        </Button>
                    ) : !partidaIniciada ? (
                        <>
                            <Subtitle>PRONTOS: {jogadoresProntos}/2</Subtitle>
                            <Button
                                cor="purple"
                                type="button"
                                onClick={confirmarPronto}
                                disabled={jaEstouPronto}
                            >
                                {jaEstouPronto ? "AGUARDANDO JOGADOR..." : "PRONTO"}
                            </Button>
                            <Button type="button" onClick={voltarAoMenu}>
                                SAIR
                            </Button>
                        </>
                    ) : (
                        <>
                            <Subtitle>RODADA {rodadaAtual}/5</Subtitle>
                            <p>Pontos da rodada: {pontos}</p>
                            <p>Pontuação total: {pontuacaoTotal}</p>
                            <Timer tempo={tempo} />

                            <div className="multiplayer__rounds">
                                {rounds.map((result, index) => (
                                    <span
                                        key={index}
                                        className={`multiplayer__round multiplayer__round--${result}`}
                                    />
                                ))}
                            </div>

                            {rodadaFinalizada && (
                                rodadaAtual < 5 ? (
                                    <>
                                        <Button
                                            cor="purple"
                                            type="button"
                                            onClick={avancarRodada}
                                            disabled={aguardandoOponente}
                                        >
                                            PRÓXIMA RODADA
                                        </Button>
                                        {aguardandoOponente && (
                                            <p>Aguardando o outro jogador confirmar...</p>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Text>5 RODADAS CONCLUÍDAS!</Text>
                                        <p>
                                            {partidaEncerrada
                                                ? "OS DOIS JOGADORES CONCLUÍRAM!"
                                                : "Aguardando o outro jogador terminar..."}
                                        </p>
                                        <Button
                                            cor="purple"
                                            type="button"
                                            onClick={enviarPontuacaoFinal}
                                            disabled={enviouPontuacao}
                                        >
                                            {enviouPontuacao
                                                ? "AGUARDANDO OPONENTE..."
                                                : "FINALIZAR PARTIDA"}
                                        </Button>
                                    </>
                                )
                            )}

                            <Button type="button" onClick={finalizarPartidaAoSair}>
                                SAIR
                            </Button>
                        </>
                    )}
                </section>
            </main>

            {tipoResultado && (
                <PixelConfetti
                    active={true}
                    type={tipoResultado}
                />
            )}
        </>
    );
}