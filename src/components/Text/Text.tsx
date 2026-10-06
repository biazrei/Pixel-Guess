import type { ReactNode } from "react";
import './Text.css'

type TextProps = {
    children: ReactNode;
}

export default function Text (props: TextProps) {
    return(
        <p className="text">{props.children}</p>
    )
}