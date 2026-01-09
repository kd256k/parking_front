'use client'

import { useState, MouseEvent, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  totalStars?: number;
  initialRating?: number;
  readOnly?: boolean;
  onRate?: (value: number) => void;
  size?: number;
  precision?: number; // 단위: 1, 0.5, 0.1 등 (기본값 1)
}

const StarRating = ({
  totalStars = 5,
  initialRating = 5,
  readOnly = false,
  onRate,
  size = 30,
  precision = 1,
}: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, index: number) => {
    if (readOnly) return;

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - left) / width;

    // 1. 별 하나 안에서의 값을 precision 단위로 계산 (0 ~ 1 사이)
    // 예: precision 0.5 -> 0, 0.5, 1.0
    // 예: precision 0.1 -> 0.1, 0.2, ... 1.0
    let fraction = Math.ceil(percent / precision) * precision;

    // 0점 방지 (최소 precision 만큼은 선택되게)
    if (fraction === 0) fraction = precision;

    // 계산 오차 보정 (1.00001 -> 1)
    if (fraction > 1) fraction = 1;

    const newRating = index + fraction;

    setHoverRating(newRating);
  };

  useEffect(() => { // 외부에서 변경 감지
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = () => {
    if (readOnly || hoverRating === null) return;
    setRating(hoverRating);
    if (onRate) onRate(hoverRating);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(null);
  };

  return (
    <div style={{ display: 'inline-flex', gap: '4px' }} onMouseLeave={handleMouseLeave}>
      {[...Array(totalStars)].map((_, index) => {
        // 별 채우기 비율 계산
        const fillAmount = Math.max(0, Math.min(1, displayRating - index));

        return (
          <div
            key={index}
            style={{
              position: 'relative',
              cursor: readOnly ? 'default' : 'pointer',
              width: size,
              height: size,
            }}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={handleClick}
          >
            {/* 회색 별 (배경) */}
            <FaStar
              size={size}
              color="#E5E7EB"
              style={{ position: 'absolute', top: 0, left: 0 }}
            />

            {/* 노란색 별 (채움) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${fillAmount * 100}%`,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              <FaStar size={size} color="#FFD700" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
