'use client';

import { useRouter } from 'next/navigation';
import { useModalRouter } from '@/utils/ModalUtil';

export default function BackButton({ children, className }: { children: React.ReactNode, className: string }) {
    const router = useRouter();

    const { push, close, currentDepth } = useModalRouter();

    return (
        currentDepth > 1 ?
        <button
            onClick={() => router.back()}
            className={className}
        >
            {children}
        </button>
        :
        <></>
    );
}
