import './Input.css'
type InputProps = {
    type?:"email"|"password"|"text"
    placeholder?: string 
    value?: string
    onChange?: (valor: string) => void
    estado?:"correta"|"errada"|""
    disabled?:boolean
}
export default function Input(props: InputProps){
    return(
       <input 
       className={`input ${props.estado ? `input--${props.estado}` : ""}`}
       type={props.type} 
       placeholder={props.placeholder} 
       value={props.value}
       onChange={(evento) => props.onChange?.(evento.target.value)}
       disabled={props.disabled}
       />

    )
}