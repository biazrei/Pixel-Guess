import './CardGrid.css'

type CardClickProps ={
    onClick?:(index: number) => void
    cardsRevelados: number[];
    estadoJogo:"jogando"|"vitoria"|"derrota";
};

export default function CardGrid (props: CardClickProps){
    const cards = Array.from({ length: 16})
    return(
        <div className="card-grid">
            {cards.map((_, index) => (
                 <div className={`card ${props.estadoJogo !=="jogando" || props.cardsRevelados.includes(index) ? "card--revelado": ""}`}
                 key={index} 
                 onClick={() => {props.onClick?.(index);
}}
                 ></div>
            ))}
        </div>
    )}