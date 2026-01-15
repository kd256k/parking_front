'use client'

import Pagination from "@/components/Pagination";
import TailSelect from "@/components/TailSelect";
import TailTable from "@/components/TailTable";
import { CommentForManagement } from "@/types/comment";
import { TailTableHeader } from "@/types/tailtable";
import { fetchAPI } from "@/utils/fetchAPI";
import { useIsModal, useModalRouter } from "@/utils/ModalUtil";
import { ChangeEvent, MouseEvent, Ref, useEffect, useRef, useState } from "react";
import { format, parseISO} from 'date-fns';
import { FaStar } from 'react-icons/fa';

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

    const [mounted, setMounted] = useState(false); // 초기 로드 완료 여부

    const [checkedIdList, setCheckedIdList] = useState<Set<number>>(new Set()); // 체크된 ID 셋

    const isModal = useIsModal();

    const { push: modalPush, router: modalRouter } = useModalRouter();

    const [commentList, setCommentList] = useState<CommentForManagement[] | null>(null); // 조회된 댓글 목록

    const [numOfRows, setNumOfRows] = useState<number>(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const pageNo = useRef<number>(1);

    // select/input ref
    const searchTypeRef = useRef<HTMLSelectElement | null>(null);  // 검색 타입
    const searchWordRef = useRef<HTMLInputElement | null>(null);   // 검색어

    const [checkAll, setCheckAll] = useState(false); // 전체 선택 체크 여부

    // 개별 체크박스 선택 이벤트
    const onCheckBoxChange = (e: ChangeEvent<HTMLInputElement>, item?: CommentForManagement) => {
        if (!item) return;
        const checked = e.currentTarget.checked;

        checkItem(item.id, checked);
    }

    // 전체 선택 체크박스 선택 이벤트
    const onAllCheckBoxChange = (e: ChangeEvent<HTMLInputElement>) => {

        if(checkedIdList.size === (commentList ? commentList.length : 0)) {
            // 전체 선택되어 있음 => 모두 선택 해제
            setCheckedIdList(new Set());
            setCheckAll(false);
        } else {
            // 그외 => 모두 선택
            setCheckedIdList(new Set(commentList!.map(item => item.id)));
            setCheckAll(true);
        }

    }

    // 테이블 헤더 정보
    const headers: TailTableHeader<CommentForManagement>[] = [
        {
            key: 'check',
            name: <CommentCheckbox onChange={onAllCheckBoxChange} checked={checkAll} />,
            className: 'text-center w-[10%]',
            cell: (item) => <CommentCheckbox onChange={onCheckBoxChange} item={item} checked={checkedIdList.has(item.id)} />
        },
        {
            key: 'parking_name',
            name: '주차장명',
            className: 'text-center w-[20%]',
            cell: (item) => <span className='cursor-pointer' onClick={(e)=>{e.stopPropagation(); modalPush('/board/' + item.parking.parkingId)}}>{item.parking.parkingName}</span>
        },
        {
            key: 'member_name',
            name: '작성자명',
            className: 'text-center w-[10%]',
            cell: (item) => <span className='cursor-pointer' onClick={(e)=>{e.stopPropagation(); modalPush('/member/user/' + item.member.id)}}>{item.member.name}</span>
        },
        {
            key: 'content',
            name: '내용',
            className: 'w-[20%]',
            cell: (_, value) => <span className='truncate'>{value}</span>
        },
        {
            key: 'rate',
            name: '별점',
            className: 'text-center w-[15%]',
            cell: (_, value) => <div className="justify-center items-center flex flex-row font-bold gap-2">
                                    <FaStar size={20} color="#FFD700"/>
                                    <div className="pt-1">{value}</div>
                                </div>
        },
        {
            key: 'edited',
            name: '수정여부',
            className: 'text-center w-[10%]',
            cell: (_, value) => <span>{value ? '수정됨' : ''}</span>
        },
        {
            key: 'createdDate',
            name: '등록일시',
            className: 'text-center w-[15%]',
            cell: (_, value) => <span>{getFormattedDate(value)}</span>
        },        
    ];
    
        const getFormattedDate = (dateStr: string) => {
            const date = parseISO(dateStr);
    
            return format(date, 'yyyy-MM-dd HH:mm:ss');
        };

    // 데이터 조회
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

        // 뒤로가기로 돌아왔을 때 처리를 위한 querystring 변경
        if (isModal) {
            modalRouter.replace('/comment?' + queryString);
        } else {
            window.history.replaceState(null, '', '?' + queryString);
        }

        const data = await res.json();

        setCommentList(data.content);
        setTotalCount(data.totalElements);

        console.log('전체 데이터', data);
    }

    // Pagination 페이지 변경 이벤트
    const changePage = (pageNo_: number) => {
        pageNo.current = pageNo_;
        fetchData();
    }

    // item 선택 처리. checkedIdList에 항목 추가
    const checkItem = (id: number, checked: boolean) => {
        const alreadyChecked = checkedIdList.has(id);

        if(!checked && alreadyChecked) {
            setCheckedIdList(prev => new Set([...prev].filter(id_ => id_ !== id)));
        } else if(checked && !alreadyChecked) {
            setCheckedIdList(prev => new Set([...prev, id]));
        }
    }

    // 테이블 Row 클릭 이벤트
    const onTrClick = (e: MouseEvent<HTMLElement>, item: CommentForManagement) => {
        const checked = !checkedIdList.has(item.id);

        checkItem(item.id, checked);
    }

    // 삭제 버튼 이벤트
    const deleteItems = async () => {
        
        if(checkedIdList.size === 0) {
            alert('삭제할 항목을 선택하세요.');
            return;
        }

        if (!confirm('삭제하시겠습니까?\n\n(삭제된 댓글은 복구할 수 없습니다.)')) {
            return;
        }

        const url = '/admin/comment/' + Array.from(checkedIdList).join(',');

        console.log(url);
        
        const res = await fetchAPI(url,{method:"DELETE"});
        
        if (!res.ok) {
            alert("삭제 중 오류가 발생했습니다.\n잠시 후 다시 시도해 주십시오.");
            return;
        }

        await fetchData();
        
        setCheckedIdList(new Set());
        setCheckAll(false);
    }

    // 초기 로드
    useEffect(() => {
        setMounted(true);
    }, []);

    // 초기 로드 이후 이벤트
    useEffect(() => {
        if (!searchTypeRef.current || !searchWordRef.current) {
            return;
        }

        // querystring 조회 후 값 세팅
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
            <div className={`text-4xl font-bold ${isModal ? 'text-white' : 'text-sky-800'} text-center mt-2 p-5 rounded`}>
                댓글 관리
            </div>
            
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
                <div className={`p-5 grid grid-cols-[20%_60%_20%] justify-between items-center`}>
                    <div>
                        {
                            checkedIdList.size > 0 &&
                            <button className='bg-red-400 rounded text-white px-3 py-1 cursor-pointer' onClick={deleteItems}>선택 삭제</button>
                        }
                    </div>
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
                            }} className="w-full p-2.5 bg-white border border-sky-300 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <div></div>
                </div>
            }
            {
                commentList && commentList.length > 0 &&
                <Pagination totalCount={totalCount} numOfRows={numOfRows} pageNo={pageNo.current} changePage={changePage} className="" currClassName="bg-sky-200" liClassName="bg-sky-50" />
            }
        </>
    );
}