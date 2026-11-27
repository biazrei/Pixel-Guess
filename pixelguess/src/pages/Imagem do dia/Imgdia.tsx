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
  lerProgressoImgDia,
  salvarProgressoImgDia,
  type ProgressoImgDia,
  type StatusImgDia,
} from "./service/ImgStorage";
import { PixelConfetti } from "../../components/PixelConfetti/PixelConfetti";
import { useMusicaFundo } from "../../components/MusicaFundo/MusicaFundo";

export default function ImagemDoDia() {
  const navigate = useNavigate();
  const setGameOverMusica = useMusicaFundo();

  const [imagemAtual, setImagemAtual] = useState<{ id: number; caminho: string } | null>(null);
  const [progressoSalvo, setProgressoSalvo] = useState<ProgressoImgDia | null>(null);
  const [pontos, setPontos] = useState<number>(1500);
  const [resposta, setResposta] = useState("");
  const [resultado, setResultado] = useState<"correta" | "errada" | "">("");
  const [ultimaTentativa, setUltimaTentativa] = useState(false);
  const [nomeResposta, setNomeResposta] = useState("");
  const [estadoJogo, setEstadoJogo] = useState<StatusImgDia>("jogando");
  const [cardsRevelados, setCardsRevelados] = useState<number[]>([]);

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
    let ativo = true;

    buscarImagemDoDia()
      .then((dados) => {
        if (!ativo || !dados?.id) return;
        const salvo = lerProgressoImgDia(dados.id);

        setImagemAtual(dados);
        setProgressoSalvo(salvo);

        if (salvo) {
          setPontos(salvo.pontos ?? 1500);
          setNomeResposta(salvo.nomeResposta ?? "");
          setUltimaTentativa(Boolean(salvo.ultimaTentativa));
          setCardsRevelados(Array.isArray(salvo.cardsRevelados) ? salvo.cardsRevelados : []);
          if (salvo.estadoJogo === "vitoria" || salvo.estadoJogo === "derrota") {
            setEstadoJogo(salvo.estadoJogo);
          }
        }
      })
      .catch((err) => console.error("Erro ao buscar imagem:", err));

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!imagemAtual?.id) return;

    salvarProgressoImgDia(imagemAtual.id, {
      estadoJogo,
      pontos,
      cardsRevelados,
      nomeResposta,
      ultimaTentativa,
    });
  }, [imagemAtual, estadoJogo, pontos, cardsRevelados, nomeResposta, ultimaTentativa]);

  const aoMudarCardsRevelados = useCallback((novosCards: number[]) => {
    setCardsRevelados(novosCards);
  }, []);

  const handleUltimoCardRevelado = useCallback(() => {
    setUltimaTentativa(true);
  }, []);

  async function envioResposta(evento: React.FormEvent) {
    evento.preventDefault();
    if (estadoJogo !== "jogando" || !imagemAtual) return;

    try {
      const dados = await verificarResposta(resposta);
      if (dados.acertou) {
        setResultado("correta");
        setEstadoJogo("vitoria");
        setNomeResposta(dados.nomeResposta || "");
      } else {
        setResultado("errada");
        setResposta("");

        if (ultimaTentativa) {
          setPontos((prev) => Math.max(prev - 100, 0));
          setEstadoJogo("derrota");
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

  const cardsIniciais = progressoSalvo?.cardsRevelados ?? [];
  const pontosIniciais = progressoSalvo?.pontos ?? 1500;

  return (
    <main className="imgdia">
      <div className="imgdia__grid">
        <JogoDia
          key={imagemAtual?.id ?? "carregando"}
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