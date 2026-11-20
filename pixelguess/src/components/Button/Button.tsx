import type { ReactNode } from "react";
import "./Button.css";

type ButtonProps = {
  children: ReactNode;
  cor?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function Button(props: ButtonProps) {
  console.log("Tipo:", props.type, "| Texto:", props.children);

  return (
    <button
      type={props.type ?? "button"}
      className={"button--" + props.cor}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
