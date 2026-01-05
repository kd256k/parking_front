import React, { useState } from 'react';
import { IoMenu } from "react-icons/io5";
import Link from 'next/link';
import { Logout } from '@/app/login/UserInfo';
import { User } from '@/types/user';
import { useAtom } from 'jotai';
import { loginUserAtom } from '@/atoms/atom';

export default function Menu() {
    const [loginUser, setLoginUser] = useAtom<User | null>(loginUserAtom);

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
                        absolute right-6 top-6 z-50 bg-white p-3 rounded-full shadow-lg 
                        hover:bg-gray-50 text-gray-700 transition-colors
                    `}
                title="메뉴"
            >
                <IoMenu className="w-6 h-6"/>
            </button>

            {
                <>
                    <div className={`absolute flex flex-col right-6 top-20 z-50 bg-white rounded-lg shadow-lg overflow-hidden
                        text-gray-700 transition-all
                        ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                        `}
                        onClick={()=>setMenuOpen(false)}>
                        {
                            loginUser ?
                            <div className="px-3 py-2">
                                <div className="font-bold mb-2 border-b border-gray-200">{loginUser.name}</div>
                                <div onClick={()=>Logout(setLoginUser)} className="text-lg hover:bg-gray-50 cursor-pointer">로그아웃</div>
                            </div>
                            :
                            <Link href="/login" className="text-lg hover:bg-gray-50 px-3 py-2 cursor-pointer">로그인</Link>
                        }
                        
                        <Link href="/board" className="text-lg hover:bg-gray-50 px-3 py-2 cursor-pointer">목록</Link>
                        <Link href="/dashboard" className="text-lg hover:bg-gray-50 px-3 py-2 cursor-pointer">통계</Link>
                        <Link href="/about" className="text-lg hover:bg-gray-50 px-3 py-2 cursor-pointer">프로그램에 대해</Link>
                    </div>
                    <div className={`absolute w-screen h-screen left-0 top-0 z-40
                        ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                    `} onClick={()=>setMenuOpen(false)}></div>
                </>
            }
        </>
    );
}