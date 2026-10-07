import { useNavigate } from 'react-router'
import './Login.css'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'

export default function Login (){
    const navigate = useNavigate()
    
    return(

        <main>
            <h1>Login</h1>
            <Input/>
            <Button onClick={() => navigate("/")}>Voltar</Button>

        </main>
    )
}
