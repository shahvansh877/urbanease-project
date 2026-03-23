import { Star } from 'lucide-react';

export function StarRating({ rating, size = 'sm' }) {
  const sz = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sz} ${
            star <= Math.round(rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300 fill-gray-200'
          }`}
        />
      ))}
    </div>
  );
}
