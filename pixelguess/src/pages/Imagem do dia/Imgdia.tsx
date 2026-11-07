import "./Imgdia.css";
import { useNavigate } from "react-router";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Subtitle from "../../components/Subtitle/Subtitle";
import Text from "../../components/Text/Text";
import JogoDia from "./jogo/JogoDia";
import { useState, useEffect } from "react";
import { buscarImagemDoDia, verificarResposta } from "./service/ImgDiaService";

type EstadoJogo = "jogando" | "vitoria" | "derrota";

export default function ImagemDoDia() {
  const navigate = useNavigate();
  const [pontos, setPontos] = useState<number>(1500);
  const [resposta, setResposta] = useState("");
  const [resultado, setResultado] = useState<"correta" | "errada" | "">("");
  const [ultimaTentativa, setUltimaTentativa] = useState(false);
  const [nomeResposta, setNomeResposta] = useState("");
  const [estadoJogo, setEstadoJogo] = useState<EstadoJogo>("jogando");
  const [imagemAtual, setImagemAtual] = useState<{ id: number; caminho: string } | null>(null);

  useEffect(() => {
    buscarImagemDoDia()
      .then((dados) => {
        if (!dados?.id) return;
        setImagemAtual(dados);
        
        if (localStorage.getItem("pixel_guess_venceu_id") === String(dados.id)) {
          setEstadoJogo("vitoria");
          setNomeResposta(localStorage.getItem(`pixel_guess_nome_${dados.id}`) || "");
        }
      })
      .catch((err) => console.error("Erro ao buscar imagem:", err));
  }, []);

 async function envioResposta(evento: React.FormEvent) {
    evento.preventDefault();
    if (estadoJogo !== "jogando") return;

    try {
      const dados = await verificarResposta(resposta);

      if (dados.acertou) {
        setResultado("correta");
        setEstadoJogo("vitoria");
        setNomeResposta(dados.nomeResposta || "");
        localStorage.setItem("pixel_guess_venceu_id", String(dados.idImagem));
        localStorage.setItem(`pixel_guess_nome_${dados.idImagem}`, dados.nomeResposta);
      } else {
        setResultado("errada");
        setResposta("");

        if (ultimaTentativa) {
          setPontos((p) => Math.max(p - 100, 0));
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

 return (
    <main className="imgdia">
      <div className="imgdia__grid">
        <JogoDia
          imagem={imagemAtual}
          onPontosChange={setPontos}
          estadoJogo={estadoJogo}
          onUltimoCardRevelado={() => setUltimaTentativa(true)}
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
            />
            <Button type="submit" cor="green">ENVIAR</Button>
          </>
        )}

        <Button type="button" onClick={() => navigate("/")}>SAIR</Button>
      </form>
    </main>
  );
}