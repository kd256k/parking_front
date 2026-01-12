'use client'

import Pagination from "@/components/Pagination";
import TailSelect from "@/components/TailSelect";
import TailTable from "@/components/TailTable";
import { Enableds, Roles } from "@/constants/user";
import { TailTableHeader } from "@/types/tailtable";
import { Member } from "@/types/user";
import { fetchAPI } from "@/utils/fetchAPI";
import { useIsModal, useModalRouter } from "@/utils/ModalUtil";
import { filter } from "framer-motion/client";
import { MouseEvent, useEffect, useRef, useState } from "react";


const SearchTypes = {
    ID: 'ID',
    NAME: '이름',
}



export default function MemberPage() {
    const isModal = useIsModal();

    const { push, router: modalRouter } = useModalRouter();

    const headers: TailTableHeader<Member>[] = [
        { key: 'id', name: 'ID', className: 'text-center w-[20%]', cell: (_, value) => <span>{value.indexOf('|') > -1 ? value.split('|')[1] : value}</span> },
        { key: 'provider', name: 'SNS', className: 'text-center w-[20%]', cell: (item, _) => <span>{item.id.indexOf('|') > -1 ? item.id.split('|')[0].toUpperCase() : 'ID / PW'}</span> },
        { key: 'name', name: '이름', className: 'text-center w-[20%]' },
        { key: 'role', name: '회원 등급', className: 'text-center w-[20%]', cell: (_, value) => <span>{Roles[value as keyof typeof Roles]}</span> },
        { key: 'enabled', name: '활성화 여부', className: 'text-center w-[20%]', cell: (_, value) => <span>{value ? 'Ｏ' : 'Ｘ'}</span> },
    ];

    const [filterLoaded, setFilterLoaded] = useState<boolean>(false);
    const [memberList, setMemberList] = useState<Member[] | null>(null);

    // 필터
    const [filterRole, setFilterRole] = useState<string>('');
    const [filterEnabled, setFilterEnabled] = useState<string>('');

    const [numOfRows, setNumOfRows] = useState<number>(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const pageNo = useRef<number>(1);

    // select/input ref
    const selectRoleRef = useRef<HTMLSelectElement | null>(null);
    const selectEnabledRef = useRef<HTMLSelectElement | null>(null);
    const searchTypeRef = useRef<HTMLSelectElement | null>(null);
    const searchWordRef = useRef<HTMLInputElement | null>(null);

    const fetchData = async () => {
        const params = {
            'role': filterRole,
            'enabled': filterEnabled,
            'searchType': String(searchTypeRef.current?.value),
            'searchWord': String(searchWordRef.current?.value),
            'page': String(pageNo.current),
            'size': String(numOfRows),
        }

        const queryString = new URLSearchParams(params).toString();


        const res = await fetchAPI(`/admin/member/search?${queryString}`);

        if (!res.ok) {
            console.error("data fetch Err");
            alert("목록을 불러오는데 실패했습니다.\n잠시 후 다시 시도해 주십시오.");
            return;
        }


        if (isModal) {
            modalRouter.replace('/member?' + queryString);
        } else {
            window.history.replaceState(null, '', '?' + queryString);
        }

        const data = await res.json();

        setMemberList(data.content);
        setTotalCount(data.totalElements);

        //console.log(data);
    }

    const changePage = (pageNo_: number) => {
        pageNo.current = pageNo_;
        fetchData();
    }

    const onTrClick = (e: MouseEvent<HTMLElement>, value: Member) => {

        const url = `/member/user/${value.id}`;

        if (isModal) {
            push(url);
        } else {
            window.location.href = url;
        }
    }

    const prependAllToList = (allStr: string, list: string[]) => {
        return [allStr, ...list];
    }

    useEffect(() => {
        if (!filterLoaded) {
            return;
        }

        pageNo.current = 1;
        fetchData();
    }, [filterRole, filterEnabled])

    useEffect(() => {
        if (!filterLoaded) {
            return;
        }

        fetchData();
    }, [filterLoaded]);

    useEffect(() => {
        const filters = new URLSearchParams(location.search);

        setFilterRole(filters.get('region') || '');
        setFilterEnabled(filters.get('regionSub') || '');
        searchTypeRef.current!.value = filters.get('category') || 'ID';
        searchWordRef.current!.value = filters.get('type') || '';
        pageNo.current = parseInt(filters.get('page') || '1');
        setNumOfRows(parseInt(filters.get('size') || '10'));

        setFilterLoaded(true);
    }, []);

    return (
        <>
            <div className="p-5 grid grid-cols-4 space-x-5 bg-sky-50 rounded-lg">
                <TailSelect ref={selectRoleRef}
                    opk={prependAllToList('', Object.keys(Roles))}
                    opv={prependAllToList(':: 전체 ::', Object.values(Roles))}
                    title="등급"
                    value={filterRole}
                    setValue={setFilterRole} />

                <TailSelect ref={selectEnabledRef}
                    opk={prependAllToList('', Object.keys(Enableds))}
                    opv={prependAllToList(':: 전체 ::', Object.values(Enableds))}
                    title="활성화"
                    value={filterEnabled}
                    setValue={setFilterEnabled}
                />

                <TailSelect ref={searchTypeRef}
                    opk={Object.keys(SearchTypes)}
                    opv={Object.values(SearchTypes)}
                    title="검색 조건" />

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        검색어
                    </label>
                    <input type="text" ref={searchWordRef} onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            fetchData();
                        }
                    }} className="w-full p-2.5 bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 "/>
                </div>
            </div>
            {
                memberList === null ?
                    <div className="text-xl font-bold text-center bg-sky-50 mt-2 p-5 rounded">조회중입니다...</div>
                    :
                    memberList.length > 0 ?
                        <>
                            <TailTable className={`mt-3`} headers={headers} data={memberList}
                                theadClassName="bg-sky-500 border-sky-400"
                                trClassName="bg-sky-100 border-sky-200 hover:bg-sky-200 text-sky-900"
                                firstTdClassName="text-sky-900"
                                onTrClick={onTrClick}
                            />
                            <Pagination totalCount={totalCount} numOfRows={numOfRows} pageNo={pageNo.current} changePage={changePage} className="m-5" currClassName="bg-sky-200" liClassName="bg-sky-50" />
                        </>
                        :
                        <div className="text-xl font-bold text-center bg-sky-600 text-white mt-2 p-5 rounded">조회된 항목이 없습니다.</div>
            }
        </>
    );
}