import { useState } from 'react'
import './CardGrid.css'

export default function CardGrid(){
    const cards = Array.from({ length: 16})
    const [cardsRevelados, setCardsRevelados] =useState<number[]>([]);
    

    function ClicarCard (index: number) { 
    if (cardsRevelados.includes(index)) {
        return;
    }
    {setCardsRevelados([...cardsRevelados, index]);}
    }
    

    return(
        <div className="card-grid">
            {cards.map((_, index) => (
                 <div  className={`card ${cardsRevelados.includes(index) ? "card--revelado" : ""}`}
          key={index}
          onClick={() => ClicarCard(index)}></div>
            ))}
        </div>
    );}
