import './Imagem-do-dia.css'
import { useNavigate } from 'react-router'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import Subtitle from '../../components/Subtitle/Subtitle'
import Text from '../../components/Text/Text'
import JogoDia from '../../Jogos/jgdia/JogoDia'
import { useState } from 'react'

type EstadoJogo = "jogando"| "vitoria"| "derrota";

export default function ImagemDoDia () {
    const navigate = useNavigate()
    const [pontos, setPontos] =useState<number>(1500);
    const [resposta, setResposta] = useState("");
    const [resultado, setResultado] = useState<"correta" | "errada" | "">("");
    const [ultimaTentativa, setUltimaTentativa] = useState(false);
    const [estadoJogo, setEstadoJogo] =
    useState<EstadoJogo>("jogando");
   
    async function envioResposta(evento: React.FormEvent) {
        evento.preventDefault();
        if (estadoJogo !== "jogando") {return;}

        try {
            const response = await fetch("http://localhost:3000/api/verificar-resposta", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({resposta: resposta}),
             });

             if (!response.ok) {
                throw new Error("Erro ao validar resposta");
             }

             const dados = await response.json(); 
             if(dados.acertou){
                setResultado("correta")
                setEstadoJogo("vitoria")
             } else{
                setResultado("errada")
                setResposta("");

                if (ultimaTentativa) {
                    const novosPontos = Math.max(pontos - 100, 0);
                    setPontos(novosPontos)
                    setEstadoJogo("derrota")
                } else { setTimeout(() => {setResultado ("")}, 1000);}
             }
        }
     catch (erro) {
        console.error("Erro na comunicação com o servidor:", erro)
    }}

    return (
         <main className='imgdia'>
            <div className='imgdia__grid'>
            <JogoDia onPontosChange={setPontos}
            estadoJogo={estadoJogo}
            onUltimoCardRevelado={() => setUltimaTentativa(true)}/>
            </div>
            
            <form className='imgdia__form'
             onSubmit={envioResposta}>
                    
            <Subtitle> IMAGEM DO DIA </Subtitle>
            <Subtitle>PONTOS: {pontos}</Subtitle>
            
            {ultimaTentativa && estadoJogo === "jogando" && (<Text cor="aviso">1 TENTATIVA RESTANTE</Text >)}
            {estadoJogo === "vitoria" && (<Text cor="parabens">PARABÉNS, VOCÊ ACERTOU!</Text>)}
            {estadoJogo === "derrota" && (<Text cor="aviso">NÃO FOI DESSA VEZ!</Text>)}
            
            {estadoJogo !== "derrota" && (
            <Input type='text' placeholder='Digite sua resposta'
            value={resposta}
            aoDigitar={setResposta}
            estado={resultado}
            disabled={estadoJogo !== "jogando"}
            />)}
            
            {estadoJogo === "jogando" && (
            <Button type='submit' cor='green'> ENVIAR </Button>)}
            <Button type='button' onClick={() => navigate("/")}>SAIR</Button>
            </form>
       
        </main>

    )
}
