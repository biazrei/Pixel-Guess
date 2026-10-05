import type { ReactNode } from "react"
import "./Button.css"

type ButtonProps ={
    children: ReactNode;
    cor: string;
};

export default function Button (props: ButtonProps){
    return (
    <button 
    type="button" 
    className={"button--" + props.cor}>
        {props.children}  </button>)
}