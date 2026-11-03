import type { ReactNode } from "react";
import './Text.css'

type TextProps = {
    children: ReactNode;
    cor?: string;
}

export default function Text (props: TextProps) {
    return(
        <p className={"text--" +props.cor}>{props.children}</p>
    )
}