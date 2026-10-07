import { useNavigate } from 'react-router'
import './Login.css'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import Title from '../../components/Title/Title'
import Text from '../../components/Text/Text'

export default function Login (){
    const navigate = useNavigate()
    
    return(
        <main className='form'>
           
            <div className='login__text'>
            <Title> Pixel Guess</Title>
            <Text>ENTRAR</Text>
            <Button onClick={() => navigate("/")}>Voltar</Button>
            </div>
             

            <form className='login__buttons'>
            <Input type='email' placeholder='Digite seu e-mail'/>

             <Input type='password' placeholder='Digite sua senha'/>

             <Button type='submit' cor='green'>ENTRAR</Button>
            </form>
       
        </main>

    )
}
