'use client'

import { loginUserAtom } from '@/atoms/atom';
import { User } from '@/types/user';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserInfo() {
    const router = useRouter();

    const [loginUser, setLoginUser] = useAtom<User | null>(loginUserAtom);

    const logout = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        if(res.ok) {
            //const json = await res.json();
            //debugger;

            setLoginUser(null);
            //sessionStorage.removeItem('jwtToken');
            //router.refresh();
        }
    };

    return (
        <div>
            {
                loginUser ?
                    <>
                        <span>
                            {loginUser.id} / {loginUser?.name} / {loginUser?.role}
                        </span>
                        <span className="ml-2 cursor-pointer" onClick={logout}>로그아웃</span>
                    </>
                    :
                    <Link href="/login">로그인</Link>
            }
        </div>
    )
}
