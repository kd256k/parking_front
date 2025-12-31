import React from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';

export default function MyLocationMarker({ position }: { position: { lat: number, lng: number } }) {
    return (
        <CustomOverlayMap
            position={position} >
            <div
                style={{
                    width: `20px`,
                    height: `20px`,
                    marginLeft: '-10px',
                    marginTop: '-10px',
                    backgroundColor: 'white',
                    borderRadius: "50%",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    boxShadow: '0px 0px 3px 2px rgba(0,0,0,0.8)',
                    border: '4px solid rgba(66, 135, 245, 1)',
                    outline: '18px solid rgba(66, 135, 245, 0.3)'
                }}
            ></div>
        </CustomOverlayMap>
    );
}