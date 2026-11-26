import "./Modo.css"
import { useNavigate } from "react-router"
import { useState, useEffect, useCallback} from "react"
import Button from "../../components/Button/Button"
import Subtitle from "../../components/Subtitle/Subtitle"
import Text from "../../components/Text/Text";
import socket from "../../services/socket";
import { Users } from 'pixelarticons/react'
import Input from "../../components/Input/Input"


type Tela = "inicio" | "aleatorio" | "criar" | "entrar";

export default function Modo() {
    const navigate = useNavigate()
    const [tela, setTela] = useState<Tela>("inicio");
    const [mensagem, setMensagem] = useState("Conectando ao servidor...");
    const [erro, setErro] = useState("");
    const [numeroSala, setNumeroSala] = useState("");
    const [codigo, setCodigo] = useState("");
    const jogadoresReunidos = useCallback(() => { navigate("/multiplayer");}, [navigate]);

    function mudarTela(novaTela: Tela) {
        setErro("");
        setTela(novaTela);
    }

    function entrarNaSala() {
            const codigoFormatado = codigo.trim().toUpperCase();
    
            if (!codigoFormatado) {
                setErro("Digite o código da sala.");
                return;
            }
    
            setErro("");
            socket.emit("entrar-sala-privada", codigoFormatado);
        }


    useEffect(() => {
        if (tela !== "aleatorio") return;

        function entrarNaBusca() {
            setMensagem("Procurando jogador...");
            socket.emit("entrar-aleatorio");
        }

        function aguardarJogador(dados: { mensagem: string }) {
            setMensagem(dados.mensagem);
        }


        function mostrarErro(mensagemErro: string) {
            setErro(mensagemErro);
        }

        socket.on("aguardando-jogador", aguardarJogador);
        socket.on("jogadores-reunidos", jogadoresReunidos);
        socket.on("erro-sala", mostrarErro);

        if (socket.connected) {
            entrarNaBusca();
        } else {
            socket.once("connect", entrarNaBusca);
            socket.connect();
        }

        return () => {
            socket.off("connect", entrarNaBusca);
            socket.off("aguardando-jogador", aguardarJogador);
            socket.off("jogadores-reunidos", jogadoresReunidos);
            socket.off("erro-sala", mostrarErro);
        };
    }, [tela, navigate, jogadoresReunidos]);   

    useEffect(() => {
        if (tela !== "criar") return;
        function receberCodigo(dados: { codigo: string }) {
            setNumeroSala(dados.codigo);
        }

        socket.on("sala-criada", receberCodigo);
        socket.on("jogadores-reunidos", jogadoresReunidos);

        socket.emit("criar-sala-privada");

        return () => {
            socket.off("sala-criada", receberCodigo);
            socket.off("jogadores-reunidos", jogadoresReunidos);
        };
    }, [tela, navigate, jogadoresReunidos]);

         useEffect(() => {
            if (tela !== "entrar") return;
            
            function receberErro(mensagem: string) {
                setErro(mensagem);
            }
    
            socket.on("jogadores-reunidos", jogadoresReunidos);
            socket.on("erro-sala", receberErro);
    
            return () => {
                socket.off("jogadores-reunidos", jogadoresReunidos);
                socket.off("erro-sala", receberErro);
            };
        }, [tela, navigate, jogadoresReunidos]);
    
        
    return (
        <div>
            {tela === "inicio" && (
                 <main className="modo">
            <div className="modo__text">

                <Subtitle> ESCOLHA O MODO </Subtitle>

            </div>

            <div className="modo__buttons">
                <Button type="button" cor="purple" onClick={() =>mudarTela("aleatorio")}>ALEATÓRIO</Button>
                <Button type="button" cor="purple" onClick={() => mudarTela("criar")}>CRIAR UMA SALA</Button>
                <Button type="button" cor="purple" onClick={() => mudarTela("entrar")}>ENTRAR EM UMA SALA</Button>
                <Button type="button" onClick={() => navigate("/")}>VOLTAR </Button>
            </div>
        </main>
 )}

       {tela === "aleatorio" && (
        <main className="modo-sala">
                    <div className="modo-sala__content">
                        <Users width={72} height={72}/>
                        <Text>{erro || mensagem}</Text>
                        <div className="modo__buttons">
                        <Button type="button" onClick={() => mudarTela("inicio")}>VOLTAR </Button> </div>
                    </div>
                </main>)}

        {tela === "criar" &&(
         <main className="modo-sala">
            <div className="modo-sala__codigo">
                <Subtitle> Nº DA SALA</Subtitle>
                <Subtitle>{numeroSala || "GERANDO CÓDIGO..."}</Subtitle>
            </div>
            <div className="modo-sala__buttons">
                <Text>Aguardando jogador...</Text>

                    <Button type="button" onClick={() => { socket.emit("finalizar-partida"); mudarTela("inicio")}}>
                    VOLTAR
                </Button>
            </div>
        </main>)}

        {tela === "entrar" && (
            <main className="modo-sala">
                        <div className="modo-sala__content">
                            <Subtitle>
                                DIGITE O CÓDIGO DA SALA
                            </Subtitle>
            
                            <Input type="text"
                                   placeholder="Insira o código..."
                                   value={codigo}
                                   aoDigitar={setCodigo} 
                                   cor="purple" 
                                />
            
                                {erro && <p>{erro}</p>}
            
                            <div className="modo-sala__buttons">
                                <Button
                                    type="button" cor="purple" onClick={entrarNaSala}
                                    >
                                        ENTRAR
                                </Button>
            
                                <Button type="button" onClick={() => mudarTela("inicio")}>
                                    VOLTAR
                                </Button>
                            </div>
                        </div>
                    </main>

        )}
    </div>
        
       
    )
}