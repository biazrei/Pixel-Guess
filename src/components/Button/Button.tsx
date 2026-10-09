import type { ReactNode } from "react"
import "./Button.css"


type ButtonProps ={
    children: ReactNode;
    cor?: string;
    onClick?: () => void;
    type?:"button"|"submit"

};

export default function Button (props: ButtonProps){
    return (
    <button 
    type={props.type ?? "button" }
    className={"button--" + props.cor} onClick={props.onClick}>
        {props.children}  </button>)
}