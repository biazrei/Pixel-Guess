import type { ReactNode} from "react";
import './Subtitle.css'

type SubtitleProps ={
    children: ReactNode;
};

export default function Subtitle (props: SubtitleProps){
    return (
        <p className="subtitle">{props.children}</p>
    )
}

