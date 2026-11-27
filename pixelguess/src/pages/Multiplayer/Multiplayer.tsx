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

    const estaJogando =
        partidaIniciada &&
        !rodadaFinalizada &&
        !oponenteDesconectou &&
        !resultadoFinal;

    return (
        <>
            {!estaJogando ? (
                <div className="multiplayer__inicio">
                    {resultadoFinal ? (
                        <>
                            <div className="multiplayer__info">
                                <Subtitle>RESULTADO FINAL</Subtitle>
                                <Text>{tituloResultado}</Text>
                                <Text>VOCÊ: {resultadoFinal.meusPontos} pontos</Text>
                                <Text>OPONENTE: {resultadoFinal.pontosOponente} pontos</Text>
                            </div>

                            <div className="multiplayer__buttons">
                                <Button cor="purple" type="button" onClick={voltarAoMenu}>
                                    VOLTAR AO MENU
                                </Button>
                            </div>
                        </>
                    ) : oponenteDesconectou ? (
                        <>
                            <div className="multiplayer__info">
                                <Subtitle>SEU OPONENTE DESCONECTOU!</Subtitle>
                                <Text>A partida foi encerrada.</Text>
                            </div>

                            <div className="multiplayer__buttons">
                                <Button cor="purple" type="button" onClick={voltarAoMenu}>
                                    VOLTAR
                                </Button>
                            </div>
                        </>
                    ) : rodadaFinalizada ? (
                        <>
                            <div className="multiplayer__info">
                                <Subtitle>RODADA {rodadaAtual} FINALIZADA!</Subtitle>
                                <Text>Sua pontuação na rodada: {pontos}</Text>
                                <Text>Pontuação total: {pontuacaoTotal}</Text>

                                {rodadaAtual < 5 ? (
                                    aguardandoOponente && (
                                        <Text cor="aviso">
                                            Aguardando o outro jogador confirmar...
                                        </Text>
                                    )
                                ) : (
                                    <>
                                        <Text>VOCÊ CONCLUIU AS 5 RODADAS!</Text>
                                        <Text cor="aviso">
                                            {partidaEncerrada
                                                ? "PARTIDA ENCERRADA! OS DOIS JOGADORES CONCLUÍRAM!"
                                                : "Aguardando o outro jogador terminar..."}
                                        </Text>
                                    </>
                                )}
                            </div>

                            <div className="multiplayer__buttons">
                                {rodadaAtual < 5 ? (
                                    <Button
                                        cor="purple"
                                        type="button"
                                        onClick={avancarRodada}
                                        disabled={aguardandoOponente}
                                    >
                                        {aguardandoOponente ? "AGUARDANDO..." : "PRÓXIMA RODADA"}
                                    </Button>
                                ) : (
                                    <Button
                                        cor="purple"
                                        type="button"
                                        onClick={enviarPontuacaoFinal}
                                        disabled={enviouPontuacao}
                                    >
                                        {enviouPontuacao ? "AGUARDANDO OPONENTE..." : "FINALIZAR PARTIDA"}
                                    </Button>
                                )}

                                <Button type="button" onClick={finalizarPartidaAoSair}>
                                    SAIR
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="multiplayer__info">
                                <Subtitle>PREPARE-SE PARA JOGAR!</Subtitle>
                                <Text>O jogo terá 5 rodadas.</Text>
                                <Text>Cada rodada terá 40 segundos.</Text>
                                <Text>Descubra a imagem para ganhar pontos!</Text>
                                <Text>Jogadores prontos: {jogadoresProntos}/2</Text>
                                <Text cor="aviso">PS: CUIDADO COM O TEMPO</Text>
                            </div>

                            <div className="multiplayer__buttons">
                                <Button
                                    cor="purple"
                                    type="button"
                                    onClick={confirmarPronto}
                                    disabled={jaEstouPronto}
                                >
                                    {jaEstouPronto ? "AGUARDANDO JOGADOR..." : "PRONTO"}
                                </Button>
                                <Button type="button" onClick={voltarAoMenu}>
                                    VOLTAR
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <main className="multiplayer">
                    <div className="multiplayer__grid">
                        {erro ? (
                            <p>{erro}</p>
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

                    <section className="multiplayer__painel">
                        <Subtitle>RODADA {rodadaAtual} DE 5</Subtitle>
                        <p>Seus pontos: {pontos}</p>
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

                        <Button type="button" onClick={finalizarPartidaAoSair}>
                            SAIR
                        </Button>
                    </section>
                </main>
            )}

            {tipoResultado && (
                <PixelConfetti
                    active={true}
                    type={tipoResultado}
                />
            )}
        </>
    );
}