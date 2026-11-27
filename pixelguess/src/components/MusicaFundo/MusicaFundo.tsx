import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ResultadoMusica = "vitoria" | "derrota" | null;

const MusicaContext = createContext<(resultado: ResultadoMusica) => void>(() => {});

export function useMusicaFundo() {
  return useContext(MusicaContext);
}

interface MusicaFundoProps {
  children: ReactNode;
}

export default function MusicaFundo({ children }: MusicaFundoProps) {
  const [resultado, setResultado] = useState<ResultadoMusica>(null);
  const iniciouRef = useRef(false);

  // Guarda os 3 áudios em um único objeto na memória
  const audiosRef = useRef<{
    fundo: HTMLAudioElement;
    vitoria: HTMLAudioElement;
    derrota: HTMLAudioElement;
  } | null>(null);

  //Audio esperando interação do usuário para iniciar
  useEffect(() => {
    const fundo = new Audio("/musica.mp3");
    const vitoria = new Audio("/vitoria.mp3");
    const derrota = new Audio("/derrota.mp3");

    fundo.loop = true;
    fundo.volume = 0.06;
    vitoria.volume = 0.1;
    derrota.volume = 0.1;

    // Quando a música de vitória ou derrota acabar, volta para o estado normal (null)
    vitoria.onended = () => setResultado(null);
    derrota.onended = () => setResultado(null);

    audiosRef.current = { fundo, vitoria, derrota };

    function iniciarMusica() {
      iniciouRef.current = true;
      fundo.play().catch(console.error);
    }

    //{ once: true } remove o evento automaticamente após o primeiro clique ou tecla
    document.addEventListener("click", iniciarMusica, { once: true });
    document.addEventListener("keydown", iniciarMusica, { once: true });

    return () => {
      document.removeEventListener("click", iniciarMusica);
      document.removeEventListener("keydown", iniciarMusica);
      Object.values(audiosRef.current!).forEach((audio) => audio.pause());
    };
  }, []);

  //Troca a música sempre que resultado da partida mudar
  useEffect(() => {
    const audios = audiosRef.current;
    if (!audios || !iniciouRef.current) return;

    //Pausa todos os áudios e reinicia os efeitos curtos
    Object.values(audios).forEach((audio) => audio.pause());
    audios.vitoria.currentTime = 0;
    audios.derrota.currentTime = 0;

    //Toca o áudio correspondente ao estado atual
    const audioAtual = resultado ? audios[resultado] : audios.fundo;
    audioAtual.play().catch(console.error);
  }, [resultado]);

  return (
    <MusicaContext.Provider value={setResultado}>
      {children}
    </MusicaContext.Provider>
  );
}