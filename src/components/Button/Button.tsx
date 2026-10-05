import type { ReactNode } from "react"
import "./Button.css"

type ButtonProps ={
    children: ReactNode;
};

export default function Button (props: ButtonProps){
    return (
      <button type="button">{props.children}</button>)
}