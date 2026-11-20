
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { StepBack } from "lucide-react";
import "./Multiplayer.css";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Text from "../../components/Text/Text";
import { socket } from "../../services/socket";

type Jogador = {
  id: string;
  nome: string;
};

type JogadorPartida = Jogador & {
  pontosRodada: number;
  pontuacaoTotal: number;
  quantidadePecasReveladas: number;
  acertou: boolean;
};

type EstadoPartida = {
  salaId: number;
  rodadaAtual: number;
  totalRodadas: number;
  imagemId: number;
  caminhoImagem: string;
  minhasPecasReveladas: number[];
  meusPontos: number;
  jogadores: JogadorPartida[];
  finalizada: boolean;
};

type ResultadoFinal = {
  vencedores: Jogador[];
  empate: boolean;
  pontuacaoTotal: Record<string, number>;
};

type ResultadoRodada = "win" | "loss" | "pending";

export default function Multiplayer() {
  const navigate = useNavigate();

  const [partida, setPartida] = useState<EstadoPartida | null>(null);
  const [mensagem, setMensagem] = useState("Carregando partida...");
  const [resposta, setResposta] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rodadaFinalizada, setRodadaFinalizada] = useState(false);
  const [jogadoresProntos, setJogadoresProntos] = useState(0);
  const [resultadosRodadas, setResultadosRodadas] = useState<
    ResultadoRodada[]
  >(["pending", "pending", "pending", "pending", "pending"]);
  const [resultadoFinal, setResultadoFinal] =
    useState<ResultadoFinal | null>(null);

  useEffect(() => {
    function receberEstado(dados: EstadoPartida) {
      setPartida(dados);
      setMensagem("");
    }

    function receberErro(dados: { mensagem: string }) {
      setMensagem(dados.mensagem);
    }

    function receberEncerramento(dados: { mensagem: string }) {
      setPartida(null);
      setMensagem(dados.mensagem);
    }

    function receberPeca(dados: {
      sucesso: boolean;
      mensagem: string;
    }) {
      if (!dados.sucesso) {
        setFeedback(dados.mensagem);
      }
    }

    function receberResposta(dados: {
      sucesso: boolean;
      acertou: boolean;
      mensagem: string;
    }) {
      setFeedback(dados.mensagem);
    }

    function receberRodadaFinalizada(dados: {
      numeroRodada: number;
      vencedor: string;
      mensagem: string;
    }) {
      setRodadaFinalizada(true);
      setFeedback(dados.mensagem);

      setResultadosRodadas((anteriores) => {
        const novos = [...anteriores];
        novos[dados.numeroRodada - 1] =
          dados.vencedor === socket.id ? "win" : "loss";
        return novos;
      });
    }

    function receberAguardando(dados: {
      quantidadeProntos: number;
      totalJogadores: number;
    }) {
      setJogadoresProntos(dados.quantidadeProntos);
    }

    function receberProximaRodada(dados: {
      rodadaAtual: number;
      mensagem: string;
    }) {
      setRodadaFinalizada(false);
      setJogadoresProntos(0);
      setResposta("");
      setFeedback(dados.mensagem);
    }

    function receberResultadoFinal(dados: ResultadoFinal) {
      setResultadoFinal(dados);
      setPartida(null);
    }

    socket.on("estado-partida", receberEstado);
    socket.on("erro-partida", receberErro);
    socket.on("partida-encerrada", receberEncerramento);
    socket.on("peca-revelada", receberPeca);
    socket.on("resultado-resposta", receberResposta);
    socket.on("rodada-finalizada", receberRodadaFinalizada);
    socket.on("aguardando-proxima-rodada", receberAguardando);
    socket.on("proxima-rodada-iniciada", receberProximaRodada);
    socket.on("partida-finalizada", receberResultadoFinal);

    socket.emit("consultar-partida");

    return () => {
      socket.off("estado-partida", receberEstado);
      socket.off("erro-partida", receberErro);
      socket.off("partida-encerrada", receberEncerramento);
      socket.off("peca-revelada", receberPeca);
      socket.off("resultado-resposta", receberResposta);
      socket.off("rodada-finalizada", receberRodadaFinalizada);
      socket.off("aguardando-proxima-rodada", receberAguardando);
      socket.off("proxima-rodada-iniciada", receberProximaRodada);
      socket.off("partida-finalizada", receberResultadoFinal);
    };
  }, []);

  function revelarPeca(pecaId: number) {
    socket.emit("revelar-peca", { pecaId });
    setFeedback("");
  }

  function enviarResposta() {
    if (!resposta.trim()) {
      setFeedback("Digite uma resposta antes de enviar.");
      return;
    }

    socket.emit("verificar-resposta", {
      resposta: resposta.trim(),
    });
  }

  function confirmarProximaRodada() {
    socket.emit("confirmar-proxima-rodada");
    setFeedback("Aguardando o outro jogador...");
  }

  function voltarParaSalas() {
    socket.emit("sair-sala");
    navigate("/salas");
  }

  const jogadorLocal = partida?.jogadores.find(
    (jogador) => jogador.id === socket.id
  );

  const imagemUrl = partida
    ? `http://localhost:3000/${partida.caminhoImagem.replace(/^\/+/, "")}`
    : "";

  return (
    <main className="multiplayer">
      <header className="multiplayer__header">
        <button
          className="multiplayer__back"
          onClick={voltarParaSalas}
          aria-label="Voltar para as salas"
        >
          <StepBack size={18} />
        </button>

        <Text>MULTIPLAYER</Text>
      </header>

      {resultadoFinal ? (
        <section className="multiplayer__result">
          <Text>PARTIDA FINALIZADA</Text>

          {resultadoFinal.empate ? (
            <Text>EMPATE!</Text>
          ) : (
            <Text>
              VENCEDOR: {resultadoFinal.vencedores[0]?.nome}
            </Text>
          )}

          {Object.entries(resultadoFinal.pontuacaoTotal).map(
            ([jogadorId, pontos]) => {
              const jogador = resultadoFinal.vencedores.find(
                (item) => item.id === jogadorId
              );

              return (
                <Text key={jogadorId}>
                  {jogador?.nome ?? "Jogador"}: {pontos} pontos
                </Text>
              );
            }
          )}

          <Button cor="green" onClick={() => navigate("/salas")}>
            VOLTAR ÀS SALAS
          </Button>
        </section>
      ) : partida ? (
        <>
          <div className="multiplayer__players">
            <Text>
              SALA {String(partida.salaId).padStart(2, "0")}
            </Text>

            {partida.jogadores.map((jogador) => (
              <div className="multiplayer__player" key={jogador.id}>
                <Text>{jogador.nome}</Text>
                <Text>{jogador.pontuacaoTotal} pontos</Text>
              </div>
            ))}
          </div>

          <div className="multiplayer__info">
            <div className="multiplayer__rounds">
              {resultadosRodadas.map((resultado, index) => (
                <span
                  key={index}
                  className={`multiplayer__round multiplayer__round--${resultado}`}
                />
              ))}
            </div>

            <Text>
              RODADA {partida.rodadaAtual}/{partida.totalRodadas}
            </Text>
          </div>

          <div className="multiplayer__score">
            <Text>SEUS PONTOS: {partida.meusPontos}</Text>
          </div>

          <div className="multiplayer__board">
            <img
              className="multiplayer__image"
              src={imagemUrl}
              alt="Imagem misteriosa da rodada"
            />

            <div className="multiplayer__tiles">
              {Array.from({ length: 16 }, (_, index) => {
                const revelada =
                  partida.minhasPecasReveladas.includes(index);

                return (
                  <button
                    key={index}
                    type="button"
                    className={`multiplayer__tile ${
                      revelada ? "multiplayer__tile--revealed" : ""
                    }`}
                    onClick={() => revelarPeca(index)}
                    disabled={
                      revelada ||
                      rodadaFinalizada ||
                      jogadorLocal?.acertou
                    }
                    aria-label={`Peça ${index + 1}`}
                  >
                    {!revelada && "?"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="multiplayer__answer">
            <Input
              type="text"
              placeholder="Qual é a imagem?"
              value={resposta}
              aoDigitar={setResposta}
              disabled={rodadaFinalizada || jogadorLocal?.acertou}
            />

            <Button
              type="button"
              cor="green"
              onClick={enviarResposta}
              disabled={rodadaFinalizada || jogadorLocal?.acertou}
            >
              ENVIAR
            </Button>
          </div>

          {feedback && (
            <div className="multiplayer__feedback">
              <Text>{feedback}</Text>
            </div>
          )}

          {rodadaFinalizada && (
            <div className="multiplayer__next">
              <Text>
                Jogadores prontos: {jogadoresProntos}/2
              </Text>

              <Button
                cor="green"
                onClick={confirmarProximaRodada}
              >
                PRÓXIMA RODADA
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="multiplayer__message">
          <Text>{mensagem}</Text>
        </div>
      )}
    </main>
  );
}
