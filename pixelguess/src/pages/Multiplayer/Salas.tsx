import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./Salas.css";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Text from "../../components/Text/Text";
import { socket } from "../../services/socket";

type DadosSala = {
  id: number;
  nome: string;
  status: "livre" | "aguardando" | "em_andamento";
  tipo: "privada" | "publica";
  jogadores: { id: string; nome: string }[];
};

export default function Salas() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [codigoSala, setCodigoSala] = useState("");
  const [salaAtual, setSalaAtual] = useState<DadosSala | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [aguardando, setAguardando] = useState(false);

  useEffect(() => {
    function receberErro(dados: { mensagem: string }) {
      setMensagem(dados.mensagem);
      setAguardando(false);
    }

    function receberAtualizacao(dados: {
      sala?: DadosSala;
      mensagem: string;
    }) {
      setMensagem(dados.mensagem);

      if (dados.sala) {
        setSalaAtual(dados.sala);
        setAguardando(dados.sala.status !== "em_andamento");
      }
    }

    function receberReserva(dados: {
      salaId: number;
      nomeSala: string;
      mensagem: string;
    }) {
      setCodigoSala(dados.nomeSala);
      setMensagem(dados.mensagem);
      setAguardando(true);
    }

    function iniciarPartida(dados: {
      salaId: number;
      nomeSala: string;
      jogadores: { id: string; nome: string }[];
    }) {
      setSalaAtual((atual) => ({
        id: dados.salaId,
        nome: dados.nomeSala,
        status: "em_andamento",
        tipo: atual?.tipo ?? "privada",
        jogadores: dados.jogadores,
      }));

      setAguardando(false);
      navigate("/multiplayer");
    }

    function encerrarPartida(dados: { mensagem: string }) {
      setSalaAtual(null);
      setAguardando(false);
      setMensagem(dados.mensagem);
    }

    function receberReservaExpirada(dados: { mensagem: string }) {
  setSalaAtual(null);
  setAguardando(false);
  setCodigoSala("");
  setMensagem(dados.mensagem);
    }

    socket.on("erro-sala", receberErro);
    socket.on("atualizacao-sala", receberAtualizacao);
    socket.on("sala-reservada", receberReserva);
    socket.on("partida-iniciada", iniciarPartida);
    socket.on("partida-encerrada", encerrarPartida);
    socket.on("reserva-expirada", receberReservaExpirada);

    socket.connect();

    return () => {
      socket.off("erro-sala", receberErro);
      socket.off("atualizacao-sala", receberAtualizacao);
      socket.off("sala-reservada", receberReserva);
      socket.off("partida-iniciada", iniciarPartida);
      socket.off("partida-encerrada", encerrarPartida);
      socket.off("reserva-expirada", receberReservaExpirada);
    };
  }, [navigate]);

  function validarNome() {
    if (!nome.trim()) {
      setMensagem("Digite seu apelido antes de continuar.");
      return false;
    }

    if (nome.trim().length > 20) {
      setMensagem("Seu apelido deve ter no máximo 20 caracteres.");
      return false;
    }

    setMensagem("");
    return true;
  }

  function jogarComAmigo() {
    if (!validarNome()) return;

    setAguardando(true);

    socket.emit("reservar-sala", {
      nome: nome.trim(),
    });
  }

  function entrarComCodigo() {
    if (!validarNome()) return;

    if (!codigoSala.trim()) {
      setMensagem("Digite o código da sala.");
      return;
    }

    setAguardando(true);

    socket.emit("entrar-sala", {
      nomeSala: codigoSala.trim().toUpperCase(),
      nome: nome.trim(),
    });
  }

  function partidaRapida() {
    if (!validarNome()) return;

    setAguardando(true);

    socket.emit("partida-rapida", {
      nome: nome.trim(),
    });
  }

  function sairDaSala() {
    socket.emit("sair-sala");

    setSalaAtual(null);
    setAguardando(false);
    setCodigoSala("");
    setMensagem("");
  }

  return (
    <main className="salas">
      <div className="salas__content">
        <Text>SALAS MULTIPLAYER</Text>

        <div className="salas__nome">
          <Text>Escolha seu apelido</Text>

          <Input
            type="text"
            placeholder="Seu apelido"
            value={nome}
            aoDigitar={(valor) => setNome(valor.slice(0, 20))}
          />

          <Text>{nome.length}/20 caracteres</Text>
        </div>

        {!aguardando && (
          <div className="salas__opcoes">
            <Button
              type="button"
              cor="purple"
              onClick={jogarComAmigo}
            >
              JOGAR COM AMIGO
            </Button>

            <div className="salas__codigo">
              <Text>Já tem um código?</Text>

              <Input
                type="text"
                placeholder="Ex.: SALA-01"
                value={codigoSala}
                aoDigitar={(valor) =>
                  setCodigoSala(valor.toUpperCase().slice(0, 7))
                }
              />

              <Button
                type="button"
                cor="purple"
                onClick={entrarComCodigo}
              >
                ENTRAR COM CÓDIGO
              </Button>
            </div>

            <Button
              type="button"
              cor="purple"
              onClick={partidaRapida}
            >
              PARTIDA RÁPIDA
            </Button>
          </div>
        )}

        {aguardando && (
          <div className="salas__espera">
            {codigoSala && (
              <>
                <Text>CÓDIGO DA SALA</Text>
                <Text>{codigoSala}</Text>
              </>
            )}

            <Text>
              {salaAtual?.jogadores.length === 2
                ? "Preparando partida..."
                : "Aguardando outro jogador..."}
            </Text>

            <Text>
              {salaAtual?.jogadores.length ?? 1}/2 jogadores
            </Text>

            <Button type="button" onClick={sairDaSala}>
              SAIR DA SALA
            </Button>
          </div>
        )}

        {mensagem && <Text>{mensagem}</Text>}
      </div>
    </main>
  );
}