import "./Modo-aleatorio.css"
import Text from "../../components/Text/Text"

export default function ModoAleatorio() {

    return (
        <main className="modo-aleatorio">

<div className="modo-aleatorio__content">

<svg
    className="modo-aleatorio__icon"
    viewBox="0 0 64 64"
    aria-hidden="true"
>
    <circle cx="32" cy="32" r="29" />

    <circle cx="32" cy="23" r="11" />

    <path d="M13 51c3-12 10-18 19-18s16 6 19 18" />
</svg>

<Text>Procurando Jogador...</Text>

</div>

        </main>
    )
}