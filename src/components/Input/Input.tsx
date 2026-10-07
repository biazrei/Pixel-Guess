import './Input.css'



type InputProps = {
    type?:"email"|"password"|"text"
    placeholder?: string 
}


export default function Input(props: InputProps){
    return(
       <input className="input"type={props.type} placeholder={props.placeholder} />

    )
}