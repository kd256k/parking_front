import { Parking, ParkingGroup } from '@/types/parking';
import React, { Dispatch, SetStateAction } from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';

export default function ParkingGroupList({ selectedParkingGroup, setSelectedParking, setSelectedParkingGroup, setMainOpen }
    : { selectedParkingGroup: ParkingGroup, setSelectedParking: Dispatch<SetStateAction<Parking | null>>, setSelectedParkingGroup: Dispatch<SetStateAction<ParkingGroup | null>>, setMainOpen: Dispatch<SetStateAction<boolean>> }) {
    return (
        <CustomOverlayMap
            position={{ lat: selectedParkingGroup.latitude, lng: selectedParkingGroup.longitude }}
            clickable={true}
            xAnchor={0}
            yAnchor={0}
        >
            {/* 커스텀 디자인 영역 */}
            <div className="bg-sky-50 rounded shadow-lg border border-sky-300 relative">
                {
                    selectedParkingGroup.parkingList.map((p, idx) =>
                        <div key={`${p.parkingId}-${idx}`}
                            className='px-4 py-2 text-sky-900 border-b border-sky-200 hover:bg-sky-200 cursor-pointer'
                            onClick={() => {
                                setSelectedParking(p);
                                setSelectedParkingGroup(null);
                                setMainOpen(true);
                            }}
                        >
                            {p.parkingName}
                        </div>)
                }
            </div>
        </CustomOverlayMap>
    );
}