import './Sequencia.css'
import { useNavigate } from 'react-router'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import Subtitle from '../../components/Subtitle/Subtitle'
import Text from '../../components/Text/Text'
import { useState } from 'react'

type EstadoJogo = "jogando" | "vitoria" | "derrota";

export default function Sequencia() {
    const navigate = useNavigate();
    const [pontos, setPontos] = useState<number>(1500);
    const [resposta, setResposta] = useState("");
    const [resultado, setResultado] = useState<"correta" | "errada" | "">("");
    const [estadoJogo, setEstadoJogo] = useState<EstadoJogo>("jogando");

    // Letras provisórias para a coluna da esquerda
    const letras = ['A', 'B', 'C', 'D'];

    return (
        <main className='sequencia'>
            <div className='sequencia__grid'>
                <div className="sequencia__letras">
                    {letras.map((letra, index) => (
                        <div key={index} className="letra-box">{letra}</div>
                    ))}
                </div>
            </div>
            
        
            <form className='sequencia__form'
                onSubmit={(evento) => {
                    evento.preventDefault();
                    if (estadoJogo !== "jogando") { return; }
                    
                    if (resposta.trim().toLowerCase() === "abcd") {
                        setResultado("correta"); setEstadoJogo("vitoria");
                    } else {
                        setResultado("errada"); setResposta(""); 
                        setTimeout(() => { setResultado("") }, 1000);
                    }
                }}>
                    
                <Subtitle>SEQUÊNCIA</Subtitle>
                <Subtitle>PONTOS: {pontos}</Subtitle>
                
                {estadoJogo === "vitoria" && (<Text cor="parabens">PARABÉNS, VOCÊ ACERTOU!</Text>)}
                {estadoJogo === "derrota" && (<Text cor="aviso">NÃO FOI DESSA VEZ!</Text>)}
                
                {estadoJogo !== "derrota" && (
                    <Input type='text' placeholder='Digite sua resposta'
                        value={resposta}
                        aoDigitar={setResposta}
                        estado={resultado}
                        disabled={estadoJogo !== "jogando"}
                    />
                )}
                
                {estadoJogo === "jogando" && (
                    <Button type='submit' cor='green'>ENVIAR</Button>
                )}
                <Button type='button' onClick={() => navigate("/")}>SAIR</Button>
            </form>
        </main>
    )
}