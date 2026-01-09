'use client'

import { loginUserAtom } from '@/atoms/atom';
import { User } from '@/types/user';
import { useAtom } from 'jotai';
import Link from 'next/link';
import React from 'react';
import { RxOpenInNewWindow } from "react-icons/rx";

export default function MenuAdmin() {
    const [loginUser, _] = useAtom<User | null>(loginUserAtom);

    return (<>
        {
            (loginUser && loginUser.role === 'ROLE_ADMIN') &&
            <div className='border-t border-sky-200'>
                <div className="grid grid-cols-[80%_20%]">
                    <Link href="/member" className="text-lg hover:bg-sky-200 px-3 py-2 cursor-pointer">사용자 관리</Link>
                    <a href="/member" target="_blank" className="text-lg hover:bg-sky-200 px-3 pt-3 cursor-pointer flex justify-center" title="새 탭으로 열기"><RxOpenInNewWindow /></a>
                </div>
            </div>
        }
    </>);
}