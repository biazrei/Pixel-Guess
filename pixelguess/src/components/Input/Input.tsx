import './Input.css'
type InputProps = {
    type?:"email"|"password"|"text"
    placeholder?: string 
    value?: string
    aoDigitar?: (valor: string) => void
    estado?:"correta"|"errada"|""
    disabled?:boolean;
    cor?: string;

}
export default function Input(props: InputProps){
    return(
       <input 
       className={`input ${props.estado ? `input--${props.estado}` : ""} ${props.cor ? `input--${props.cor}` : ""}`}
       type={props.type} 
       placeholder={props.placeholder} 
       value={props.value}
       onChange={(evento) => props.aoDigitar?.(evento.target.value)}
       disabled={props.disabled}
       />

    )
}