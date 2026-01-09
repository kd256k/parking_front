'use client'

import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

export default function MiniMap({ pos }: { pos: { lat: number, lng: number } }) {
    const [loading, error] = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY!,
        // 필요하면 libraries: ['services'] 같은 것도 여기서
    })

    if (loading) return <div />
    if (error) return <div>kakao map load error</div>

    return (
        <Map center={pos} level={7} className="w-full h-full rounded-xl" draggable={false} zoomable={false}>
            <MapMarker position={pos}
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
        </Map>
    );
}