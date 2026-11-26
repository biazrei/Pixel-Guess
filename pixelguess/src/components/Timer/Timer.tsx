import Subtitle from "../Subtitle/Subtitle";
import "./Timer.css";

type TimerProps = {
    tempo: number;
};

export default function Timer({ tempo }: TimerProps) {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;

    const classeTempo =
        tempo <= 10
            ? "timer--critico"
            : tempo <= 30
            ? "timer--atencao"
            : "";

    return (
        <Subtitle>
            <span className={`timer ${classeTempo}`}>
                TEMPO {String(minutos).padStart(2, "0")}:
                {String(segundos).padStart(2, "0")}
            </span>
        </Subtitle>
    );
}