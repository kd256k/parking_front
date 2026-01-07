import React, { useState } from 'react';
import { IoMenu } from "react-icons/io5";
import Link from 'next/link';
import { Logout } from '@/app/login/UserInfo';
import { User } from '@/types/user';
import { useAtom } from 'jotai';
import { loginUserAtom } from '@/atoms/atom';
import { RxOpenInNewWindow } from "react-icons/rx";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserCircle } from 'react-icons/fa';

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
                        absolute right-6 top-6 z-50 bg-sky-500 text-white p-3 rounded-full shadow-lg 
                        hover:bg-sky-600 transition-colors
                    `}
                title="메뉴"
            >
                <IoMenu className="w-6 h-6"/>
            </button>

            {
                <>
                    <div className={`absolute flex flex-col right-6 top-20 z-50 bg-sky-50 rounded-lg shadow-lg overflow-hidden
                        text-gray-700 transition-all
                        ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                        `}
                        onClick={()=>setMenuOpen(false)}>
                        {
                            loginUser ?
                            <div className="grid grid-cols-[70%_30%] border-b border-gray-200">
                                <div className="flex justify-start items-center hover:bg-sky-200 p-2">
                                    <FaUserCircle className="text-sky-300" size={30} />
                                    <div className="font-bold pl-1 pt-0.5">{loginUser.name}</div>
                                </div>
                                <div onClick={()=>Logout(setLoginUser)} className="flex justify-end items-center p-2 pr-3 text-lg hover:bg-sky-200 cursor-pointer" title="로그아웃"><HiOutlineLogout /></div>
                            </div>
                            :
                            <Link href="/login" className="text-lg hover:bg-sky-200 px-3 py-2 cursor-pointer">로그인</Link>
                        }
                        
                        <div className="grid grid-cols-[70%_30%]">
                            <Link href="/board" className="text-lg hover:bg-sky-200 px-3 py-2 cursor-pointer">목록</Link>
                            <a href="/board" target="_blank" className="text-lg hover:bg-sky-200 px-3 pt-3 cursor-pointer" title="새 탭으로 열기"><RxOpenInNewWindow /></a>
                        </div>
                        <div className="grid grid-cols-[70%_30%]">
                            <Link href="/dashboard" className="text-lg hover:bg-sky-200 px-3 py-2 cursor-pointer">통계</Link>
                            <a href="/dashboard" target="_blank" className="text-lg hover:bg-sky-200 px-3 pt-3 cursor-pointer" title="새 탭으로 열기"><RxOpenInNewWindow /></a>
                        </div>
                        <Link href="/about" className="text-lg hover:bg-sky-200 px-3 py-2 cursor-pointer">프로그램에 대해</Link>
                    </div>
                    <div className={`absolute w-screen h-screen left-0 top-0 z-40
                        ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                    `} onClick={()=>setMenuOpen(false)}></div>
                </>
            }
        </>
    );
}