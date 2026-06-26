import type { ProductDTO } from "@/lib/types";
import { StarIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/server";
import { submitProductReviewAction } from "@/app/(client)/product/[slug]/actions";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import ReviewRatingInput from "./ReviewRatingInput";
import ReviewsListSection from "./ReviewsListSection";

function StarRow({ value, size = 14 }: { value: number; size?: number }) {
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

const ProductReviews = async ({
  product,
  slug,
}: {
  product: ProductDTO;
  slug: string;
}) => {
  const user = await getCurrentUser();
  const reviewCount = Number(product?.reviewCount ?? 0);
  const reviewAverage = Number(product?.reviewAverage ?? 0);

  const reviews = [...(product?.reviews ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <section className="mt-6 border rounded-md border-darkBlue/15 p-4 space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Đánh giá của khách hàng</h3>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <StarRow value={reviewAverage} />
          <span>{reviewAverage.toFixed(1)} / 5</span>
          <span>({reviewCount} đánh giá)</span>
        </div>
      </div>

      <form action={submitProductReviewAction} className="space-y-3">
        <input type="hidden" name="slug" value={slug} />

        <div className="text-sm text-gray-700">
          {user
            ? `Đánh giá với tên ${user.fullName || user.email}`
            : "Bạn cần đăng nhập để gửi đánh giá."}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">
            Điểm đánh giá
          </label>
          <ReviewRatingInput defaultValue={5} />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="comment"
            className="text-sm font-medium text-gray-800"
          >
            Nhận xét
          </label>
          <Textarea
            id="comment"
            name="comment"
            required
            minLength={3}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm"
          />
        </div>

        <Button type="submit">Gửi đánh giá</Button>
      </form>

      <div className="border-t border-darkBlue/10 pt-4">
        <ReviewsListSection reviews={reviews} />
      </div>
    </section>
  );
};

export default ProductReviews;
