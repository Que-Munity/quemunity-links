'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface RatingInputProps {
  recipeId: string;
  onRatingSubmit?: () => void;
}

export default function RatingInput({ recipeId, onRatingSubmit }: RatingInputProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-gray-600">Please sign in to rate and review this recipe.</p>
      </div>
    );
  }

  const submitRating = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId,
          rating,
          comment: comment.trim() || null,
        }),
      });

      if (response.ok) {
        setRating(0);
        setComment('');
        onRatingSubmit?.();
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate this recipe</h3>
      
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
            className="p-1"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hover || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-gray-600">
          {rating > 0 && (
            <span>
              {rating} star{rating !== 1 ? 's' : ''}
            </span>
          )}
        </span>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Leave a review (optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="How was this recipe? Any tips or modifications?"
          maxLength={1000}
        />
      </div>

      <button
        onClick={submitRating}
        disabled={rating === 0 || isSubmitting}
        className={`w-full py-2 px-4 rounded-lg font-medium ${
          rating === 0 || isSubmitting
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        } transition-colors`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </div>
  );
}