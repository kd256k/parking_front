'use client'

import { showGuideAtom } from '@/atoms/atom';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { FiArrowDownRight } from "react-icons/fi";

export default function Guide({}) {
    const [ _, setShowGuide] = useAtom<boolean>(showGuideAtom);

    const [ showCurrent, setShowCurrent ] = useState(true);

    const close = (disable = false) => {
        setShowGuide(!disable);

        setShowCurrent(false);
    }

    return (<>
        { showCurrent && 
            <div className='w-full h-screen inset-0 bg-black/50 flex items-center justify-between absolute top-0 left-0 z-100 text-white'>
                <div className="w-1/3 h-full flex">
                    <div className="w-80 bg-green-500/50">
                        영역1
                    </div>
                    <div className="flex-1 bg-yellow-500/50">
                        영역2
                    </div>
                </div>
                <div className='w-1/3 h-full flex flex-col justify-center'>
                    <div className='flex-1 bg-red-500/50'>
                        영역3
                    </div>
                    <div className='h-20 py-5 flex justify-center'>
                        <button className="bg-sky-600 text-white px-3 py-2 rounded-md cursor-pointer mr-2" onClick={()=>close(true)} >다시보지 않기</button>
                        <button className="bg-sky-600 text-white px-3 py-2 rounded-md cursor-pointer" onClick={()=>close()} >닫기</button>
                    </div>
                </div>
                <div className="w-1/3 h-full flex flex-col">
                    <div className="h-1/2 bg-green-500/50">
                        영역4
                    </div>
                    <div className="h-1/2 bg-yellow-500/50">
                        <div className='pr-20 pb-20 h-full flex flex-col justify-end items-end'>
                            <div className="pr-10 text-2xl font-bold">자기 위치 찾기</div>
                            <FiArrowDownRight className="text-4xl"/>
                        </div>
                    </div>
                </div>
            </div>
        }
    </>);
}