import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import type { Product } from "@/features/product/productSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDisplayPrice } from "@/utils/displayPrice";

interface ProductCardProps {
  item: Product;
}

const ProductCard = ({ item }: ProductCardProps) => {
  const navigate = useNavigate();

  const totalStock = item.stock
    ? Object.values(item.stock).reduce(
        (acc: number, cur: number) => acc + cur,
        0,
      )
    : 0;

  const isOutOfStock = totalStock === 0;

  const displayPrice = getDisplayPrice(item);

  return (
    <Card
      className={cn(
        "group overflow-hidden gap-0 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg border border-zinc-100 rounded-xl bg-white",
        isOutOfStock && "hover:shadow-sm",
      )}
      onClick={() => navigate(`/product/${item._id}`)}
    >
      <div
        className={cn(
          "relative aspect-square overflow-hidden bg-zinc-100",
          isOutOfStock && "saturate-[0.05] opacity-75",
        )}
      >
        <img
          src={item.image[0]}
          alt={item.name}
          className={cn(
            "h-full w-full object-cover object-center transition-transform duration-500",
            !isOutOfStock && "group-hover:scale-105",
          )}
        />

        <button
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white shadow-sm hover:bg-zinc-50 transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart
            className="size-4 text-zinc-600 hover:text-red-500 transition-colors"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </button>
      </div>
      <div className={cn("p-4", isOutOfStock && "opacity-60")}>
        <div className="text-[13px] font-black text-zinc-900 uppercase tracking-tight line-clamp-2 leading-tight">
          {item.name}
        </div>

        <div className="mt-4">
          {!isOutOfStock && (
            <p className="text-[10px] font-black text-zinc-400 uppercase mb-1 ">
              Starts from
            </p>
          )}

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-base font-bold text-zinc-900 leading-none">
              <p>${currencyFormat(displayPrice)}</p>
            </div>

            <div className="flex-shrink-0">
              {totalStock > 0 && totalStock < 10 && (
                <span className="text-[10px] text-white bg-primary px-1.5 py-1 rounded-sm font-semibold uppercase tracking-tight">
                  Only {totalStock} left
                </span>
              )}
              {isOutOfStock && (
                <span className="text-[9px] text-red-600 font-bold border border-red-600 px-2 py-1 uppercase rounded-sm tracking-widest">
                  Sold Out
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
