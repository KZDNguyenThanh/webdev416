import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}
const PriceView = ({ price, discount, className }: Props) => {
  const currentPrice = Number(price ?? 0);
  const discountPercent = Number(discount ?? 0);
  const hasDiscount = discountPercent > 0;
  const originalPrice = hasDiscount
    ? currentPrice + (discountPercent * currentPrice) / 100
    : currentPrice;

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-2">
        {hasDiscount ? (
          <PriceFormatter
            amount={originalPrice}
            className={twMerge(
              "line-through text-xs font-normal text-zinc-500",
              className,
            )}
          />
        ) : null}
        <PriceFormatter
          amount={currentPrice}
          className={cn("text-brand-dark", className)}
        />
      </div>
    </div>
  );
};

export default PriceView;
