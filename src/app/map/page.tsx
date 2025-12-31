'use client';

import Script from 'next/script';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { useEffect, useState } from 'react';
import { fetchAPI } from '@/utils/fetchAPI';
import { Parking, ParkingCluster, ParkingGroup } from '@/types/parking';

import { User } from '@/types/user';
import { useAtom } from 'jotai';
import { loginUserAtom } from '@/atoms/atom';
import Menu from '@/components/Menu';
import MyLocationButton from './MyLocationButton';
import DesktopPanel from './DesktopPanel';
import MobilePanel from './MobilePanel';
import ClusterMarker from './ClusterMarker';
import MyLocationMarker from './MyLocationMarker';

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&autoload=false`;//&libraries=services,clusterer`;



export default function Page() {
    const [loginUser, setLoginUser] = useAtom<User | null>(loginUserAtom);

    const [loaded, setLoaded] = useState(false);
    const [mapObj, setMapObj] = useState<kakao.maps.Map | null>(null);

    const [center, setCenter] = useState({ lat: 35.18, lng: 129.05 });
    const [level, setLevel] = useState(8);

    const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);

    // 패널 상태
    const [mainOpen, setMainOpen] = useState(true);
    const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
    const [selectedParkingGroup, setSelectedParkingGroup] = useState<ParkingGroup | null>(null);

    // 주차장 목록
    const [parkings, setParkings] = useState<Parking[]>([]);
    const [parkingClusters, setParkingClusters] = useState<ParkingCluster[]>([]);
    const [parkingGroups, setParkingGroups] = useState<ParkingGroup[]>([]);

    // 지도 Relayout (패널 열림/닫힘 시 지도 깨짐 방지)
    useEffect(() => {
        if (!mapObj) return;
        const t = setTimeout(() => {
            try {
                mapObj.relayout();
            } catch { }
        }, 350); // 애니메이션 시간(300ms) 고려
        return () => clearTimeout(t);
    }, [mapObj, mainOpen, selectedParking]);



    const reloadList = async (append = true) => {
        if (!mapObj) return;

        //var center = mapObj.getCenter();
        //console.log("현재 중심 좌표:", center.getLat(), center.getLng());

        // const params = {
        //     latitude: center.getLat(),
        //     longitude: center.getLng()
        // };

        //const queryString = new URLSearchParams(params).toString();
        //const res = await fetchAPI(`/parking?${queryString}`);

        const mapBounds = mapObj.getBounds();

        // 2. 남서쪽(South-West) 좌표: minLat, minLng
        const sw = mapBounds.getSouthWest();

        // 3. 북동쪽(North-East) 좌표: maxLat, maxLng
        const ne = mapBounds.getNorthEast();

        // 4. 상태 업데이트 및 콘솔 확인
        const newBounds = {
            minLatitude: String(sw.getLat()),
            minLongitude: String(sw.getLng()),
            maxLatitude: String(ne.getLat()),
            maxLongitude: String(ne.getLng()),
            kakaoZoomLevel: String(mapObj.getLevel())
        };

        const queryString = new URLSearchParams(newBounds).toString();
        const res = await fetchAPI(`/parking/fromBounds?${queryString}`);


        if (!res.ok) {
            if (res.status !== 401) {
                console.log('목록 읽기 실패');
                alert('목록 읽기 실패');
            }
            return;
        }

        const data = await res.json();
        //console.log(json);

        const parkings = data.parkings || [];
        const parkingClusters = data.parkingClusters || [];
        const parkingGroups = data.parkingGroups || [];

        setParkings(parkings);
        setParkingClusters(parkingClusters);
        setParkingGroups(parkingGroups);
    };


    const onClusterclick = (_target: any, cluster: any) => {
        const map = mapObj!;
        // 현재 지도 레벨에서 1레벨 확대한 레벨
        const level = map.getLevel() - 1;

        // 지도를 클릭된 클러스터의 마커의 위치를 기준으로 확대합니다
        map.setLevel(level, { anchor: cluster.getCenter() });
    };


    const onMapDragEnd = (map: kakao.maps.Map) => {
        const center = map.getCenter();
        setCenter({ lat: center.getLat(), lng: center.getLng() });

        reloadList(false);
    }

    const onMapZoomChanged = (map: kakao.maps.Map) => {
        const level = map.getLevel();
        setLevel(level);

        reloadList(false);
    }

    return (
        <>
            <Script
                src={KAKAO_SDK_URL}
                strategy="afterInteractive"
                onLoad={() => window.kakao.maps.load(() => setLoaded(true))}
            />

            <main className="relative w-screen h-screen overflow-hidden bg-gray-100">
                {/* ======================= */}
                {/* 지도 영역 (배경)     */}
                {/* ======================= */}
                <div className="absolute inset-0 z-0">
                    {loaded ? (
                        <Map
                            center={center}
                            className="w-full h-full"
                            level={level}
                            isPanto
                            onCreate={setMapObj}
                            onZoomChanged={onMapZoomChanged}
                            onDragEnd={onMapDragEnd}
                        >
                            {[...parkings, ...parkingClusters, ...parkingGroups].map((p, idx) => (
                                <ClusterMarker
                                    // 고유 ID가 없으면 좌표 조합해서 key 생성 (리렌더링 최적화)
                                    key={`${p.latitude}-${p.longitude}-${idx}`}
                                    data={p}
                                    onClickMarker={(data) => {
                                        console.log("주차장 상세 클릭:", data);
                                        // 여기서 상세 모달(Modal) 띄우기 로직 실행
                                        if ('parkingList' in data) {
                                            const parkingGroup = data as ParkingGroup;
                                            setSelectedParkingGroup(parkingGroup);
                                            setSelectedParking(parkingGroup.parkingList[0]);
                                            setMainOpen(true);
                                        } else {
                                            setSelectedParking(data as Parking);
                                            setMainOpen(true);
                                        }
                                    }}
                                />
                            ))}

                            {myLocation && <MyLocationMarker position={myLocation} />}
                            {/* 마커 예시 */}

                            {selectedParkingGroup && <CustomOverlayMap
                                position={{ lat: selectedParkingGroup.latitude, lng: selectedParkingGroup.longitude }}
                                clickable={true}
                                yAnchor={1}
                            >
                                {/* 커스텀 디자인 영역 */}
                                <div className="bg-white p-2 rounded shadow-lg border border-gray-300 relative">
                                    {
                                        selectedParkingGroup.parkingList.map((p, idx) =>
                                            <div key={`${p.parkingId}-${idx}`}
                                                className='p-2 hover:bg-gray-200 cursor-pointer'
                                                onClick={()=>{
                                                    setSelectedParking(p);
                                                    setSelectedParkingGroup(null);
                                                    setMainOpen(true);
                                                }}
                                            >
                                                {p.parkingName}
                                            </div>)
                                    }

                                    {/* 닫기 버튼 */}
                                    <button
                                        onClick={() => setSelectedParkingGroup(null)}
                                        className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                                    >
                                        X
                                    </button>
                                </div>
                            </CustomOverlayMap>}
                        </Map>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-500">
                            지도를 불러오는 중...
                        </div>
                    )}
                </div>


                {/* ======================= */}
                {/* 데스크탑 패널 (md+)  */}
                {/* ======================= */}
                <DesktopPanel parkingLots={[...parkings, ...parkingGroups.map(p => p.parkingList).flat()]}
                    selectedParking={selectedParking}
                    setSelectedParking={setSelectedParking}
                    mainOpen={mainOpen}
                    setMainOpen={setMainOpen}
                    reloadList={reloadList} />


                {/* ======================= */}
                {/* 모바일 패널 (< md)   */}
                {/* ======================= */}
                <MobilePanel parkingLots={[...parkings, ...parkingGroups.map(p => p.parkingList).flat()]}
                    selectedParking={selectedParking}
                    setSelectedParking={setSelectedParking}
                    mainOpen={mainOpen}
                    setMainOpen={setMainOpen}
                    reloadList={reloadList} />



                {/* ======================= */}
                {/* 내 위치 버튼 (FAB)   */}
                {/* ======================= */}
                <MyLocationButton setCenter={setCenter} setMyLocation={setMyLocation} selectedParking={selectedParking} />



                {/* ======================= */}
                {/* 메뉴 버튼 (FAB)   */}
                {/* ======================= */}
                <Menu />
            </main>
        </>
    );
}
