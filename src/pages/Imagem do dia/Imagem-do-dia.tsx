import './Imagem-do-dia.css'
import { useNavigate } from 'react-router'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import Subtitle from '../../components/Subtitle/Subtitle'
import Text from '../../components/Text/Text'
import GameContainer from '../../components/GameContainer/Game.Container'

export default function ImagemDoDia () {
    const navigate = useNavigate()
    
    return (
         <main className='imgdia'>
           
            <div className='imgdia__info'>
            <Subtitle> IMAGEM DO DIA </Subtitle>
            <Text>Pontos</Text>
            <GameContainer/>
            </div>
             

            <form className='imgdia__form'>
             <Input type='text' placeholder='Digite sua resposta'/>
             <Button type='submit' cor='green'>ENVIAR </Button>
             <Button type='button' onClick={() => navigate("/")}>SAIR</Button>
            </form>
       
        </main>

    )
}
