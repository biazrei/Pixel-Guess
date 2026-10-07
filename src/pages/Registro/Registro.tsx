import './Registro.css'
import Text from '../../components/Text/Text'
import Title from '../../components/Title/Title'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { useNavigate } from 'react-router'
import { Link } from 'react-router'

export default function Registro(){
    const navigate = useNavigate()
    return (
        
        <main className='registro'>
        <div className='registro__text'>
            <Title> PIXEL GUESS</Title>
            <Text>Criar conta</Text>
            <Text>Já tem uma conta? 
                <Link to="/login" className='link'> Entrar</Link>
            </Text>
            </div>
             

            <form className='registro__buttons'>
             <Input type='email' placeholder='Digite seu e-mail'/>
             <Input type='password' placeholder='Crie uma senha'/>
             <Input type='password' placeholder='Confirme sua senha'/>
             <Button type='submit' cor='green'>CRIAR CONTA</Button>
             <Button type='button' onClick={() => navigate("/login")}>VOLTAR</Button>
            </form>

        </main>


    )
}