import './Imagem-do-dia.css'
import { useNavigate } from 'react-router'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import Subtitle from '../../components/Subtitle/Subtitle'
import Text from '../../components/Text/Text'
import '../../Jogos/JImagem do dia/JogoDia'
import JogoDia from '../../Jogos/JImagem do dia/JogoDia'

export default function ImagemDoDia () {
    const navigate = useNavigate()
    
    return (
         <main className='imgdia'>
            <div className='imgdia__grid'>
            <JogoDia/>
            </div>
            
            <form className='imgdia__form'>
            <Subtitle> IMAGEM DO DIA </Subtitle>
            <Text>Pontos</Text>
            <Input type='text' placeholder='Digite sua resposta'/>
            <Button type='submit' cor='green'>ENVIAR </Button>
            <Button type='button' onClick={() => navigate("/")}>SAIR</Button>
            </form>
       
        </main>

    )
}
