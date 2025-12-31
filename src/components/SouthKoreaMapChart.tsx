import React from 'react';
import { SimpleSouthKoreaMapChart } from 'react-simple-south-korea-map-chart';


export interface SouthKoreaMapChartProps {
    darkMode?: boolean;
    data: any;
    unit?: string;
    setColorByCount: (count: number) => string;
    customTooltip?: (data: any) => React.ReactNode;
    selectedRegion?: string;
    setSelectedRegion?: React.Dispatch<React.SetStateAction<string>>;
    diagonalSize?: number;
    diagonalWidth?: number;
    diagonalColor?: string;
    selectedColor?: string;
    selectedStrokeColor?: string;
    hoverColor?: string;
    hoverStrokeColor?: string;
    initialRegion?: string;
}

export default function SouthKoreaMapChart({
    darkMode = false,
    data,
    unit,
    setColorByCount,
    customTooltip,
    selectedRegion = '',
    setSelectedRegion,
    diagonalSize=5,
    diagonalWidth=2,
    diagonalColor='rgba(0,0,0,0.5)',
    selectedColor='#ff6347',
    selectedStrokeColor='black',
    hoverColor='#fafa41',
    hoverStrokeColor='black',
    initialRegion='전국'
} : SouthKoreaMapChartProps ) {

    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if(!setSelectedRegion) return;

        const target = e.target as SVGElement;
        
        if (target.tagName === "path") {
            const locationName = target.getAttribute("name");
            if (locationName) {
                if(locationName === selectedRegion) {
                    setSelectedRegion(initialRegion);
                } else {
                    setSelectedRegion(locationName);
                }
            }
        }
    };
    
    return (
        <div className="custom-map-style" onClick={handleWrapperClick}>

            <SimpleSouthKoreaMapChart
                darkMode={darkMode}
                data={data}
                unit={unit}
                customTooltip={customTooltip}
                setColorByCount={setColorByCount}
            />

            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <pattern id="diagonal-stripe" patternUnits="userSpaceOnUse" width={diagonalSize} height={diagonalSize} patternTransform="rotate(45)">
                        <rect width={diagonalSize} height={diagonalSize} fill={selectedColor} />
                        <line x1="0" y1="0" x2="0" y2={diagonalSize} stroke={diagonalColor} strokeWidth={diagonalWidth} />
                    </pattern>
                </defs>
            </svg>

            <style jsx global>{`
                .custom-map-style path[name=${selectedRegion}] {
                    fill: url(#diagonal-stripe) !important;
                    stroke: ${selectedStrokeColor};
                }

                .custom-map-style path:hover {
                    fill: ${hoverColor};
                    stroke: ${hoverStrokeColor};
                }
            `}</style>
        </div>
    );
}