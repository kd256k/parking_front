'use client';

import { useRef, useState, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
  ratio?: number; // 기본값 16:9 (0.5625)
  className?: string;
}

export default function AspectScroll({ 
  children, 
  ratio = 9 / 16, 
  className = "" 
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updateMaxHeight = () => {
      if (containerRef.current) {
        // 현재 너비 측정
        const width = containerRef.current.offsetWidth;
        // 비율에 따른 최대 높이 계산 (예: 1600px * 9/16 = 900px)
        setMaxHeight(width * ratio);
      }
    };

    // 1. 초기 실행
    updateMaxHeight();

    // 2. 화면 크기 변화 감지 (ResizeObserver가 더 정확하지만 가벼운 resize 이벤트 사용)
    window.addEventListener('resize', updateMaxHeight);
    
    // (선택사항) ResizeObserver를 쓰면 모달 너비 자체가 변할 때도 반응함
    const observer = new ResizeObserver(updateMaxHeight);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', updateMaxHeight);
      observer.disconnect();
    };
  }, [ratio]);

  return (
    <div 
      ref={containerRef}
      className={`w-full overflow-y-auto relative ${className}`}
      style={{ 
        // 여기가 핵심: 높이는 자동이지만, 최대 높이는 비율제한을 따름
        maxHeight: maxHeight ? `${maxHeight}px` : undefined 
      }}
    >
      {children}
    </div>
  );
}
