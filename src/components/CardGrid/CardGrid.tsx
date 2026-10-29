import './CardGrid.css'

type CardClickProps ={
    onClick?:(index: number) => void
    cardsRevelados: number[];
    respostaCorreta: boolean;
};

export default function CardGrid (props: CardClickProps){
    const cards = Array.from({ length: 16})
    return(
        <div className="card-grid">
            {cards.map((_, index) => (
                 <div className={`card ${props.respostaCorreta || props.cardsRevelados.includes(index) ? "card--revelado": ""}`}
                 key={index} 
                 onClick={() => {props.onClick?.(index);
}}
                 ></div>
            ))}
        </div>
    )}