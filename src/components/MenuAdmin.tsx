'use client'

import { loginUserAtom } from '@/atoms/atom';
import { User } from '@/types/user';
import { useAtom } from 'jotai';
import { MenuItem } from './Menu';

export default function MenuAdmin() {
    const [loginUser, _] = useAtom<User | null>(loginUserAtom);

    return (<>
        {
            (loginUser && loginUser.role === 'ROLE_ADMIN') &&
            <div className='border-t border-sky-200'>
                <div className="text-sm font-bold text-sky-700 pl-3 pt-2 pb-1">관리자 메뉴</div>
                <MenuItem href="/member" title="사용자 관리" />
                <MenuItem href="/comment" title="댓글 관리" />
            </div>
        }
    </>);
}