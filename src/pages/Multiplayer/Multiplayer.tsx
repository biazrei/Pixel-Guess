import "./Multiplayer.css";
import { useNavigate } from 'react-router'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import Text from '../../components/Text/Text'

type RoundResult = "win" | "loss" | "pending"

export default function Multiplayer() {
     const navigate = useNavigate()
     const rounds: RoundResult[] = ["win", "loss", "pending", "pending", "pending"];

    return (
        <main className='multiplayer'>
             <header className="multiplayer__header">
                   
                <button className="multiplayer__back" onClick={() => navigate("/")}
                    aria-label="Voltar para a Home">
                    <span className="back-icon"></span>
                </button>
                   
                <Text>MULTIPLAYER</Text>

              </header>
            
                <div className="multiplayer__info">
                    <div className="multiplayer__rounds">
                        {rounds.map((result, index) => (
                            <span key={index} className={`multiplayer__round multiplayer__round--${result}`}></span>
                        ))}
                    </div>

                    <span className="multiplayer__timer">
                        00:10:00
                    </span>

                </div>

                <div className="multiplayer__board">
                   <div className="multiplayer__row"></div>
                    <div className="multiplayer__row"></div>
                    <div className="multiplayer__row"></div>
                    <div className="multiplayer__row"></div> 
                </div>

                <div className="multiplayer__answer">
                    <Input type="text"/>
                    <Button type="button"
                            cor="button--purple">
                                ENVIAR
                            </Button>
                </div>
        </main>
    );
}