'use client'

import Pagination from '@/components/Pagination';
import TailSelect from '@/components/TailSelect';
import TailTable from '@/components/TailTable';
import { feeInfoList, parkingCategoryList, parkingTypeList } from '@/constants/parking';
import { useIsModal } from '@/utils/ModalUtil';
import { useModalRouter } from '@/utils/ModalUtil';
import { Parking } from '@/types/parking';
import { TailTableHeader } from '@/types/tailtable';
import { fetchAPI } from '@/utils/fetchAPI';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';

export default function BoardPage() {
    const isModal = useIsModal();

    const { push, router:modalRouter } = useModalRouter();

    const headers: TailTableHeader<Parking>[] = [
        { key: 'parkingName', name: '주차장명', className: 'text-center' },
        { key: 'parkingCategory', name: '주차장구분', className: 'text-center' },
        { key: 'parkingType', name: '주차장유형', className: 'text-center' },
        { key: 'feeInfo', name: '요금정보', className: 'text-center' },
        { key: 'regionMain', name: '지역구분', className: 'text-center' },
        { key: 'regionSub', name: '지역상세', className: 'text-center' },
    ];

    const [filterLoaded, setFilterLoaded] = useState<boolean>(false);
    const [parkingList, setParkingList] = useState<Parking[]|null>(null);

    const [regionMainList, setRegionMainList] = useState<string[]>([]);
    const [regionSubList, setRegionSubList] = useState<string[]>([]);


    // 필터
    const [filterRegionMain, setFilterRegionMain] = useState<string>('');
    const [filterRegionSub, setFilterRegionSub] = useState<string>('');
    const [filterParkingCategory, setFilterParkingCategory] = useState<string>('');
    const [filterParkingType, setFilterParkingType] = useState<string>('');
    const [filterFeeInfo, setFilterFeeInfo] = useState<string>('');
    
    const [numOfRows, setNumOfRows] = useState<number>(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const pageNo = useRef<number>(1);

    // select ref
    const selectRegionMainRef = useRef<HTMLSelectElement | null>(null);
    const selectRegionSubRef = useRef<HTMLSelectElement | null>(null);
    const selectParkingCategoryRef = useRef<HTMLSelectElement | null>(null);
    const selectParkingTypeRef = useRef<HTMLSelectElement | null>(null);
    const selectFeeInfoRef = useRef<HTMLSelectElement | null>(null);

    const fetchData = async () => {
        const params = {
            'region': filterRegionMain,
            'regionSub': filterRegionSub,
            'category': filterParkingCategory,
            'type': filterParkingType,
            'feeInfo': filterFeeInfo,
            'page': String(pageNo.current),
            'size': String(numOfRows)
        }

        const queryString = new URLSearchParams(params).toString();


        const res = await fetchAPI(`/parking/search?${queryString}`);

        if (!res.ok) {
            console.error("data fetch Err");
            alert("목록을 불러오는데 실패했습니다.\n잠시 후 다시 시도해 주십시오.");
            return;
        }

        
        if(isModal) {
            modalRouter.replace('/board?' + queryString);
        } else {
            window.history.replaceState(null, '', '?' + queryString);
        }

        const data = await res.json();

        setParkingList(data.content);
        setTotalCount(data.totalElements);

        //console.log(data);
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
            setFilterLoaded(true);
        }
    }


    const changePage = (pageNo_: number) => {
        pageNo.current = pageNo_;
        fetchData();
    }

    const onTrClick = (e: MouseEvent<HTMLElement>, value: Parking) => {

        const url = `/board/${value.parkingId}`;

        if(isModal) {
            push(url);
        } else {
            window.location.href = url;
        }
    }

    const prependAllToList = (allStr: string, list:string[]) => {
        return [allStr, ...list];
    }

    useEffect(() => {
        if(!filterLoaded) {
            return;
        }

        pageNo.current = 1;
        fetchData();
    }, [filterRegionMain, filterRegionSub, filterParkingCategory, filterParkingType, filterFeeInfo])

    useEffect(() => {
        if(!filterLoaded) {
            return;
        }

        fetchData();
    }, [filterLoaded])

    useEffect(()=>{
        setRegionSubList([]);
        if(filterRegionMain) {
            fetchRegion(filterRegionMain);
        }
    }, [filterRegionMain]);

    useEffect(()=>{
        const filters = new URLSearchParams(location.search);

        setFilterRegionMain(filters.get('region') || '');
        setFilterRegionSub(filters.get('regionSub') || '');
        setFilterParkingCategory(filters.get('category') || '');
        setFilterParkingType(filters.get('type') || '');
        setFilterFeeInfo(filters.get('feeInfo') || '');
        pageNo.current = parseInt(filters.get('page') || '1');
        setNumOfRows(parseInt(filters.get('size') || '10'));

        //setRegionMainList([]);
        fetchRegion();
    }, []);

    return (
        <>
            <div className="p-5 grid grid-cols-5 space-x-5 bg-sky-50 rounded-lg">
                <TailSelect ref={selectRegionMainRef}
                    opk={prependAllToList('', regionMainList)}
                    opv={prependAllToList(':: 전국 ::', regionMainList)}
                    title="지역구분"
                    value={filterRegionMain}
                    setValue={setFilterRegionMain} />

                <TailSelect ref={selectRegionSubRef}
                    opk={prependAllToList('', regionSubList)}
                    opv={prependAllToList(':: 전체 ::', regionSubList)}
                    title="지역상세"
                    value={filterRegionSub}
                    setValue={setFilterRegionSub}
                    disabled={regionSubList.length == 0}
                     />

                <TailSelect ref={selectParkingCategoryRef}
                    opk={prependAllToList('', parkingCategoryList)}
                    opv={prependAllToList(':: 전체 ::', parkingCategoryList)}
                    title="주차장구분"
                    value={filterParkingCategory}
                    setValue={setFilterParkingCategory} />

                <TailSelect ref={selectParkingTypeRef}
                    opk={prependAllToList('', parkingTypeList)}
                    opv={prependAllToList(':: 전체 ::', parkingTypeList)}
                    title="주차장유형"
                    value={filterParkingType}
                    setValue={setFilterParkingType} />

                <TailSelect ref={selectFeeInfoRef}
                    opk={prependAllToList('', feeInfoList)}
                    opv={prependAllToList(':: 전체 ::', feeInfoList)}
                    title="요금정보"
                    value={filterFeeInfo}
                    setValue={setFilterFeeInfo} />
            </div>
            {
                parkingList === null ?
                <div className="text-xl font-bold text-center bg-sky-50 mt-2 p-5 rounded">조회중입니다...</div>
                :
                parkingList.length > 0 ?
                <>
                    <TailTable className={`mt-3`} headers={headers} data={parkingList}
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