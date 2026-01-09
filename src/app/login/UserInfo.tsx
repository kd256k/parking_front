'use client'

import { loginUserAtom } from '@/atoms/atom';
import { User } from '@/types/user';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserCircle } from 'react-icons/fa';

export async function logout(setLoginUser?: React.Dispatch<React.SetStateAction<User | null>>) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    });

    if (setLoginUser) {
        setLoginUser(null);
    }

    return res.ok;
}

export default function UserInfo() {
    const [loginUser, setLoginUser] = useAtom<User | null>(loginUserAtom);

    return (
        <>
            {
                loginUser ?
                    <div className="grid grid-cols-[80%_20%] border-b border-sky-200">
                        <Link className="flex justify-start items-center hover:bg-sky-200 p-2" href="/member/myinfo">
                            <FaUserCircle className="text-sky-300" size={30} />
                            <div className="font-bold pl-1 pt-0.5 truncate">{loginUser.name}</div>
                        </Link>
                        <div onClick={() => logout(setLoginUser)} className="items-center p-2 pr-3 text-lg hover:bg-sky-200 cursor-pointer flex justify-center" title="로그아웃"><HiOutlineLogout /></div>
                    </div>
                    :
                    <Link href="/login" className="text-lg hover:bg-sky-200 px-3 py-2 cursor-pointer flex justify-start items-center">
                        <span>로그인</span>
                    </Link>
            }
        </>
    )
}
