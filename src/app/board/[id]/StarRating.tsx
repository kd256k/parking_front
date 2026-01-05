import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Font Awesome 별 아이콘

const StarRating = ({ totalStars = 5, onRate } : {totalStars:number, onRate : (value : number)=>void}) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  const handleClick = (value : number) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= (hover || rating);

        return (
          <label key={starValue} style={{ cursor: 'pointer' }}>
            {/* 실제 값을 담기 위한 숨겨진 라디오 버튼 (접근성 향상) */}
            <input
              type="radio"
              name="rating"
              value={starValue}
              onClick={() => handleClick(starValue)}
              style={{ display: 'none' }}
            />
            <FaStar
              size={30}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              style={{
                color: isActive ? '#FFD700' : '#E5E7EB', // 노란색 vs 회색
                transition: 'transform 0.1s ease, color 0.1s ease',
                transform: starValue === hover ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          </label>
        );
      })}
      
    </div>
  );
};

export default StarRating;