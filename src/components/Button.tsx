import type { MouseEventHandler, ReactNode } from "react";

export default function Button(props:any) {
    return (<button onClick={props.onClick} className="bg-green-800 text-white rounded hover:bg-green-700 px-4 py-2 text-center mx-2">{props.children}</button>)
}