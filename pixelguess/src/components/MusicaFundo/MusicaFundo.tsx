
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const MusicaContext = createContext<(valor: boolean) => void>(() => {});

export function useMusicaFundo() {
  return useContext(MusicaContext);
}

interface MusicaFundoProps {
  children: ReactNode;
}

export default function MusicaFundo({ children }: MusicaFundoProps) {
  const fundoRef = useRef<HTMLAudioElement>(null);
  const gameOverRef = useRef<HTMLAudioElement>(null);

  const iniciouRef = useRef(false);
  const gameOverAtualRef = useRef(false);

  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    gameOverAtualRef.current = gameOver;

    const fundo = fundoRef.current;
    const derrota = gameOverRef.current;

    if (!fundo || !derrota || !iniciouRef.current) return;

    if (gameOver) {
      fundo.pause();
      derrota.currentTime = 0;
      derrota.play().catch(console.error);
    } else {
      derrota.pause();
      derrota.currentTime = 0;
      fundo.play().catch(console.error);
    }
  }, [gameOver]);

  useEffect(() => {
    const fundo = fundoRef.current;
    const derrota = gameOverRef.current;

    if (!fundo || !derrota) return;

    fundo.volume = 0.06;
    derrota.volume = 0.10;

    function iniciarMusica() {
      iniciouRef.current = true;

      if (gameOverAtualRef.current) {
        derrota?.play().catch(console.error);
      } else {
        fundo?.play().catch(console.error);
      }

      document.removeEventListener("click", iniciarMusica);
      document.removeEventListener("keydown", iniciarMusica);
    }

    document.addEventListener("click", iniciarMusica);
    document.addEventListener("keydown", iniciarMusica);

    return () => {
      document.removeEventListener("click", iniciarMusica);
      document.removeEventListener("keydown", iniciarMusica);
    };
  }, []);

  return (
    <MusicaContext.Provider value={setGameOver}>
      <audio
        ref={fundoRef}
        src="/musica.mp3"
        loop
        preload="auto"
      />

      <audio
        ref={gameOverRef}
        src="/gameover.mp3"
        preload="auto"
      />

      {children}
    </MusicaContext.Provider>
  );
}