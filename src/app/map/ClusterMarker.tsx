import { Parking, ParkingCluster, ParkingGroup } from "@/types/parking";
import { MapMarker, CustomOverlayMap, useMap } from "react-kakao-maps-sdk";

interface ClusterProps {
    data: Parking | ParkingCluster | ParkingGroup;
    onClickMarker: (data: Parking | ParkingGroup) => void;
}

const clusterSettings = [
    { limit: 100, size: 40, color: 'rgba(51, 204, 0, 0.8)', fontSize: '14px', outline: '8px solid rgba(51,204,0,0.3)' },   // 10개 미만 (하늘색)
    { limit: 500, size: 50, color: 'rgba(255, 187, 0, 0.9)', fontSize: '18px', outline: '8px solid rgba(255,187,0,0.3)' },  // 100개 미만 (노란색)
    { limit: 1000, size: 60, color: 'rgba(255, 94, 0, 0.8)', fontSize: '20px', outline: '8px solid rgba(255,94,0,0.3)' },  // 1000개 미만 (주황색)
    { limit: Infinity, size: 70, color: 'rgba(255, 0, 0, 0.8)', fontSize: '22px', outline: '8px solid rgba(255,0,0,0.3)' } // 그 이상 (빨간색)
];

export default function ClusterMarker({ data, onClickMarker }: ClusterProps) {
    const map = useMap(); // 현재 지도 객체 가져오기

    // 1. 단일 마커일 경우 (일반 마커 렌더링)
    if ('parkingId' in data) {
        const parking = data as Parking;

        if (parking.parkingId) {
            return (
                <MapMarker
                    position={{ lat: parking.latitude, lng: parking.longitude }}
                    title={parking.parkingName} // 마우스 오버 시 이름 표시
                    onClick={() => parking.parkingId && onClickMarker(parking)}
                    clickable={true}
                />
            );
        }
    }

    if ('parkingList' in data) {
        const parkingGroup = data as ParkingGroup;

        return (
            <MapMarker
                position={{ lat: parkingGroup.latitude, lng: parkingGroup.longitude }}
                title={parkingGroup.parkingList.map(p => p.parkingName).join(', ')} // 마우스 오버 시 이름 표시
                onClick={() => onClickMarker(parkingGroup)}
                clickable={true}
                image={{
                    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // 마커이미지의 주소입니다
                    size: {
                        width: 64,
                        height: 69,
                    }, // 마커이미지의 크기입니다
                    options: {
                        offset: {
                            x: 27,
                            y: 69,
                        }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                    },
                }}
            />
        );
    }

    // 2. 클러스터일 경우 (커스텀 오버레이 렌더링)
    // 개수에 따라 크기나 색상을 다르게 줄 수 있음

    const cluster = data as ParkingCluster;

    const count = cluster.count ?? 1;

    const style = clusterSettings.find(setting => count < setting.limit);

    return (
        <CustomOverlayMap
            position={{ lat: cluster.latitude, lng: cluster.longitude }}
            clickable={true}
        >
            <div
                onClick={() => {
                    map.setCenter(new kakao.maps.LatLng(cluster.latitude, cluster.longitude));

                    const currentLevel = map.getLevel();
                    map.setLevel(currentLevel - 2, { animate: true });
                }}
                style={{
                    width: `${style!.size}px`,
                    height: `${style!.size}px`,
                    backgroundColor: style!.color,
                    borderRadius: "50%",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: style!.fontSize,
                    outline: style!.outline,
                    // boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    cursor: "pointer"
                }}
            >
                {cluster.count}
            </div>
        </CustomOverlayMap>
    );
}
