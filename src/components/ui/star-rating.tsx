
"use client";

import type { FC } from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
  starClassName?: string;
}

const StarRating: FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size = 20,
  className,
  starClassName,
}) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className={cn("text-yellow-400 fill-yellow-400", starClassName)}
        />
      ))}
      {halfStar && (
        <StarHalf
          key="half"
          size={size}
          className={cn("text-yellow-400 fill-yellow-400", starClassName)}
        />
      )}
      {[...Array(Math.max(0, emptyStars))].map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className={cn("text-yellow-400", starClassName)} // Outline only for empty
        />
      ))}
    </div>
  );
};

export default StarRating;
