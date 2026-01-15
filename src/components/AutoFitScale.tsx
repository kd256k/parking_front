'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';

export default function AutoFitScale({
  baseWidth = 1920, baseHeight = 1080, children,
}: {baseWidth?: number, baseHeight?: number, children: ReactNode}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const updateScale = () => {
    const container = containerRef.current;
    if (!container) return;

    // 1. 부모 컨테이너의 현재 크기
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // 2. 기준 해상도 (콘텐츠의 고정 크기)
    const targetWidth = baseWidth;
    const targetHeight = baseHeight;

    // 0 나눗셈 방지
    if (targetWidth === 0 || targetHeight === 0) return;

    // 3. 가로/세로 비율 중 더 작은 쪽을 택해 'contain' 효과 (전부 다 보이게)
    //    만약 꽉 채우려면(cover) Math.max 사용
    const widthRatio = containerWidth / targetWidth;
    const heightRatio = containerHeight / targetHeight;
    
    // 비율 유지하며 부모 안에 쏙 들어가는 스케일
    const newScale = Math.min(widthRatio, heightRatio);

    setScale(newScale);
  };

  useEffect(() => {
    window.addEventListener('resize', updateScale);
    
    // 초기 실행 (마운트 직후 레이아웃 잡힐 시간 확보)
    const timer = setTimeout(updateScale, 0);

    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timer);
    };
  }, [baseWidth, baseHeight]); // 해상도 바뀌면 재계산

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative flex items-center justify-center"
    >
      <div
        style={{
          // 1. 고정 해상도 크기 강제
          width: baseWidth,
          height: baseHeight,
          
          // 2. 스케일 적용 (중앙 정렬을 위해 transform 사용)
          transform: `scale(${scale})`,
          transformOrigin: 'center center', // 중앙 기준 축소/확대
          
          // 3. 레이아웃 붕괴 방지 (flex shrink 방지 등)
          flexShrink: 0, 
        }}
        className="overflow-hidden" // 내부 콘텐츠 스타일
      >
        {children}
      </div>
    </div>
  );
}
