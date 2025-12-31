import { Parking } from '@/types/parking';
import React from 'react';

export default function MobilePanel({
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
            {/* 모바일: 리스트 (바텀 시트) - selected 없을 때만 보임 */}
            <div
                className={`
                        md:hidden 
                        absolute left-0 bottom-0 w-full h-[40vh] bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-30 rounded-t-2xl flex flex-col
                        transition-transform duration-300 ease-in-out
                        ${selectedParking ? 'translate-y-full' : 'translate-y-0'}
                `}
            >
                <div className="p-4 bg-blue-600 text-white rounded-t-2xl font-bold text-center shrink-0">
                    주차장 목록
                </div>
                <div className="flex-1 overflow-y-auto p-2 pb-8">
                    {parkingLots.map((p) => (
                        <button
                            key={p.parkingId}
                            onClick={() => setSelectedParking(p)}
                            className="w-full text-left p-4 border-b border-gray-100 active:bg-gray-50"
                        >
                            <div className="font-bold text-gray-800">{p.parkingName}</div>
                            <div className="text-sm text-gray-500">{p.addressRoad}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* 모바일: 상세 (바텀 시트) - selected 있을 때만 보임 */}
            <div
                className={`
                        md:hidden 
                        absolute left-0 bottom-0 w-full h-[45vh] bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-40 rounded-t-2xl flex flex-col
                        transition-transform duration-300 ease-in-out
                        ${selectedParking ? 'translate-y-0' : 'translate-y-full'}
                `}
            >
                <div className="p-4 border-b bg-gray-50 rounded-t-2xl flex justify-between items-center shrink-0">
                    <h2 className="font-bold text-gray-800">상세 정보</h2>
                    <button onClick={() => setSelectedParking(null)} className="text-gray-500 p-2">닫기</button>
                </div>

                {selectedParking && (
                    <div className="p-5 overflow-y-auto pb-10">
                        <h3 className="text-xl font-bold text-gray-900">{selectedParking.parkingName}</h3>
                        <p className="text-gray-600 mt-1">{selectedParking.addressRoad}</p>
                        <div className="mt-4 inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm">
                            {selectedParking.parkingSpaces}면 보유
                        </div>
                        <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                            길찾기 시작
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}