import "./Imgdia.css";
import { useNavigate } from "react-router";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Subtitle from "../../components/Subtitle/Subtitle";
import Text from "../../components/Text/Text";
import JogoDia from "./jogo/JogoDia";
import { useState, useEffect, useCallback } from "react";
import { buscarImagemDoDia, verificarResposta } from "./service/ImgDiaService";
import {
  lerCardsImgDia,
  lerNomeImgDia,
  lerPontosImgDia,
  lerStatusImgDia,
  salvarCardsImgDia,
  salvarNomeImgDia,
  salvarPontosImgDia,
  salvarStatusImgDia,
  type StatusImgDia,
} from "./service/ImgStorage";
import { PixelConfetti } from "../../components/PixelConfetti/PixelConfetti";
import { useMusicaFundo } from "../../components/MusicaFundo/MusicaFundo";

export default function ImagemDoDia() {
  const navigate = useNavigate();
  const setGameOverMusica = useMusicaFundo();
  const [pontos, setPontos] = useState<number>(1500);
  const [pontosIniciais, setPontosIniciais] = useState<number>(1500);
  const [resposta, setResposta] = useState("");
  const [resultado, setResultado] = useState<"correta" | "errada" | "">("");
  const [ultimaTentativa, setUltimaTentativa] = useState(false);
  const [nomeResposta, setNomeResposta] = useState("");
  const [estadoJogo, setEstadoJogo] = useState<StatusImgDia>("jogando");
  const [imagemAtual, setImagemAtual] = useState<{ id: number; caminho: string } | null>(null);
  const [cardsIniciais, setCardsIniciais] = useState<number[]>([]);
  const [carregouDados, setCarregouDados] = useState(false);

  useEffect(() => {
    if (estadoJogo === "vitoria" || estadoJogo === "derrota") {
      setGameOverMusica(estadoJogo);
    } else {
      setGameOverMusica(null);
    }
    return () => {
      setGameOverMusica(null);
    };
  }, [estadoJogo, setGameOverMusica]);

  useEffect(() => {
    buscarImagemDoDia()
      .then((dados) => {
        if (!dados?.id) return;
        setImagemAtual(dados);

        const statusSalvo = lerStatusImgDia(dados.id);
        const pontosSalvos = lerPontosImgDia(dados.id);
        const nomeSalvo = lerNomeImgDia(dados.id);
        const cardsSalvos = lerCardsImgDia(dados.id);

        if (pontosSalvos !== null) {
          setPontos(pontosSalvos);
          setPontosIniciais(pontosSalvos);
        }

        if (nomeSalvo) {
          setNomeResposta(nomeSalvo);
        }

        setCardsIniciais(cardsSalvos);

        if (statusSalvo === "vitoria" || statusSalvo === "derrota") {
          setEstadoJogo(statusSalvo);
        }

        setCarregouDados(true);
      })
      .catch((err) => console.error("Erro ao buscar imagem:", err));
  }, []);

  useEffect(() => {
    if (!imagemAtual?.id || !carregouDados) return;
    salvarPontosImgDia(imagemAtual.id, pontos);
  }, [pontos, imagemAtual, carregouDados]);

  const aoMudarCardsRevelados = useCallback(
    (novosCards: number[]) => {
      if (imagemAtual?.id) {
        salvarCardsImgDia(imagemAtual.id, novosCards);
      }
    },
    [imagemAtual]
  );

  const handleUltimoCardRevelado = useCallback(() => {
  setUltimaTentativa(true);
}, []);

  async function envioResposta(evento: React.FormEvent) {
    evento.preventDefault();
    if (estadoJogo !== "jogando" || !imagemAtual) return;

    try {
      const dados = await verificarResposta(resposta);
      if (dados.acertou) {
        const nomeFinal = dados.nomeResposta || "";
        setResultado("correta");
        setEstadoJogo("vitoria");
        setNomeResposta(nomeFinal);

        salvarStatusImgDia(imagemAtual.id, "vitoria");
        salvarNomeImgDia(imagemAtual.id, nomeFinal);
      } else {
        setResultado("errada");
        setResposta("");

        if (ultimaTentativa) {
          const novosPontos = Math.max(pontos - 100, 0);
          setPontos(novosPontos);
          setEstadoJogo("derrota");

          salvarStatusImgDia(imagemAtual.id, "derrota");
          salvarPontosImgDia(imagemAtual.id, novosPontos);
        } else {
          setTimeout(() => setResultado(""), 1000);
        }
      }
    } catch (erro) {
      console.error("Erro no envio:", erro);
    }
  }

  function mensagemStatus() {
    if (ultimaTentativa && estadoJogo === "jogando") return <Text cor="aviso">1 TENTATIVA RESTANTE</Text>;
    if (estadoJogo === "vitoria") return <Text cor="parabens">PARABÉNS, VOCÊ ACERTOU! É: {nomeResposta.toUpperCase()}</Text>;
    if (estadoJogo === "derrota") return <Text cor="aviso">NÃO FOI DESSA VEZ!</Text>;
    return null;
  }

  return (
    <main className="imgdia">
      <div className="imgdia__grid">
        <JogoDia
          key={`${imagemAtual?.id ?? "sem-id"}-${carregouDados ? "pronto" : "carregando"}`}
          imagem={imagemAtual}
          onPontosChange={setPontos}
          estadoJogo={estadoJogo}
          onUltimoCardRevelado={handleUltimoCardRevelado}
          cardsIniciais={cardsIniciais}
          pontosIniciais={pontosIniciais}
          onCardsReveladosChange={aoMudarCardsRevelados}
        />
      </div>

      <form className="imgdia__form" onSubmit={envioResposta}>
        <Subtitle>IMAGEM DO DIA</Subtitle>
        <Subtitle>PONTOS: {pontos}</Subtitle>

        {mensagemStatus()}

        {estadoJogo === "jogando" && (
          <>
            <Input
              type="text"
              placeholder="Digite sua resposta"
              value={resposta}
              aoDigitar={setResposta}
              estado={resultado}
              disabled={false}
              cor="pink"
            />
            <Button type="submit" cor="green">ENVIAR</Button>
          </>
        )}

        <Button type="button" onClick={() => navigate("/")}>SAIR</Button>
      </form>

      {(estadoJogo === "vitoria" || estadoJogo === "derrota") && (
        <PixelConfetti
          active={true}
          type={estadoJogo}
        />
      )}
    </main>
  );
}