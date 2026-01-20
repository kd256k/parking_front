'use client';

import { Map, useKakaoLoader } from 'react-kakao-maps-sdk';
import { use, useEffect, useState } from 'react';
import { fetchAPI } from '@/utils/fetchAPI';
import { Parking, ParkingCluster, ParkingGroup } from '@/types/parking';

import Menu, { MenuItem, MenuLink, menuLinkClassName } from '@/components/Menu';
import MyLocationButton from './MyLocationButton';
import DesktopPanel from './DesktopPanel';
import MobilePanel from './MobilePanel';
import { ClusterMarker, GroupParkingMarker, SingleParkingMarker } from './CustomMarkers';
import MyLocationMarker from './MyLocationMarker';
import { useModalEvents, useModalRouter } from '@/utils/ModalUtil';
import ParkingGroupList from './ParkingGroupList';
import { useAtom } from 'jotai';
import { showGuideAtom } from '@/atoms/atom';
import Guide from './Guide';
import UserInfo from '../login/UserInfo';
import MenuAdmin from '@/components/MenuAdmin';


export default function Page() {

    const [mounted, setMounted] = useState(false);

    const [startShowGuide, setStartShowGuide] = useAtom(showGuideAtom);

    const [mapObj, setMapObj] = useState<kakao.maps.Map | null>(null);

    const [mapLoading, mapError] = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY!,
        // 필요하면 libraries: ['services']
    });

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

    // 필터
    const [parkingCategory, setParkingCategory] = useState<string>('');
    const [parkingType, setParkingType] = useState<string>('');
    const [feeInfo, setFeeInfo] = useState<string>('');

    const { push: modalPush } = useModalRouter();

    const { setModalEventHandlers } = useModalEvents()


    // 가이드 표시 여부
    const [showGuideCurrent, setShowGuideCurrent] = useState(true);

    // 모달 이벤트
    useEffect(() => {
        setModalEventHandlers({
            // (사용예)
            //onOpen: ({ segment, segments }) => console.log('map sees open', segments),
            //onClose: ({segment, segments}) => console.log('map sees close', segments),
            //onChange: ({ from, to }) => console.log('map sees change', from, to)
            onClose: ({segment:_, segments}) => {
                // 모달 닫을때 주차장 선택 해제
                if(segments && segments.length === 3 && segments[1] === '(.)board') {
                    setSelectedParking(null);
                }
            }
        })
        return () => setModalEventHandlers({})
    }, [setModalEventHandlers])


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

    useEffect(() => {
        if (!mapObj) return;

        reloadList();
    }, [mapObj, parkingCategory, parkingType, feeInfo, center, level])

    useEffect(() => {
        if (selectedParking != null) {
            modalPush(`/board/${selectedParking.parkingId}`, 1);
        }
    }, [selectedParking]);

    useEffect(()=>{
        setMounted(true);
    },[]);

    const showGuide = () => {
        setMainOpen(true);
        setStartShowGuide(true);
        setShowGuideCurrent(true);
    }

    if(!mounted) return;


    const reloadList = async () => {
        if (!mapObj) return;

        const mapBounds = mapObj.getBounds();

        // 남서쪽(South-West) 좌표: minLat, minLng
        const sw = mapBounds.getSouthWest();

        // 북동쪽(North-East) 좌표: maxLat, maxLng
        const ne = mapBounds.getNorthEast();

        const cond = {
            minLatitude: String(sw.getLat()),
            minLongitude: String(sw.getLng()),
            maxLatitude: String(ne.getLat()),
            maxLongitude: String(ne.getLng()),
            kakaoZoomLevel: String(mapObj.getLevel()),

            category: parkingCategory,
            type: parkingType,
            feeInfo: feeInfo,
        };

        const queryString = new URLSearchParams(cond).toString();
        const res = await fetchAPI(`/parking/fromBounds?${queryString}`);


        if (!res.ok) {
            if (res.status !== 401) {
                //console.log('목록 읽기 실패');
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

    const onMapDragEnd = (map: kakao.maps.Map) => {
        const center = map.getCenter();
        setCenter({ lat: center.getLat(), lng: center.getLng() });
    }

    const onMapZoomChanged = (map: kakao.maps.Map) => {
        const level = map.getLevel();
        setLevel(level);
    }



    return (
        <>
            {startShowGuide && <Guide showGuideCurrent={showGuideCurrent} setShowGuideCurrent={setShowGuideCurrent} />}
            <main className="relative w-screen h-screen overflow-hidden bg-gray-100">
                {/* ======================= */}
                {/* 지도 영역 (배경)     */}
                {/* ======================= */}
                <div className="absolute inset-0 z-0">
                    {
                        mapLoading || mapError ? 
                            <div className="flex items-center justify-center w-full h-full text-gray-500">
                                {mapError ? 'kakao map load error' : mapLoading ? '지도를 불러오는 중...' : ''}
                            </div>
                        : (
                            <Map
                                center={center}
                                className="w-full h-full"
                                level={level}
                                isPanto
                                onCreate={setMapObj}
                                onZoomChanged={onMapZoomChanged}
                                onDragEnd={onMapDragEnd}
                                onClick={() => { setSelectedParkingGroup(null) }}
                            >
                                {
                                    // 기본 단일 마커
                                    parkings.map((p, idx) => (
                                        <SingleParkingMarker key={p.parkingId} data={p} onClickMarker={() => {
                                            setSelectedParking(p);
                                            //setMainOpen(true);
                                        }} />
                                    ))
                                }

                                {
                                    // 동일 좌표 그룹 마커
                                    parkingGroups.map((pg, idx) => (
                                        <GroupParkingMarker key={`group_${pg.latitude}_${pg.longitude}`} data={pg} onClickMarker={() => {
                                            setSelectedParkingGroup(pg);
                                            //setSelectedParking(pg.parkingList[0]);
                                            //setMainOpen(true);
                                        }} />
                                    ))
                                }

                                {
                                    // 클러스터 마커
                                    parkingClusters.map((pc, idx) => (
                                        <ClusterMarker key={`cluster_${pc.latitude}_${pc.longitude}`} data={pc} onClickMarker={() => {
                                            const map = mapObj!;
                                            map.setCenter(new kakao.maps.LatLng(pc.latitude, pc.longitude));

                                            const currentLevel = map.getLevel();
                                            map.setLevel(currentLevel - 2, { animate: true });
                                        }} />
                                    ))
                                }

                                {myLocation && <MyLocationMarker position={myLocation} />}
                                {selectedParkingGroup && <ParkingGroupList selectedParkingGroup={selectedParkingGroup} setSelectedParking={setSelectedParking} setSelectedParkingGroup={setSelectedParkingGroup} setMainOpen={setMainOpen}/>}

                            </Map>
                        )
                    }
                </div>


                {/* ======================= */}
                {/* 데스크탑 패널 (md+)  */}
                {/* ======================= */}
                <DesktopPanel parkingLots={[...parkings, ...parkingGroups.map(p => p.parkingList).flat()]}
                    selectedParking={selectedParking}
                    setSelectedParking={setSelectedParking}
                    parkingClusters={parkingClusters}
                    mainOpen={mainOpen}
                    setMainOpen={setMainOpen}
                    reloadList={reloadList}
                    parkingCategory={parkingCategory}
                    setParkingCategory={setParkingCategory}
                    parkingType={parkingType}
                    setParkingType={setParkingType}
                    feeInfo={feeInfo}
                    setFeeInfo={setFeeInfo}
                />


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
                <Menu>
                    <UserInfo />
                        
                    <MenuItem href="/board" title="주차장 목록" />
                    <MenuItem href="/dashboard" title="주차장 현황 통계" />
                    
                    <div className='border-b border-sky-200'></div>

                    <div className={menuLinkClassName} onClick={()=>showGuide()}>가이드 보기</div>
                    <MenuLink href="/about" title="프로그램에 대해" />
                    
                    <MenuAdmin />
                </Menu>
            </main>
        </>
    );
}
