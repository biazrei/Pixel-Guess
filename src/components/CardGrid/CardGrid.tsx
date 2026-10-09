import { useState } from 'react'
import './CardGrid.css'


export default function CardGrid(){
    const cards = Array.from({ length: 16})
    const [revelarCards, setRevelarcards] =useState()
    return(
        <div className="card-grid">
            {cards.map((_, index) => (
                 <div className="card" key={index}></div>
            ))}
        

        </div>
    )
}