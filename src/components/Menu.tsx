import { useState } from 'react';
import { IoMenu } from "react-icons/io5";
import Link from 'next/link';
import UserInfo from '@/app/login/UserInfo';
import { RxOpenInNewWindow } from "react-icons/rx";
import MenuAdmin from './MenuAdmin';

export default function Menu() {

    // 메뉴 상태
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <button
                onClick={handleMenu}
                className={`
                        absolute right-6 top-6 z-50 bg-sky-500 text-white p-3 rounded-full shadow-lg 
                        hover:bg-sky-600 transition-colors
                    `}
                title="메뉴"
            >
                <IoMenu className="w-6 h-6"/>
            </button>

            {
                <>
                    <div className={`absolute w-50 flex flex-col right-6 top-20 z-50 bg-sky-50 rounded-lg shadow-lg overflow-hidden
                        text-gray-700 transition-all
                        ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                        `}
                        onClick={()=>setMenuOpen(false)}>
                        <UserInfo />
                        
                        <div className="grid grid-cols-[80%_20%]">
                            <Link href="/board" className="text-lg hover:bg-sky-200 px-3 py-2 cursor-pointer">목록</Link>
                            <a href="/board" target="_blank" className="text-lg hover:bg-sky-200 px-3 pt-3 cursor-pointer flex justify-center" title="새 탭으로 열기"><RxOpenInNewWindow /></a>
                        </div>
                        <div className="grid grid-cols-[80%_20%]">
                            <Link href="/dashboard" className="text-lg hover:bg-sky-200 px-3 py-2 cursor-pointer">통계</Link>
                            <a href="/dashboard" target="_blank" className="text-lg hover:bg-sky-200 px-3 pt-3 cursor-pointer flex justify-center" title="새 탭으로 열기"><RxOpenInNewWindow /></a>
                        </div>
                        <Link href="/about" className="text-lg hover:bg-sky-200 px-3 py-2 cursor-pointer">프로그램에 대해</Link>
                        
                        <MenuAdmin />
                    </div>
                    <div className={`absolute w-screen h-screen left-0 top-0 z-40
                        ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                    `} onClick={()=>setMenuOpen(false)}></div>
                </>
            }
        </>
    );
}