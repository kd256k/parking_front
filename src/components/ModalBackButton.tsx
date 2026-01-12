'use client';

import { useRouter } from 'next/navigation';
import { useModalRouter } from '@/utils/ModalUtil';

export default function ModalBackButton({ children, className }: { children: React.ReactNode, className: string }) {
    const router = useRouter();

    const { currentDepth } = useModalRouter();

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
