import React, { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { currencyFormat } from "../../../utils/number";
import { updateQty, deleteCartItem } from "../../../features/cart/cartSlice";
import { useAppDispatch } from "../../../features/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ConfirmModal from "@/common/component/ConfirmModal";
import QtyStepper from "@/common/component/QtyStepper";

export interface CartProductCardItem {
  _id: string;
  size: string;
  qty: number;
  productId: {
    image: string[];
    name: string;
    price: {
      single: number;
      double: number;
      family: number;
    };
  };
}

interface CartProductCardProps {
  item: CartProductCardItem;
}

const CartProductCard = ({ item }: CartProductCardProps) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prices = item.productId.price as unknown as Record<string, number>;
  const currentPrice = prices[item.size.toLowerCase()] || 0;
  const productStock = (item.productId as any).stock as Record<string, number>;
  const actualStock = productStock?.[item.size.toLowerCase()] ?? 0;
  const MAX_PURCHASE_LIMIT = 10;
  const maxLimit = Math.min(actualStock, MAX_PURCHASE_LIMIT);

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-zinc-200 rounded-lg group transition-all hover:border-zinc-300">
      <div className="w-full sm:w-32 aspect-square shrink-0 bg-zinc-50 rounded-md overflow-hidden border border-zinc-100">
        <img
          src={item.productId.image?.[0]}
          alt={item.productId.name}
          className="w-full h-full object-cover transition-transform"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-black text-zinc-800 uppercase leading-tight tracking-tight line-clamp-2">
              {item.productId.name}
            </h3>
            <p className="text-[12px] font-bold text-zinc-500 mt-3 uppercase tracking-widest">
              SIZE: {item.size}
            </p>
            <p className="text-[12px] font-medium text-zinc-500 ">
              ${currencyFormat(currentPrice)}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto pt-2">
          <div className="flex items-center gap-3">
            <QtyStepper
              value={item.qty}
              onChange={(newValue) =>
                dispatch(updateQty({ id: item._id, value: newValue }))
              }
              max={maxLimit}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 pt-3 text-zinc-400 hover:text-red-500  rounded-md transition-all cursor-pointer"
            >
              <Trash2 className="size-4" />
            </button>

            <ConfirmModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={() => {
                dispatch(deleteCartItem(item._id));
                setIsModalOpen(false);
              }}
              title="Are you sure you want to delete this item?"
              variant="danger"
              confirmText="DELETE"
              description={
                <div className="flex flex-col items-center text-center pt-2">
                  <img
                    src={item.productId.image[0]}
                    className="w-24 h-24 object-cover rounded-md border border-zinc-100 mb-4"
                    alt={item.productId.name}
                  />
                  <p className="w-full font-bold text-red-600 text-sm mb-1 uppercase tracking-tight break-words">
                    {item.productId.name}
                  </p>
                  <p className="w-full text-zinc-500 text-[13px] font-medium leading-relaxed">
                    will be deleted. This action cannot be undone.
                  </p>
                </div>
              }
            />
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-400 font-bold uppercase mb-0.5">
              Subtotal
            </p>
            <span className="text-base font-black text-zinc-900 tracking-tighter">
              ${currencyFormat(currentPrice * item.qty)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
