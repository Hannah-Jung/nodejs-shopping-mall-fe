import { useState } from "react";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/features/hooks";
import { setSelectedOrder } from "@/features/order/orderSlice";

const badgeBgClass: Record<string, string> = {
  primary: "bg-blue-500 text-white",
  warning: "bg-amber-500 text-white",
  danger: "bg-red-500 text-white",
  success: "bg-green-600 text-white",
};

export interface OrderStatusCardOrder {
  _id: string;
  orderNum?: string;
  createdAt: string;
  totalPrice: number;
  status: string;
  shipTo: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  contact: {
    firstName: string;
    lastName: string;
    contact: string;
  };
  items: Array<{
    productId: {
      image: string;
      name: string;
    };
    size: string;
    qty: number;
    price: number;
  }>;
}

interface OrderStatusCardProps {
  orderItem: OrderStatusCardOrder;
  className?: string;
  onOpenModal: () => void;
}

const OrderStatusCard = ({
  orderItem,
  className,
  onOpenModal,
}: OrderStatusCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const LIMIT = 2;
  const hasMore = orderItem.items.length > LIMIT;
  const dispatch = useAppDispatch();

  const handleViewDetails = () => {
    dispatch(setSelectedOrder(orderItem as any));
    onOpenModal();
  };

  const visibleItems = isExpanded
    ? orderItem.items
    : orderItem.items.slice(0, LIMIT);

  const statusKey = orderItem.status as keyof typeof badgeBg;
  const bgKey = badgeBg[statusKey] ?? "primary";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const optionsLong: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const optionsShort: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    return {
      long: date.toLocaleDateString("en-US", optionsLong),
      short: date.toLocaleDateString("en-US", optionsShort),
    };
  };

  const subtotal = orderItem.items.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0,
  );
  const shippingFee = subtotal >= 75 ? 0 : 9.99;
  const grandTotal = subtotal + shippingFee;

  return (
    <div
      className={`border border-zinc-200 overflow-hidden bg-white mb-8 shadow-sm ${className ?? ""}`}
    >
      <div className="bg-zinc-50 p-4 border-b border-zinc-200 flex flex-nowrap md:flex-nowrap gap-x-10 md:gap-x-18 gap-y-4 text-[11px]">
        <div className="min-w-max">
          <p className="text-zinc-400 font-black uppercase">ORDER PLACED</p>
          <div className="text-zinc-500 font-bold uppercase">
            <span className="md:hidden">
              {formatDate(orderItem.createdAt).short}
            </span>

            <span className="hidden md:inline">
              {formatDate(orderItem.createdAt).long}
            </span>
          </div>
        </div>
        <div className="min-w-max">
          <p className="text-zinc-400 font-black uppercase">TOTAL</p>
          <p className="text-zinc-500 font-bold">
            ${currencyFormat(grandTotal)}
          </p>
        </div>
        <div className="hidden md:block flex-1 min-w-0">
          <p className="text-zinc-400 font-black uppercase truncate">SHIP TO</p>
          <p className="text-zinc-500 font-bold uppercase">
            {(orderItem.contact as any)?.firstName}{" "}
            {(orderItem.contact as any)?.lastName}
          </p>
        </div>
        <div className="text-right ml-auto min-w-max">
          <p className="text-zinc-400 font-black uppercase text-[10px]">
            ORDER # {orderItem.orderNum}
          </p>
          <span
            className={`inline-block px-2 py-0.5  font-black ${badgeBgClass[bgKey]}`}
          >
            {orderItem.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {visibleItems.map((item: any, index: number) => (
          <div
            key={index}
            className="flex gap-6 items-center animate-in fade-in duration-300"
          >
            <div className="w-16 h-16 sm:w-26 sm:h-26 bg-zinc-50 shrink-0 border border-zinc-100 overflow-hidden">
              <img
                src={
                  Array.isArray(item.productId?.image)
                    ? item.productId.image[0]
                    : item.productId?.image
                }
                className="w-full h-full object-cover"
                alt={item.productId?.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-zinc-700 mb-1 leading-tight uppercase tracking-tight truncate text-sm">
                {item.productId.name}
              </h3>
              <div className="text-[11px] text-zinc-500 space-y-[2px] font-bold">
                <p className="flex gap-1 uppercase">
                  <span className="text-zinc-400 uppercase">SIZE:</span>
                  {item.size || "FREE"}
                </p>
                <p className="flex gap-1">
                  <span className="text-zinc-400 uppercase">QTY:</span>
                  {item.qty || 1}
                </p>
                <p className="flex gap-1">
                  <span className="text-zinc-400 uppercase">PRICE:</span>$
                  {currencyFormat(item.price * (item.qty || 1))}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center bg-white">
        <div className="flex-1">
          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-[10px] font-black text-zinc-600 cursor-pointer hover:text-zinc-900 transition-all uppercase tracking-widest group"
            >
              <span>
                {isExpanded
                  ? "Show Less"
                  : `Show ${orderItem.items.length - LIMIT} More`}
              </span>
              <ChevronDown
                className={cn(
                  "size-3 transition-transform duration-300",
                  isExpanded ? "rotate-180" : "rotate-0",
                )}
              />
            </button>
          )}
        </div>
        <button
          onClick={handleViewDetails}
          className="text-[10px] font-black text-zinc-600 underline cursor-pointer hover:text-zinc-900 transition-all uppercase tracking-tight"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default OrderStatusCard;
