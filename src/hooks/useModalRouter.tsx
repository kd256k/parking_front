'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function useModalRouter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 현재 depth 가져오기 (없으면 1)
    const currentDepth = parseInt(searchParams.get('_depth_') || '1', 10);

    // 다음 단계로 이동하는 함수 (경로만 넣으면 depth 자동 계산)
    const push = (path: string, forceDepth?: number) => {
        // 이미 쿼리가 있는지 확인해서 ? 또는 & 붙이기
        const separator = path.includes('?') ? '&' : '?';
        const nextUrl = `${path}${separator}_depth_=${forceDepth? forceDepth : currentDepth + 1}`;
        router.push(nextUrl);
    };

    // 모달 닫기 함수
    const close = () => {
        if (currentDepth > 1) {
            window.history.go(-currentDepth);
        } else {
            router.back();
        }
    };

    return { currentDepth, push, close, router };
}
