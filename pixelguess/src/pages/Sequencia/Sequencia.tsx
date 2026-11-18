import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import Text from "../../components/Text/Text"
import "./Sequencia.css"
import { useNavigate } from "react-router"
import { buscarImagensSeq } from "./Service/SeqService"
import { useState, useEffect, useRef } from "react"
import JogoSequencia, { type JogoSeqRef } from "./Jogo/JogoSeq"
import Subtitle from "../../components/Subtitle/Subtitle"

export default function Sequencia() {
    const navigate = useNavigate();

    const [imagensSeq, setImagensSeq] = useState({
        imagem_1: "",
        resposta_1: "",
        imagem_2: "",
        resposta_2: "",
        imagem_3: "",
        resposta_3: ""
    });

    const [palpite, setPalpite] = useState("");
    const [estadoInput, setEstadoInput] = useState<"correta" | "errada" | "">("");
    const [etapa, setEtapa] = useState(1);
    const [estadoEtapa, setEstadoEtapa] = useState<"jogando" | "encerrada">("jogando");
    const [estadoSequencia, setEstadoSequencia] = useState<"jogando" | "finalizado">("jogando");
    const jogoSeqRef = useRef<JogoSeqRef>(null);
    const [pontosTotal, setPontosTotal] = useState(0);
    const temposPorEtapa = { 1: 60, 2: 45, 3: 30 };
    const [tempoRestante, setTempoRestante] = useState<number>(temposPorEtapa[etapa as keyof typeof temposPorEtapa]);

    let respostaCorreta = "";
    if (etapa === 1) respostaCorreta = imagensSeq.resposta_1;
    if (etapa === 2) respostaCorreta = imagensSeq.resposta_2;
    if (etapa === 3) respostaCorreta = imagensSeq.resposta_3;

    useEffect(() => {
        async function carregarDados() {
            try {
                const dados = await buscarImagensSeq();
                setImagensSeq(dados);
            } catch (erro) {
                console.error("Erro ao carregar sequência:", erro);
            }
        }
        carregarDados();
    }, []);


    useEffect(() => {
    if (estadoEtapa !== "jogando" || tempoRestante <= 0) return;

    const timer = setInterval(() => {
        setTempoRestante((prev) => {
            if (prev <= 1) {
                clearInterval(timer);
                encerrarEtapaPorTempo();
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
}, [estadoEtapa, tempoRestante, etapa]);



     function encerrarEtapaPorTempo() {
   
    const pontosPuzzle = jogoSeqRef.current?.calcularPontos() || 0;
    setPontosTotal((prev) => prev + pontosPuzzle);
    
    
    setEstadoEtapa("encerrada");
    setEstadoInput("errada"); 
}
    function enviarResposta(e: React.FormEvent) {
        e.preventDefault();

        if (!palpite.trim()) return;
        if (jogoSeqRef.current) {
            const pontosDoPuzzle = jogoSeqRef.current.calcularPontosPuzzle();
            setPontosTotal((atual) => atual + pontosDoPuzzle);
        }

        const palpiteFormatado = palpite.trim().toLowerCase();
        const respostaFormatada = respostaCorreta.trim().toLowerCase();

        if (palpiteFormatado === respostaFormatada) {
            setEstadoInput("correta");
            setPontosTotal((atual) => atual + 100);
        } else {
            setEstadoInput("errada");  
        }
        
        setEstadoEtapa("encerrada");
    }

    function proximaEtapa() {
        if (etapa < 3) {
            setEtapa(etapa + 1);
            setPalpite("");     
            setEstadoInput("");     
            setEstadoEtapa("jogando");
        } else {
            setEstadoSequencia("finalizado");
        }
    }

   

    return (
        <main className="sequencia">
            {estadoSequencia === "jogando" && (
                <>

                    <div className="seq__grid">
                        <JogoSequencia
                           key={etapa}
                            ref={jogoSeqRef}
                            imagem_1={imagensSeq.imagem_1}
                            imagem_2={imagensSeq.imagem_2}
                            imagem_3={imagensSeq.imagem_3}
                            etapa={etapa}
                            estadoEtapa={estadoEtapa}
                        />
                    </div>

                    <form className="seq__form" onSubmit={enviarResposta}>
                        <Subtitle>PONTOS {pontosTotal}</Subtitle>
                        {estadoEtapa === "jogando" && (<Text>PEÇA CORRETA +50 - PALAVRA CERTA +100</Text>)}
                        {estadoInput === "correta" && (<Text cor="parabens">PARABÉNS, VOCÊ ACERTOU!</Text>)}
                        {estadoInput === "errada" && (<Text cor="aviso">QUE PENA! A RESPOSTA ERA {respostaCorreta.toLocaleUpperCase()}</Text>)}
                        
                        
                        
                        <Input
                            type="text"
                            placeholder="Digite sua resposta"
                            value={palpite}
                            aoDigitar={(valor) => setPalpite(valor)}
                            estado={estadoInput}
                            disabled={estadoEtapa === "encerrada"}
                        />

                        {estadoEtapa === "jogando" && (
                            <Button type="submit" cor="green">ENVIAR RESPOSTA</Button>
                        )}

                        {estadoEtapa === "encerrada" && etapa < 3 && (
                            <Button type="button" cor="pink" onClick={proximaEtapa}>
                                PRÓXIMA ETAPA
                            </Button>
                        )}
                       

                        <Button type="button" onClick={() => navigate("/")}>SAIR</Button>
                    </form>
                </>
            )}

           
        </main>
    );
}