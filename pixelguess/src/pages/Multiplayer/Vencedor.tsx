import "./Vencedor.css"
import Text from "../../components/Text/Text"

export default function Vencedor() {
    return (
        <main className="vencedor">

<div className="vencedor__content">
    <div className="vencedor__title">
        <Text>VENCEDOR</Text>
    </div>

    <svg
        className="vencedor__icon"
        viewBox="0 0 64 64"
        aria-hidden="true"
    >
        <circle cx="32" cy="32" r="29" />
        <circle cx="32" cy="23" r="11" />
        <path d="M13 51c3-12 10-18 19-18s16 6 19 18" />
    </svg>


  <div className="vencedor__username">
    <Text>USUARIO123</Text>
</div>

</div>

        </main>
    )
}