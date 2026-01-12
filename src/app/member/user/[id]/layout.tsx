'use client'

import { loginUserAtom } from '@/atoms/atom';
import { User } from '@/types/user';
import { useIsModal } from '@/utils/ModalUtil';
import { useAtom } from 'jotai';
import React from 'react';

export default function RootLayout({ children }: {children: React.ReactNode;}) {
    const isModal = useIsModal();
    
    const [loginUser, _] = useAtom<User | null>(loginUserAtom);

    if(!loginUser || loginUser.role !== 'ROLE_ADMIN') {
        return (<></>);
    }

    return (
        <div className={`${!isModal && 'mx-auto max-w-170'}`}>
            {children}
        </div>
    );
}