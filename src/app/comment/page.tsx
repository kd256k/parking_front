'use client'

import Pagination from "@/components/Pagination";
import TailSelect from "@/components/TailSelect";
import TailTable from "@/components/TailTable";
import { CommentForManagement } from "@/types/comment";
import { TailTableHeader } from "@/types/tailtable";
import { fetchAPI } from "@/utils/fetchAPI";
import { useIsModal, useModalRouter } from "@/utils/ModalUtil";
import { ChangeEvent, MouseEvent, Ref, useEffect, useRef, useState } from "react";


const SearchTypes = {
    CONTENT: '내용',
    PARKING_NAME: '주차장명',
    MEMBER_NAME: '사용자명',
}

function CommentCheckbox({ ref, onChange = () => { }, item, checked }: { ref?: Ref<HTMLInputElement>, onChange?: (e: ChangeEvent<HTMLInputElement>, item?: CommentForManagement) => void, item?: CommentForManagement, checked?: boolean }) {
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e, item);
        }
    }

    return (
        <input ref={ref} type="checkbox" onChange={onChangeHandler}
            checked={checked === true}
            className="w-5 h-5 bg-white border border-sky-300 rounded focus:ring-sky-500 focus:border-sky-500 block p-2.5" />
    )
}

export default function CommentPage() {

    const [mounted, setMounted] = useState(false);

    const [checkedIdList, setCheckedIdList] = useState<Set<number>>(new Set());

    const isModal = useIsModal();

    const { router: modalRouter } = useModalRouter();

    const [commentList, setCommentList] = useState<CommentForManagement[] | null>(null);

    const [numOfRows, setNumOfRows] = useState<number>(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const pageNo = useRef<number>(1);

    // select/input ref
    const searchTypeRef = useRef<HTMLSelectElement | null>(null);
    const searchWordRef = useRef<HTMLInputElement | null>(null);

    const [checkAll, setCheckAll] = useState(false);

    const onCheckBoxChange = (e: ChangeEvent<HTMLInputElement>, item?: CommentForManagement) => {
        if (!item) return;
        const checked = e.currentTarget.checked;

        checkItem(item.id, checked);
    }

    const onAllCheckBoxChange = (e: ChangeEvent<HTMLInputElement>) => {

        const checked = e.currentTarget.checked;

        setCheckAll(checked);

        if (!checked) {
            setCheckedIdList(new Set());
        } else {
            setCheckedIdList(new Set(commentList!.map(item => item.id)));
        }
    }

    /** TODO 필드 추가 및 가로 폭 조절 필요 */
    const headers: TailTableHeader<CommentForManagement>[] = [
        {
            key: 'check',
            name: <CommentCheckbox onChange={onAllCheckBoxChange} checked={checkAll} />,
            className: 'text-center w-[5%]',
            cell: (item) => <CommentCheckbox onChange={onCheckBoxChange} item={item} checked={checkedIdList.has(item.id)} />
        },
        {
            key: 'parking_name',
            name: '주차장명',
            className: 'text-center w-[20%]',
            cell: (item) => <span>{item.parking.parkingName}</span>
        },
        {
            key: 'content',
            name: '내용',
            className: 'w-[50%]',
            cell: (_, value) => <span className='truncate'>{value}</span>
        },
    ];


    const fetchData = async () => {
        const params = {
            'searchType': String(searchTypeRef.current?.value),
            'searchWord': String(searchWordRef.current?.value),
            'page': String(pageNo.current),
            'size': String(numOfRows),
        }

        const queryString = new URLSearchParams(params).toString();

        const res = await fetchAPI(`/admin/comment?${queryString}`);

        if (!res.ok) {
            console.error("data fetch Err");
            alert("목록을 불러오는데 실패했습니다.\n잠시 후 다시 시도해 주십시오.");
            return;
        }

        if (isModal) {
            modalRouter.replace('/comment?' + queryString);
        } else {
            window.history.replaceState(null, '', '?' + queryString);
        }

        const data = await res.json();

        setCommentList(data.content);
        setTotalCount(data.totalElements);

        console.log(data);
    }

    const changePage = (pageNo_: number) => {
        pageNo.current = pageNo_;
        fetchData();
    }

    const checkItem = (id: number, checked: boolean) => {
        const alreadyChecked = checkedIdList.has(id);

        if(!checked && alreadyChecked) {
            setCheckedIdList(prev => new Set([...prev].filter(id_ => id_ !== id)));
        } else if(checked && !alreadyChecked) {
            setCheckedIdList(prev => new Set([...prev, id]));
        }
    }

    const onTrClick = (e: MouseEvent<HTMLElement>, item: CommentForManagement) => {
        const checked = !checkedIdList.has(item.id);

        checkItem(item.id, checked);
    }

    const deleteItems = async () => {
        /** TODO 삭제 API 호출 구현 필요 */
        
        if(checkedIdList.size === 0) {
            alert('삭제할 항목을 선택하세요.');
            return;
        }

        if (!confirm('삭제하시겠습니까?\n\n(삭제된 댓글은 복구할 수 없습니다.)')) {
            return;
        }

        const url = '/admin/comment/' + Array.from(checkedIdList).join(',');

        console.log(url);

        
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!searchTypeRef.current || !searchWordRef.current) {
            return;
        }

        const filters = new URLSearchParams(location.search);

        searchTypeRef.current!.value = filters.get('category') || 'CONTENT';
        searchWordRef.current!.value = filters.get('type') || '';
        pageNo.current = parseInt(filters.get('page') || '1');
        setNumOfRows(parseInt(filters.get('size') || '10'));

        fetchData();
    }, [mounted]);

    if (!mounted) return;

    return (
        <>

            {
                commentList === null ?
                    <div className="text-xl font-bold text-center bg-sky-50 mt-2 p-5 rounded">조회중입니다...</div>
                    :
                    commentList.length > 0 ?
                        <>
                            <TailTable className={`mt-3`} headers={headers} data={commentList}
                                theadClassName="bg-sky-500 border-sky-400"
                                trClassName="bg-sky-100 border-sky-200 hover:bg-sky-200 text-sky-900"
                                firstTdClassName="text-sky-900"
                                onTrClick={onTrClick}
                            />

                        </>
                        :
                        <div className="text-xl font-bold text-center bg-sky-600 text-white mt-2 p-5 rounded">조회된 항목이 없습니다.</div>
            }
            {
                <div className={`p-5 flex justify-between items-center ${commentList && commentList.length > 0 ? '' : 'hidden'}`}>
                    <div></div>
                    <div className="flex justify-center items-center gap-x-5">
                        <TailSelect ref={searchTypeRef}
                            opk={Object.keys(SearchTypes)}
                            opv={Object.values(SearchTypes)} />

                        <div>
                            <input type="text" ref={searchWordRef} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    pageNo.current = 1;
                                    fetchData();
                                }
                            }} className="w-full p-2.5 bg-white border border-sky-300 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer" />
                        </div>
                    </div>
                    <div>
                        <button className='bg-sky-400 rounded text-white px-3 py-1 cursor-pointer' onClick={deleteItems}>선택 삭제</button>
                    </div>
                </div>
            }
            {
                <Pagination totalCount={totalCount} numOfRows={numOfRows} pageNo={pageNo.current} changePage={changePage} className="" currClassName="bg-sky-200" liClassName="bg-sky-50" />
            }
        </>
    );
}