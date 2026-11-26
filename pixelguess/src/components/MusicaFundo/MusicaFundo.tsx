import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ResultadoMusica = "vitoria" | "derrota" | null;

const MusicaContext = createContext<
  (resultado: ResultadoMusica) => void
>(() => {});

export function useMusicaFundo() {
  return useContext(MusicaContext);
}

interface MusicaFundoProps {
  children: ReactNode;
}

export default function MusicaFundo({ children }: MusicaFundoProps) {
  const fundoRef = useRef<HTMLAudioElement>(null);
  const vitoriaRef = useRef<HTMLAudioElement>(null);
  const derrotaRef = useRef<HTMLAudioElement>(null);

  const iniciouRef = useRef(false);
  const [resultado, setResultado] = useState<ResultadoMusica>(null);
  const resultadoAtualRef = useRef<ResultadoMusica>(null);

  useEffect(() => {
    const fundo = fundoRef.current;
    const vitoria = vitoriaRef.current;
    const derrota = derrotaRef.current;

    resultadoAtualRef.current = resultado;

    if (!fundo || !vitoria || !derrota) return;

    if (!iniciouRef.current) return;

    fundo.pause();
    vitoria.pause();
    derrota.pause();

    vitoria.currentTime = 0;
    derrota.currentTime = 0;

    if (resultado === "vitoria") {
      vitoria.play().catch(console.error);
    } else if (resultado === "derrota") {
      derrota.play().catch(console.error);
    } else {
      fundo.play().catch(console.error);
    }
  }, [resultado]);

  useEffect(() => {
    const fundo = fundoRef.current;
    const vitoria = vitoriaRef.current;
    const derrota = derrotaRef.current;

    if (!fundo || !vitoria || !derrota) return;

    fundo.volume = 0.06;
    vitoria.volume = 0.10;
    derrota.volume = 0.10;

    function iniciarMusica() {
      iniciouRef.current = true;

      if (resultadoAtualRef.current === null) {
        fundo!.play().catch(console.error);
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
    <MusicaContext.Provider value={setResultado}>
      <audio
        ref={fundoRef}
        src="/musica.mp3"
        loop
        preload="auto"
      />

      <audio
        ref={vitoriaRef}
        src="/vitoria.mp3"
        preload="auto"
        onEnded={() => setResultado(null)}
      />

      <audio
        ref={derrotaRef}
        src="/derrota.mp3"
        preload="auto"
        onEnded={() => setResultado(null)}
      />

      {children}
    </MusicaContext.Provider>
  );
}