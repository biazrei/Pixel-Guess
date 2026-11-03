import "./Sequencia.css";
import Button from "../../components/Button/Button";
import { useNavigate } from 'react-router';
import Input from "../../components/Input/Input";

export default function Sequencia() {
    const navigate = useNavigate();
    
    return (
        <main className="sequencia">
            {/* Coluna 1 do Grid */}
            <div className="sequencia__grid">
                <h1>Sequência</h1>
            </div>
            
            {/* Coluna 2 do Grid */}
            <div className="sequencia__form">
                <Input />
                <Button onClick={() => navigate("/")}>Voltar</Button>
            </div>
        </main>
    );
}
