import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import type { Product } from "@/features/product/productSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react"; // 하트 아이콘 추가

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

  return (
    <Card
      className="group overflow-hidden gap-0 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg border border-zinc-100 rounded-xl bg-white"
      onClick={() => navigate(`/product/${item._id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        <img
          src={item.image[0]}
          alt={item.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        <button
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart className="size-4 text-zinc-600 hover:text-red-500 transition-colors" />
        </button>
      </div>

      <div className="p-3">
        <div className="text-sm font-normal text-zinc-800 truncate mb-1">
          {item.name}
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div className="text-base font-bold text-zinc-900">
            ${currencyFormat(item.price)}
          </div>

          <div className="flex-shrink-0">
            {totalStock > 0 && totalStock < 10 && (
              <span className="text-[10px] text-white bg-primary px-1.5 py-1 rounded-sm font-semibold uppercase tracking-tight">
                Only {totalStock} left
              </span>
            )}
            {totalStock === 0 && (
              <span className="text-[10px] text-zinc-400 font-medium border border-zinc-200 px-1.5 py-0.5 rounded-sm">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
