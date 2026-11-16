
import Puzzle from "../../../components/Puzzle/Puzzle"

type EstadoEtapa = "" | "jogando" |"encerrada";

type JogoSeqProps={
     imagem_1: string;
     imagem_2: string;
     imagem_3: string;
     etapa: number;
     estadoEtapa: EstadoEtapa;
     onEtapaEncerrada:() => void;
    };

export default function JogoSequencia (props: JogoSeqProps){

    const imagemAtual =
    props.etapa === 1 ? props.imagem_1:
    props.etapa === 2 ? props.imagem_2:
    props.imagem_3;

    
    function encerrarEtapa(){
        props.onEtapaEncerrada();
    }

    return(
        <div>
            <Puzzle 
            key={props.etapa}
            imagem={imagemAtual}
            bloqueado ={props.estadoEtapa === "encerrada"}
            />
            <button onClick={(encerrarEtapa)}
            >encerrar</button>
           
     </div>
    )
}