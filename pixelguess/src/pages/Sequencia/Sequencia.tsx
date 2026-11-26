import Button from "../../components/Button/Button"
import "./Sequencia.css"
import { useNavigate } from "react-router"
import { buscarImagensSeq } from "./Service/SeqService"
import { useState, useEffect, useRef } from "react"
import JogoSequencia, { type JogoSeqRef } from "./Jogo/JogoSeq"
import Subtitle from "../../components/Subtitle/Subtitle"
import Text from "../../components/Text/Text"
import Timer from "../../components/Timer/Timer"

export default function Sequencia() {
    const navigate = useNavigate();
    const [imagensSeq, setImagensSeq] = useState({
        imagem_1: "",
        imagem_2: "",
        imagem_3: "",
        
    });
    
    const [etapa, setEtapa] = useState(1);
    const [estadoEtapa, setEstadoEtapa] = useState< "jogando" | "encerrada">("jogando");
    const [estadoSequencia, setEstadoSequencia] = useState<"inicio"|"jogando" | "encerrada">("inicio");
    const jogoSeqRef = useRef<JogoSeqRef>(null);
    const [pontosTotal, setPontosTotal] = useState(0);
    const [placarEtapa, setPlacarEtapa] =useState(0);
    const [pontosEtapa, setPontosEtapa] = useState([0, 0, 0]);
    const [tempo, setTempo]= useState(40);

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

    useEffect (()=>{
        if (estadoEtapa !== "jogando" || estadoSequencia !=="jogando"){
            return;
        }
        const intervalo = setInterval(() => {
    setTempo((tempoAtual) => {
        if (tempoAtual <= 1) {
            return 0;
        }   return tempoAtual - 1;});
    }, 1000);

        return ()=> clearInterval(intervalo)
}, [estadoEtapa, estadoSequencia]);

useEffect(()=> {
    if (tempo === 0 && estadoEtapa ==="jogando") {
        verificarJogo();
    }
},);
//[tempo] colocar dependencia depois

    function proximaEtapa() {
        if (etapa < 3) {
            setEtapa(etapa + 1);     
            setEstadoEtapa("jogando");
            setPlacarEtapa(0);
            setTempo(40);
        } else {
            setEstadoSequencia("encerrada");
        }
    }

    function verificarJogo(){
       const pontosPuzzle = jogoSeqRef.current?.calcularPontos() || 0;
       const pontuacao= [...pontosEtapa];
       pontuacao[etapa-1]= pontosPuzzle;
       setPontosEtapa(pontuacao)
    setPlacarEtapa(pontosPuzzle)
    setPontosTotal((prev) => prev + pontosPuzzle); 
    setEstadoEtapa("encerrada");
   
    }

    return (
        <div>
            {estadoSequencia === "inicio" &&(
           <div className="seq__inicio"> 
                        
                        <div className="inicio__info">
                            <Subtitle>PREPARE-SE PARA O DESAFIO</Subtitle>
                            <Text> Resolva os 3 quebra-cabeças e acumule pontos</Text>
                            <Text> Quando a peça estiver na posição correta, o desfoque será removido</Text>
                            <Text>Boa sorte! </Text>
                            <Text cor="aviso">PS: CUIDADO COM O TEMPO</Text>
                        </div>

                        <div className="inicio__buttons">
                          <Button type="button" cor="green" onClick={() => setEstadoSequencia("jogando")}>INICIAR</Button>
                        <Button type="button" onClick={() => navigate("/")}>VOLTAR</Button>
                        </div>  

                    </div>)}

            {estadoSequencia=== "jogando" && (
                <main className="sequencia">
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

                    <div className="seq__info">
                        <Subtitle> PONTOS {placarEtapa}</Subtitle>
                        <Subtitle>
                           <Timer tempo={tempo}/>
                        </Subtitle>
                        
                        <Text cor="parabens">ETAPA {etapa}</Text>
                    
                        {estadoEtapa === "jogando" && (
                            <Button type="button" cor="green"
                            onClick={verificarJogo}>VERIFICAR JOGO</Button>
                        )}
                        {estadoEtapa === "encerrada" && (
                            <Button type="button" cor="green" onClick={proximaEtapa}>
                                {etapa === 3 ? "VER RESULTADO" : "PRÓXIMA ETAPA"}
                            </Button>
                        )}
                        <Button type="button" onClick={() => navigate("/")}>SAIR</Button>
                    </div>
                </>
      </main>
 )}

                       {estadoSequencia === "encerrada" &&(
           <div className="seq__inicio"> 
                        
                        <div className="inicio__info">
                            <Subtitle>SEQUÊNCIA COMPLETA!</Subtitle>
                            <Text cor="certo">PONTUAÇÃO TOTAL {pontosTotal}</Text>
                            {pontosEtapa.map((pontos, index) => (<Text key={index} >
                                Etapa {index + 1}: {pontos} pontos
                                </Text>))}
                        </div>

                        <div className="inicio__buttons">
                        <Button type="button" onClick={() => navigate("/")}>SAIR</Button>
                        </div>  

                    </div>)}
</div>
 );}