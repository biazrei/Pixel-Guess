import { useNavigate } from 'react-router'
import './Login.css'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'

export default function Login (){
    const navigate = useNavigate()
    
    return(
        <form>
            <h1>Login</h1>
            <Input type='email' placeholder='Digite seu e-mail'/>
             <Input type='password' placeholder='Digite sua senha'/>
             <Button type='submit'>ENTRAR</Button>


            <Button onClick={() => navigate("/")}>Voltar</Button>

        
        </form>

    )
}
