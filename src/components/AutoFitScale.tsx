'use client';

import { useRef, useState, useEffect } from 'react';

export default function AutoFitScale({ ratio='aspect-video', children }: { ratio?: string, children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    const updateScale = () => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;

        // 1. 컨테이너 높이
        const containerHeight = container.clientHeight;

        // 2. 컨텐츠의 '원래' 높이를 구하기 위해 임시로 스케일 리셋 후 측정하고 싶지만,
        // 간단히 현재 scrollHeight와 scale 역산을 이용하거나, 
        // 브라우저가 레이아웃을 다시 잡도록 유도해야 합니다.
        // 여기서는 content.scrollHeight가 스케일링 전 실제 높이를 반영한다고 가정합니다.

        // 하지만 가장 확실한 방법은 "일단 너비 100%일 때의 높이"를 아는 것입니다.
        // 여기서는 간단하게 "현재 높이가 넘치면 줄인다"는 로직을 반복 보정합니다.

        const contentHeight = content.scrollHeight;

        if (contentHeight > containerHeight && contentHeight > 0) {
            const newScale = containerHeight / contentHeight;
            // 너무 작아지지 않게 최소값(0.2) 제한
            setScale(Math.max(newScale, 0.2));
        } else {
            setScale(1);
        }
    };

    useEffect(() => {
        // 윈도우 리사이즈 대응
        window.addEventListener('resize', updateScale);

        // 초기 실행 (약간의 지연을 주어 렌더링 완료 후 측정)
        const timer = setTimeout(updateScale, 100);

        return () => {
            window.removeEventListener('resize', updateScale);
            clearTimeout(timer);
        };
    }, [children]);

    // 역수 너비 계산 (scale이 0.5면 width는 200%)
    const inverseWidth = `${(1 / scale) * 100}%`;

    return (
        <div
            ref={containerRef}
            className={`w-full ${ratio} overflow-hidden relative bg-white border`}
        >
            <div
                ref={contentRef}
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left', // 중요: 왼쪽 위 기준
                    width: inverseWidth,         // 중요: 줄어든 만큼 너비 늘리기
                    height: 'auto',
                }}
                className="absolute top-0 left-0"
            >
                {children}
            </div>
        </div>
    );
}
