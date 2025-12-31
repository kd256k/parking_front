import { Parking } from '@/types/parking';
import React from 'react';

import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

export default function DesktopPanel({
    parkingLots,
    selectedParking,
    setSelectedParking,
    mainOpen,
    setMainOpen,
    reloadList
}: {
    parkingLots: Parking[];
    selectedParking: Parking | null;
    setSelectedParking: React.Dispatch<React.SetStateAction<Parking | null>>;
    mainOpen: boolean;
    setMainOpen: React.Dispatch<React.SetStateAction<boolean>>;
    reloadList: (append: boolean) => void;
}) {
    return (
        <>
            {/* 컨테이너: 메인+상세 패널을 감싸서 한 번에 움직임 */}
            <div
                className={`
                    md:flex
                    absolute top-0 left-0 h-full z-20 pointer-events-none /* 컨테이너는 클릭 통과 */
                `}
            >
                <div className={`hidden h-full md:flex transition-transform duration-300 ease-in-out ${mainOpen ? 'translate-x-0' : '-translate-x-full'} /* 메인 닫히면 전체 퇴장 */`}>

                    {/* [좌측] 메인 리스트 패널 */}
                    <div className="w-80 h-full bg-white shadow-xl flex flex-col pointer-events-auto border-r z-30">
                        <div className="p-4 border-b bg-blue-600 text-white flex justify-between items-center shrink-0">
                            <h1 className="font-bold text-lg">주차장 목록</h1>
                            <div>
                                <button
                                onClick={() => reloadList(false)}
                                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm transition-colors"
                                >
                                    갱신
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {parkingLots.map((p) => (
                                <button
                                    key={p.parkingId}
                                    onClick={() => setSelectedParking(p)}
                                    className={`w-full text-left p-4 border-b transition-colors hover:bg-gray-50 
                                        ${selectedParking?.parkingId === p.parkingId ? 'bg-blue-50 border-blue-200' : 'border-gray-100'}`}
                                >
                                    <div className="font-bold text-gray-800">{p.parkingName}</div>
                                    <div className="text-sm text-gray-500 mt-1">{p.parkingCategory} / {p.parkingType} / {p.feeInfo}</div>
                                    <div className="text-sm text-gray-500 mt-1">{p.addressRoad || p.addressJibun}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* [우측] 상세 정보 패널 (메인 패널 옆에 붙음) */}
                    <div
                        className={`
                                h-full bg-white shadow-xl flex flex-col pointer-events-auto border-l z-20
                                transition-all duration-300 ease-in-out overflow-hidden
                                ${selectedParking ? 'w-72 opacity-100' : 'w-0 opacity-0'} /* 너비 조절로 여닫기 */
                            `}
                    >
                        {/* 내부 컨텐츠 너비(w-72) 고정: 패널이 줄어들 때 내용이 찌그러지지 않게 함 */}
                        <div className="w-72 flex flex-col h-full">
                            <div className="p-4 border-b bg-gray-50 flex justify-between items-center shrink-0">
                                <h2 className="font-bold text-gray-700">상세 정보</h2>
                                <button
                                    onClick={() => setSelectedParking(null)}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {selectedParking && (
                                <div className="p-5 overflow-y-auto flex-1">
                                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4">🅿️</div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedParking.parkingName}</h3>
                                    <p className="text-gray-600 mt-2 text-sm">{selectedParking.addressRoad}</p>

                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Capacity</p>
                                        <p className="text-blue-600 font-bold text-lg">{selectedParking.parkingSpaces}면</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 데스크탑: 패널 열기 버튼 */}
                <div
                    className={`
                        hidden h-full md:flex absolute
                            transition-all duration-300 items-center gap-2
                        ${mainOpen ? selectedParking ? 'left-152' : 'left-80' : 'left-0'}
                    `}
                >
                    <button className="font-bold text-sm bg-white py-5 px-1 rounded-r-md shadow-lg text-gray-700 hover:bg-gray-50 pointer-events-auto" onClick={() => setMainOpen(!mainOpen)}>
                        {mainOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
                    </button>
                </div>
            </div>
        </>
    );
}