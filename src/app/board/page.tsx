'use client'

import Pagination from '@/components/Pagination';
import TailSelect from '@/components/TailSelect';
import TailTable from '@/components/TailTable';
import { feeInfoList, parkingCategoryList, parkingTypeList } from '@/constants/parking';
import { useIsModal } from '@/contexts/ModalContext';
import { useModalRouter } from '@/hooks/useModalRouter';
import { Parking } from '@/types/parking';
import { TailTableHeader } from '@/types/tailtable';
import { fetchAPI } from '@/utils/fetchAPI';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';

export default function BoardPage() {
    const isModal = useIsModal();

    const { push, close, currentDepth } = useModalRouter();

    const headers: TailTableHeader<Parking>[] = [
        { key: 'parkingName', name: '주차장명', className: 'text-center' },
        { key: 'parkingCategory', name: '주차장구분', className: 'text-center' },
        { key: 'parkingType', name: '주차장유형', className: 'text-center' },
        { key: 'feeInfo', name: '요금정보', className: 'text-center' },
        { key: 'regionMain', name: '지역구분', className: 'text-center' },
        { key: 'regionSub', name: '지역상세', className: 'text-center' },
    ];

    const [parkingList, setParkingList] = useState<Parking[]>([]);

    const [regionMainList, setRegionMainList] = useState<string[]>([]);
    const [regionSubList, setRegionSubList] = useState<string[]>([]);


    // 필터
    const [regionMain, setRegionMain] = useState<string>('');
    const [regionSub, setRegionSub] = useState<string>('');
    const [parkingCategory, setParkingCategory] = useState<string>('');
    const [parkingType, setParkingType] = useState<string>('');
    const [feeInfo, setFeeInfo] = useState<string>('');
    const [numOfRows, setNumOfRows] = useState<number>(10);
    const [totalCount, setTotalCount] = useState<number>(0);

    const pageNo = useRef<number>(1);

    // select ref
    const regionMainRef = React.useRef<HTMLSelectElement | null>(null);
    const regionSubRef = React.useRef<HTMLSelectElement | null>(null);
    const parkingCategoryRef = React.useRef<HTMLSelectElement | null>(null);
    const parkingTypeRef = React.useRef<HTMLSelectElement | null>(null);
    const feeInfoRef = React.useRef<HTMLSelectElement | null>(null);

    const fetchData = async () => {
        const params = {
            'region': regionMain,
            'regionSub': regionSub,
            'category': parkingCategory,
            'type': parkingType,
            'feeInfo': feeInfo,
            'page': String(pageNo.current - 1),
            'size': String(numOfRows)
        }

        const queryString = new URLSearchParams(params).toString();


        const res = await fetchAPI(`/parking/search?${queryString}`);

        if (!res.ok) {
            console.error("data fetch Err");
            alert("목록을 불러오는데 실패했습니다.\n잠시 후 다시 시도해 주십시오.");
            return;
        }

        const data = await res.json();


        setParkingList(data.content);
        setTotalCount(data.totalElements);

        console.log(data);
    }

    const fetchRegion = async (region?: string) => {
        const url = '/parking/region' + (region ? '?region=' + region : '');
        const res = await fetchAPI(url);

        if(!res.ok) {
            return;
        }

        const data = await res.json();

        if(region) {
            setRegionSubList(data);
        } else {
            setRegionMainList(data);
        }
    }


    const changePage = (pageNo_: number) => {
        pageNo.current = pageNo_;
        fetchData();
    }

    const onTrClick = (e: MouseEvent<HTMLElement>, value: Parking) => {

        const url = `/board/${value.parkingId}`;

        push(url);
    }

    const prependAllToList = (allStr: string, list:string[]) => {
        return [allStr, ...list];
    }

    useEffect(() => {
        pageNo.current = 1;
        fetchData();
    }, [regionMain, regionSub, parkingCategory, parkingType, feeInfo])

    useEffect(()=>{
        setRegionMainList([]);
        fetchRegion();
    }, []);

    useEffect(()=>{
        setRegionSubList([]);
        if(regionMain) {
            fetchRegion(regionMain);
        } else {
            
        }
    }, [regionMain]);

    return (
        <div>
            <div className="p-5 grid grid-cols-5 space-x-5 bg-amber-50 rounded-lg">
                <TailSelect ref={regionMainRef}
                    opk={prependAllToList('', regionMainList)}
                    opv={prependAllToList(':: 전국 ::', regionMainList)}
                    title="지역구분"
                    value={regionMain}
                    setValue={setRegionMain} />

                <TailSelect ref={regionSubRef}
                    opk={prependAllToList('', regionSubList)}
                    opv={prependAllToList(':: 전체 ::', regionSubList)}
                    title="지역상세"
                    value={regionSub}
                    setValue={setRegionSub}
                    disabled={regionSubList.length == 0}
                     />

                <TailSelect ref={parkingCategoryRef}
                    opk={prependAllToList('', parkingCategoryList)}
                    opv={prependAllToList(':: 전체 ::', parkingCategoryList)}
                    title="주차장구분"
                    value={parkingCategory}
                    setValue={setParkingCategory} />

                <TailSelect ref={parkingTypeRef}
                    opk={prependAllToList('', parkingTypeList)}
                    opv={prependAllToList(':: 전체 ::', parkingTypeList)}
                    title="주차장유형"
                    value={parkingType}
                    setValue={setParkingType} />

                <TailSelect ref={feeInfoRef}
                    opk={prependAllToList('', feeInfoList)}
                    opv={prependAllToList(':: 전체 ::', feeInfoList)}
                    title="요금정보"
                    value={feeInfo}
                    setValue={setFeeInfo} />
            </div>
            {
                parkingList.length > 0 ?
                <>
                    <TailTable className={`mt-3`} headers={headers} data={parkingList}
                        theadClassName="bg-yellow-600 border-yellow-400"
                        trClassName="bg-yellow-100 border-yellow-200 hover:bg-yellow-200 text-yellow-900"
                        firstTdClassName="text-yellow-900"
                        onTrClick={onTrClick}
                    />
                    <Pagination totalCount={totalCount} numOfRows={numOfRows} pageNo={pageNo.current} changePage={changePage} className="m-5" />
                </>
                :
                <div className="text-xl font-bold text-center bg-yellow-50 mt-2 p-5 rounded">조회된 항목이 없습니다.</div>
            }
        </div>
    );
}