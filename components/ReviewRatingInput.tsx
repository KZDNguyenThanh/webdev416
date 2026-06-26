"use client";

import { StarIcon } from "lucide-react";
import { useState } from "react";

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Average",
  4: "Good",
  5: "Excellent",
};

const ReviewRatingInput = ({ defaultValue = 5 }: { defaultValue?: number }) => {
  const safeDefault = Math.max(1, Math.min(5, Math.round(defaultValue)));
  const [rating, setRating] = useState<number>(safeDefault);
  const [previewRating, setPreviewRating] = useState<number | null>(null);
  const activeRating = previewRating ?? rating;

  return (
    <div className="space-y-2">
      <input type="hidden" name="rating" value={rating} />
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setPreviewRating(null)}
      >
        {[1, 2, 3, 4, 5].map((starValue) => {
          const active = starValue <= activeRating;

          return (
            <button
              key={starValue}
              type="button"
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setPreviewRating(starValue)}
              onFocus={() => setPreviewRating(starValue)}
              onBlur={() => setPreviewRating(null)}
              aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
              className="rounded-sm p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shop_light_green/40"
            >
              <StarIcon
                size={22}
                className={active ? "text-yellow-400" : "text-gray-300"}
                fill={active ? "#facc15" : "#d1d5db"}
              />
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-600">
        {activeRating} - {ratingLabels[activeRating]}
      </p>
    </div>
  );
};

export default ReviewRatingInput;
