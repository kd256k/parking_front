import type { JSX } from "react"

export interface PagenationProps {
    className? : string,
    totalCount : number,
    numOfRows : number,
    pageNo : number,
    changePage?: (pageNo:number)=>void,
    showPagingButtonCount? : number,
    commonClassName?: string,
    currClassName?: string,
    liClassName?: string
}

export interface PageLiProps {
    liPageNo: number,
    children : JSX.Element | string
}
