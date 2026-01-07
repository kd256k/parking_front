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
            <MapMarker position={pos} />
        </Map>
    );
}