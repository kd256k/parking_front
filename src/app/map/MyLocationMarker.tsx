import { CustomOverlayMap } from 'react-kakao-maps-sdk';
import { motion } from "framer-motion";

export default function MyLocationMarker({ position }: { position: { lat: number, lng: number } }) {
    return (
        <CustomOverlayMap
            position={position} >
            <div className="relative flex items-center justify-center">
                <motion.div
                    className="absolute rounded-full w-5 h-5 -ml-2.5 -mt-2.5 border-8 border-sky-500"
                    animate={{
                        scale: [1, 3, 3],
                        opacity: [1, 0, 0],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeOut"
                    }}
                />
                <div className="w-5 h-5 -ml-2.5 -mt-2.5 bg-sky-100 rounded-full flex items-center justify-center font-bold border-4 border-sky-700"
                ></div>
            </div>
        </CustomOverlayMap >
    );
}