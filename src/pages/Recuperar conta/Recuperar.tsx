import './Recuperar.css'
import Title from '../../components/Title/Title'
import Text from '../../components/Text/Text'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { useNavigate } from 'react-router'


export default function Recuperar(){
    const navigate= useNavigate()
    return(
        <main className='recuperar'>
            <div className='recuperar__text'>
            <Title> PIXEL GUESS</Title>
            <Text> Recuperar senha </Text>
            </div>

            <form className='recuperar__form'>
            <Text> Informe seu e-mail para receber as instruções de recuperação</Text>
            <Input type='email' placeholder='Digite seu e-mail'/>
            <Button type='submit' cor='green'>ENVIAR</Button>
            <Button type='button' onClick={() => navigate("/login")}>VOLTAR</Button>
            </form>
        </main>
    )

}

