'use client'

import { showGuideAtom } from '@/atoms/atom';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { FiArrowDownRight, FiArrowUpLeft, FiArrowUpRight } from "react-icons/fi";
import { Nanum_Pen_Script } from 'next/font/google';


const pen = Nanum_Pen_Script({
    weight: '400',
    subsets: ['latin'],
});
export default function Guide({ }) {
    const [_, setShowGuide] = useAtom<boolean>(showGuideAtom);

    const [showCurrent, setShowCurrent] = useState(true);

    const close = (disable = false) => {
        setShowGuide(!disable);

        setShowCurrent(false);
    };


    return (<>
        {showCurrent &&
            <div className='w-full h-screen inset-0 bg-black/50 flex items-center justify-between absolute top-0 left-0 z-100 text-white'>
                <div className="w-1/3 h-full flex">
                    {/* 초록 영역 */}
                    <div className="w-80 bg-green-500/50 relative">
                        <div className="m-2 rounded-full border-4 border-dashed border-white h-18"></div>
                        <div className="m-2 mt-8 rounded-[70px] border-4 border-dashed border-white h-80"></div>
                    </div>

                    {/* 노란 영역 (화살표 + 설명) */}
                    <div className="flex-1 bg-yellow-500/50 relative">
                        <div className="absolute left-0 top-[3%] flex items-center">
                            <div className="flex items-center mr-3">
                                {/* 🔺 화살촉 (먼저!) */}
                                <div
                                    className="w-0 h-0 -mr-[2px] border-t-6 border-b-6 border-r-10 border-t-transparent border-b-transparent border-l-white"
                                />

                                {/* ─ 화살표 선 */}
                                <div className="w-9 h-[3px] bg-white rounded-full"></div>
                            </div>

                            <span className={`${pen.className} text-4xl font-bold`}>
                                필터 선택
                            </span>
                        </div>


                        <div className="absolute left-0 top-1/3 -translate-y-1/2 flex items-center">
                          
                            <div className="flex items-center mr-3">
                                {/* 🔺 화살촉 (먼저!) */}
                                <div
                                    className="w-0 h-0 -mr-[2px] border-t-6 border-b-6 border-r-10 border-t-transparent border-b-transparent border-l-white"
                                />

                                {/* ─ 화살표 선 */}
                                <div className="w-9 h-[3px] bg-white rounded-full"></div>
                            </div>
                            <span className={`${pen.className} text-4xl font-bold`}>
                                조회된 주차장 목록</span>
                        </div>
                    </div>
                </div>
                <div className='w-1/3 h-full flex flex-col justify-center'>
                     <div className="absolute top-3 rounded-full border-4 border-dashed flex items-center justify-center border-white w-18 h-18"></div>
                     <div className="pr-10 mt-10 ml-30 text-2xl font-bold">지정한 구역의 주차장 목록 수</div>
                     <div className='flex-1 bg-red-500/50'>
                        <div style={{
                            margin: '20px',
                            width: '40px',
                            height: '40px',
                            backgroundColor: 'rgba(51, 204, 0, 0.8)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            outline: '8px solid rgba(51, 204, 0, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '40px'
                        }}>23</div>
                    </div>
                    <div className='h-20 py-5 flex justify-center'>
                        <button className="bg-sky-600 text-white px-3 py-2 rounded-md cursor-pointer mr-2" onClick={() => close(true)} >다시보지 않기</button>
                        <button className="bg-sky-600 text-white px-3 py-2 rounded-md cursor-pointer" onClick={() => close()} >닫기</button>
                    </div>
                </div>
                <div className="w-1/3 h-full flex flex-col">
                    
                    <div className="h-1/2 bg-green-500/50">
                    <div className="absolute top-6 right-6 rounded-full border-4 border-dashed flex items-center justify-center border-white w-18 h-18"></div>
                    <div className="absolute top-6 right-23 pr-10 text-2xl font-bold">메뉴 열기</div>   
                    </div>
                    <div className="h-full relative bg-yellow-500/50">
                    
                    <div className="absolute bottom-6 right-6 rounded-full border-4 border-dashed flex items-center justify-center border-white w-18 h-18"></div>
                        <div className='pr-20 pb-20 h-full flex flex-col justify-end items-end'>
                            <div className="pr-10 text-2xl font-bold">현재 위치 찾기</div>
                        </div>
                    </div>
                </div>
            </div>
        }
    </>);
}