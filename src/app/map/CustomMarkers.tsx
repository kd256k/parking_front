import { Parking, ParkingCluster, ParkingGroup } from "@/types/parking";
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";


const clusterSettings = [
    { limit: 100, size: 40, color: 'rgba(51, 204, 0, 0.8)', fontSize: '14px', outline: '8px solid rgba(51,204,0,0.3)' },   // 10개 미만 (하늘색)
    { limit: 500, size: 50, color: 'rgba(255, 187, 0, 0.9)', fontSize: '18px', outline: '8px solid rgba(255,187,0,0.3)' },  // 100개 미만 (노란색)
    { limit: 1000, size: 60, color: 'rgba(255, 94, 0, 0.8)', fontSize: '20px', outline: '8px solid rgba(255,94,0,0.3)' },  // 1000개 미만 (주황색)
    { limit: Infinity, size: 70, color: 'rgba(255, 0, 0, 0.8)', fontSize: '22px', outline: '8px solid rgba(255,0,0,0.3)' } // 그 이상 (빨간색)
];


export function SingleParkingMarker({ data, onClickMarker }: { data: Parking, onClickMarker: (data: Parking) => void }) {
    const parking = data;

    return (
        <MapMarker
            position={{ lat: parking.latitude, lng: parking.longitude }}
            title={parking.parkingName} // 마우스 오버 시 이름 표시
            onClick={() => parking.parkingId && onClickMarker(parking)}
            clickable={true}
            image={{
                src: "/marker/parking.svg", // 마커이미지 주소
                size: {
                    width: 50,
                    height: 50,
                }, // 마커이미지 크기
                options: {
                    offset: {
                        x: 25,
                        y: 50,
                    }, // 마커이미지 옵션. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정.
                },
            }}
        />
    );
}

export function GroupParkingMarker({ data, onClickMarker }: { data: ParkingGroup, onClickMarker: (data: ParkingGroup) => void }) {
    const parkingGroup = data;

    return (
        <MapMarker
            position={{ lat: parkingGroup.latitude, lng: parkingGroup.longitude }}
            title={parkingGroup.parkingList.map(p => p.parkingName).join(', ')} // 마우스 오버 시 이름 표시
            onClick={() => onClickMarker(parkingGroup)}
            clickable={true}
            image={{
                src: "/marker/parking-group.svg", // 마커이미지 주소
                size: {
                    width: 50,
                    height: 50,
                }, // 마커이미지 크기
                options: {
                    offset: {
                        x: 25,
                        y: 50,
                    }, // 마커이미지 옵션. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정.
                },
            }}
        />
    )
}

export function ClusterMarker({ data, onClickMarker }: { data: ParkingCluster, onClickMarker: (data: ParkingCluster) => void }) {
    
    const count = data.count ?? 1;

    const style = clusterSettings.find(setting => count < setting.limit);

    return (<CustomOverlayMap
            position={{ lat: data.latitude, lng: data.longitude }}
            clickable={true}
        >
            <div
                className="select-none rounded-full text-white flex items-center justify-center font-bold cursor-pointer"
                onClick={()=>onClickMarker(data)}
                style={{
                    width: `${style!.size}px`,
                    height: `${style!.size}px`,
                    backgroundColor: style!.color,
                    fontSize: style!.fontSize,
                    outline: style!.outline,
                }}
            >
                {data.count}
            </div>
        </CustomOverlayMap>)
}
