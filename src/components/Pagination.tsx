import type { MouseEvent }  from "react";
import type { PageLiProps, PagenationProps } from "@/types/pagination";


export default function Pagination({className="", totalCount, numOfRows, pageNo, changePage=()=>{}, showPagingButtonCount = 10,
                        commonClassName: _commonClassName="text-sm font-bold rounded",
                        currClassName: _currClassName="bg-yellow-200", liClassName: _liClassName="bg-white" } : PagenationProps ) {
    const pageCount = Math.ceil(totalCount / numOfRows);

    const from = Math.floor((pageNo - 1) / showPagingButtonCount) * showPagingButtonCount + 1;
    const to = Math.min(from + showPagingButtonCount - 1, pageCount);

    const showPages = [];
    for(let i = from; i <= to; i++) {
        showPages.push(i);
    }
    
    const onClickPage = (e : MouseEvent<HTMLLIElement>) => {
        const toPageNo = parseInt(e.currentTarget.dataset.page ?? '1');

        if(pageNo !== toPageNo) {
            changePage(toPageNo);
        }
    };
    
    const commonClassName = `border border-gray-100 py-1 px-2 mx-2 ${_commonClassName}`;
    const currClassName = `${commonClassName} cursor-default disabled ${_currClassName}`;
    const liClassName = `${commonClassName} cursor-pointer  ${_liClassName}`;

    const PageLi = ({liPageNo, children} : PageLiProps) => {
        return (
            <li title={String(liPageNo)} data-page={liPageNo} onClick={onClickPage} className={`${liPageNo === pageNo ? currClassName : liClassName}`}>{children}</li>
        )
    }


    return (
        <ul className={`flex justify-center ${className}`}>
            <PageLi liPageNo={1} >«</PageLi>
            <PageLi liPageNo={Math.max(1, from - 1)} >‹</PageLi>
            {
                showPages.map(i => <PageLi key={i} liPageNo={i} >{String(i)}</PageLi>)
            }
            <PageLi liPageNo={Math.min(pageCount, to + 1)} >›</PageLi>
            <PageLi liPageNo={pageCount} >»</PageLi>
        </ul>
    )
}
