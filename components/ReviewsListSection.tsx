"use client";

import { StarIcon } from "lucide-react";
import { useMemo, useState } from "react";

type ReviewItem = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
};

const PAGE_SIZE = 5;

type SortOrder = "highest" | "lowest";

function StarRow({ value, size = 13 }: { value: number; size?: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(value)));

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => (
        <StarIcon
          key={index}
          size={size}
          className={index < filled ? "text-yellow-400" : "text-gray-300"}
          fill={index < filled ? "#facc15" : "#d1d5db"}
        />
      ))}
    </div>
  );
}

const ReviewsListSection = ({ reviews }: { reviews: ReviewItem[] }) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>("highest");
  const [visibleCount, setVisibleCount] = useState(0);

  const sortedReviews = useMemo(() => {
    const copied = [...reviews];

    copied.sort((a, b) => {
      if (sortOrder === "highest") {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
      } else {
        if (a.rating !== b.rating) {
          return a.rating - b.rating;
        }
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return copied;
  }, [reviews, sortOrder]);

  const visibleReviews = sortedReviews.slice(0, visibleCount);
  const hasMore = visibleCount < sortedReviews.length;

  if (reviews.length === 0) {
    return <p className="text-sm text-gray-500">No reviews yet</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">Đánh giá ({reviews.length})</p>
        <div className="flex items-center gap-2">
          <label
            htmlFor="review-sort"
            className="text-xs font-medium text-gray-700"
          >
            Sort by rating
          </label>
          <select
            id="review-sort"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
            className="border-input h-8 rounded-md border bg-transparent px-2 text-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="highest">From Highest to Lowest</option>
            <option value="lowest">Lowest to Highest</option>
          </select>
        </div>
      </div>

      {visibleReviews.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nhấn &ldquo;Hiện thêm đánh giá&rdquo; để xem đánh giá.
        </p>
      ) : (
        <div className="space-y-3">
          {visibleReviews.map((review) => (
            <article
              key={review.id}
              className="border rounded-md p-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{review.userName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <StarRow value={review.rating} size={13} />
              <p className="text-sm text-gray-700">{review.comment}</p>
            </article>
          ))}
        </div>
      )}

      {hasMore ? (
        <button
          type="button"
          onClick={() =>
            setVisibleCount((current) =>
              Math.min(current + PAGE_SIZE, sortedReviews.length),
            )
          }
          className="rounded-md border border-darkBlue/20 px-3 py-2 text-sm font-medium text-darkBlue hover:bg-darkBlue/5"
        >
          Hiện thêm đánh giá
        </button>
      ) : visibleReviews.length > 0 ? (
        <p className="text-xs text-gray-500">Đã hiển thị tất cả đánh giá.</p>
      ) : null}
    </div>
  );
};

export default ReviewsListSection;
