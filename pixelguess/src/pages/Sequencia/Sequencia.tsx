import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import Text from "../../components/Text/Text"
import "./Sequencia.css"
import { useNavigate } from "react-router"
import { buscarImagensSeq } from "./Service/SeqService"
import { useState, useEffect } from "react"
import JogoSequencia from "./Jogo/JogoSeq"

export default function Sequencia(){
    const navigate = useNavigate();
    const [imagensSeq, setImagensSeq] = useState({
        imagem_1:"",
        imagem_2:"",
        imagem_3:""
    })
    type EstadoEtapa = "" |"jogando"|"encerrada"

    const [etapa, setEtapa] = useState(1);
    const [estadoEtapa, setEstadoEtapa] = useState<EstadoEtapa>("jogando");

    function proximaEtapa(){
        if (etapa <3 ){
            setEtapa(etapa +1)
            setEstadoEtapa("jogando")
        }
    }

  useEffect(() => {
    buscarImagensSeq()
        .then((dados) => {
            setImagensSeq(dados);
        })
        .catch((erro) => {
            console.error(erro);
        });
}, []);  

    return(
        <main className="sequencia">
            <div className="seq__grid">
                <p>Etapa atual: {etapa}</p>
                <JogoSequencia 
                imagem_1={imagensSeq.imagem_1}
                imagem_2={imagensSeq.imagem_2}
                imagem_3={imagensSeq.imagem_3}
                etapa={etapa}
                estadoEtapa={estadoEtapa}onEtapaEncerrada={() => setEstadoEtapa("encerrada")}
                />
            </div>
            
            <form className="seq__form">
                <Text cor="aviso"> APENAS 1 TENTATIVA   </Text>
                <Input
                type="text"
                placeholder="Digite sua resposta"
                ></Input>
                {estadoEtapa !== "encerrada" && (
                    <Button type="submit" cor="green">ENVIAR RESPOSTA</Button>)}
                
                {estadoEtapa === "encerrada" && etapa < 3 && (
                    <Button type="button" cor="pink" onClick={proximaEtapa}>PRÓXIMA ETAPA</Button>)}
                
                <Button type="button"
                onClick={() => navigate("/")}>SAIR</Button>

            </form>
        </main>
    )
}