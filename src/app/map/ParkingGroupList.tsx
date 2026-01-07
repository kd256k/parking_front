import { Parking, ParkingGroup } from '@/types/parking';
import React, { Dispatch, SetStateAction } from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';

export default function ParkingGroupList({ selectedParkingGroup, setSelectedParking, setMainOpen }
    : { selectedParkingGroup: ParkingGroup, setSelectedParking: Dispatch<SetStateAction<Parking | null>>, setMainOpen: Dispatch<SetStateAction<boolean>> }) {
    return (
        <CustomOverlayMap
            position={{ lat: selectedParkingGroup.latitude, lng: selectedParkingGroup.longitude }}
            clickable={true}
            xAnchor={0}
            yAnchor={0}
        >
            {/* 커스텀 디자인 영역 */}
            <div className="bg-white p-2 rounded shadow-lg border border-gray-300 relative">
                {
                    selectedParkingGroup.parkingList.map((p, idx) =>
                        <div key={`${p.parkingId}-${idx}`}
                            className='p-2 hover:bg-gray-200 cursor-pointer'
                            onClick={() => {
                                setSelectedParking(p);
                                //setSelectedParkingGroup(null);
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