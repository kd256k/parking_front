import React, { useState } from 'react';
import { MdOutlineGpsFixed } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Parking } from '@/types/parking';

export default function MyLocationButton({
    selectedParking,
    setCenter,
    setMyLocation
}: {
    selectedParking: Parking | null;
    setCenter: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
    setMyLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }  | null>>;
}) {
    const [isLoadingLocation, setIsLoadingLocation] = useState(false); // 현재위치 로딩

    const handleMyLocation = () => {
        if (!navigator.geolocation) {
            alert('위치 정보를 사용할 수 없는 브라우저입니다.');
            return;
        }

        setIsLoadingLocation(true); // 로딩 시작

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setCenter(newPos);
                setMyLocation(newPos);
                setIsLoadingLocation(false); // 로딩 종료
            },
            (error) => {
                console.error(error);
                alert('위치 정보를 가져오는데 실패했습니다.');
                setIsLoadingLocation(false); // 에러 시에도 로딩 종료
            },
            { enableHighAccuracy: true }
        );
    };


    return (
        <>
            {/* 데스크탑용 버튼 */}
            <button
                onClick={handleMyLocation}
                disabled={isLoadingLocation}
                className={`
                            hidden md:flex absolute right-6 bottom-6 z-50 bg-sky-500 text-white p-3 rounded-full shadow-lg cursor-pointer
                            hover:bg-sky-600 transition-colors
                            ${isLoadingLocation ? 'cursor-wait opacity-80' : ''}
                        `}
                title="내 위치"
            >
                {isLoadingLocation ? <AiOutlineLoading3Quarters className="w-6 h-6 text-sky-100 animate-spin" /> : <MdOutlineGpsFixed className="w-6 h-6" />}
            </button>

            {/* 모바일용 버튼 (패널 높이에 따라 위치 자동 조정) */}
            <button
                onClick={handleMyLocation}
                disabled={isLoadingLocation}
                className={`
                        md:hidden absolute right-4 z-50 bg-white p-3 rounded-full shadow-lg text-gray-700 transition-all duration-300
                        ${selectedParking ? 'bottom-[calc(45vh+16px)]' : 'bottom-[calc(40vh+16px)]'}
                        ${isLoadingLocation ? 'cursor-wait opacity-80' : ''}
                    `}
            >
                {isLoadingLocation ? <AiOutlineLoading3Quarters className="w-6 h-6 text-sky-100 animate-spin" /> : <MdOutlineGpsFixed className="w-6 h-6" />}
            </button>
        </>
    );
}