'use client'

import { useIsModal } from '@/utils/ModalUtil';
import React from 'react';

export default function RootLayout({ children }: {children: React.ReactNode;}) {
    const isModal = useIsModal();
    return (
        <div className={`${!isModal && 'mx-auto max-w-270'}`}>
            {children}
        </div>
    );
}