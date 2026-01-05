import type { JSX, MouseEvent }  from "react";

export interface TailTableHeader<T> {
    key:string,
    className?:string,
    cell?: (item: T, value:any) => JSX.Element | string
    hidden?:boolean,
    name:string
}

export interface TailTableProps<T> {
    className? : string,
    headers: TailTableHeader<T>[],
    data : T[],
    theadClassName? : string,
    trClassName? : string,
    firstTdClassName? : string,
    onTrHover? : (e : MouseEvent<HTMLElement>, value : T) => void,
    onTrOut? : (e : MouseEvent<HTMLElement>, value : T) => void,
    onTrClick? : (e : MouseEvent<HTMLElement>, value : T) => void
}
