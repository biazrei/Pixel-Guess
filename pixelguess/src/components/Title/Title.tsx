import type { ReactNode } from 'react';
import './Title.css';

type TitleProps = {
    children: ReactNode;
};

export default function Title(props: TitleProps) {
    return (<h1 className='title'> {props.children}</h1>)
}