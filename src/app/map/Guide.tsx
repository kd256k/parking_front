'use client'

import { showGuideAtom } from '@/atoms/atom';
import { useAtom } from 'jotai';
import { Dispatch, SetStateAction, useState } from 'react';
import { Nanum_Pen_Script, Yeon_Sung } from 'next/font/google';
import Image from 'next/image';
import Logo from '@/components/Logo';


const penFont = Nanum_Pen_Script({
    weight: '400',
});

const listFont = Yeon_Sung({
    weight: '400',
});

export default function Guide({ showGuideCurrent, setShowGuideCurrent }: { showGuideCurrent: boolean, setShowGuideCurrent: Dispatch<SetStateAction<boolean>> }) {
    const [_, setShowGuide] = useAtom<boolean>(showGuideAtom);

    const close = (disable = false) => {
        setShowGuide(!disable);

        setShowGuideCurrent(false);
    };


    return (<>
        {showGuideCurrent &&
            <div className='w-full h-screen inset-0 bg-black/50 flex items-center justify-between absolute top-0 left-0 z-100 text-white overflow-hidden'>
                <div className="w-1/3 h-full flex">
                    <div className="w-80">
                        <div className="m-2 rounded-full border-4 border-dashed border-white h-18"></div>
                        <div className="m-2 mt-8 rounded-[70px] border-4 border-dashed border-white h-80"></div>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col w-full h-full">
                            <div className="w-full h-1/3 flex flex-col">
                                <div className="w-full h-23 flex items-center">
                                    <span className={`${penFont.className} text-5xl font-bold text-shadow-lg text-shadow-black`}>
                                        필터 선택
                                    </span>
                                </div>

                                <div className="w-full flex-1 flex pt-[30%] items-center">
                                    <span className={`${penFont.className} text-5xl font-bold text-shadow-lg text-shadow-black`}>
                                        조회된 주차장 목록
                                    </span>
                                </div>
                            </div>
                            <div className="w-full h-1/3 flex flex-col items-center">
                                <div className="w-full h-full flex items-center">
                                    <div className="-ml-3 rounded-full border-4 border-dashed border-white w-11 h-18"></div>
                                    
                                    <span className={`${penFont.className} text-5xl font-bold text-shadow-lg text-shadow-black ml-5`}>
                                        패널 닫기
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-1/3 h-full flex flex-col justify-center'>
                    <div className='flex-1 flex flex-col justify-center items-center'>
                        <Image src="/logo.png" alt="logo" width={500} height={500} />
                        <div className="mt-15 text-3xl font-bold text-shadow-lg text-shadow-black/50">전국 주차장 정보 안내 시스템</div>
                        <div className={`${penFont.className} mt-2 mb-15 text-7xl font-bold text-shadow-lg text-shadow-black`}>
                            지도 활용 가이드
                        </div>

                        <div className="w-[80%] bg-gray-900/50 rounded-3xl">
                            <div className="grid grid-cols-[20%_80%] items-center w-full gap-y-10 my-5">
                                <div className="flex justify-center col-span-1">
                                    <img src="/marker/parking.svg" className="w-12"/>
                                </div>

                                <div className={`${listFont.className} text-4xl font-bold text-shadow-lg text-shadow-black`}>
                                    <div>주차장 마커</div>
                                    <div className="text-2xl mt-3">클릭하여 주차장 상세 정보 확인</div>
                                </div>

                                <div className="flex justify-center">
                                    <img src="/marker/parking-group.svg" className="w-12"/>
                                </div>
                                <div className={`${listFont.className} text-4xl font-bold text-shadow-lg text-shadow-black`}>
                                    <div>주차장 그룹 마커</div>
                                    <div className="text-2xl mt-3">클릭하여 같은 주소의 주차장 목록 확인</div>
                                </div>

                                <div className="mx-auto my-1 w-10 h-10 text-white font-bold flex items-center justify-center rounded-full text-sm" style={{
                                    backgroundColor: 'rgba(51, 204, 0, 0.8)',
                                    outline: '8px solid rgba(51, 204, 0, 0.3)',
                                }}>23</div>
                                <div className={`${listFont.className} text-4xl font-bold text-shadow-lg text-shadow-black`}>
                                    <div>밀집 구역의 주차장 개수</div>
                                    <div className="text-2xl mt-3">클릭하거나 확대해서 개별 주차장 확인</div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='h-22 py-5 flex justify-center'>
                        <button className="bg-sky-600 text-white px-4 rounded-lg text-2xl cursor-pointer mr-2" onClick={() => close(true)} >다시보지 않기</button>
                        <button className="bg-sky-600 text-white px-4 rounded-lg text-2xl cursor-pointer" onClick={() => close()} >닫기</button>
                    </div>
                </div>
                <div className="w-1/3 h-full flex flex-col">
                    <div className="h-1/2 flex">
                        <div className={`${penFont.className} text-6xl font-bold text-shadow-lg text-shadow-black flex-1 h-full text-right pt-20 pr-2`}>
                            <div>메뉴 열기</div>
                            <div className="text-4xl mt-3 flex justify-end">
                                <div className={`${listFont.className} font-light text-center`}>
                                    로그인<br/>목 록<br/>통 계<br/>소 개<br/>...
                                </div>                                
                            </div>
                        </div>
                        <div className="rounded-full border-4 border-dashed border-white w-18 h-18 m-3"></div>
                        
                    </div>
                    <div className="h-1/2 flex items-end">
                        <div className={`${penFont.className} text-6xl font-bold text-shadow-lg text-shadow-black flex-1 flex flex-col justify-end items-end h-full text-right pb-15 pr-2 gap-y-5`}>
                            <div>GPS를 사용한</div>
                            <div>내 위치 찾기</div>
                        </div>
                        <div className="rounded-full border-4 border-dashed border-white w-18 h-18 m-3"></div>
                    </div>
                </div>
            </div>
        }
    </>);
}