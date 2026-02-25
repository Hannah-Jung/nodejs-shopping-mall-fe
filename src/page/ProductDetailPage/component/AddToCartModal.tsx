import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { currencyFormat } from "@/utils/number";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  size: string;
  qty: number;
  price: number;
}

const AddToCartModal = ({
  isOpen,
  onClose,
  product,
  size,
  qty,
  price,
}: AddToCartModalProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="max-w-[95vw] sm:max-w-md !p-0 overflow-hidden border-none shadow-2xl bg-white gap-0 focus:outline-none">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              <DialogHeader className="bg-white px-6 py-5 border-b border-zinc-100 flex flex-row items-center gap-3 space-y-0 text-left relative overflow-hidden">
                <CheckCircle2 className="size-5 text-green-600 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <DialogTitle className="text-sm font-black tracking-widest uppercase text-zinc-900 leading-none">
                    Added to your cart
                  </DialogTitle>
                  <p className="text-[10px] font-medium text-zinc-400">
                    Returning to shop in 3 seconds...
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-100">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="h-full bg-zinc-900"
                  />
                </div>
              </DialogHeader>

              <div className="px-6 py-8 flex flex-col items-center sm:items-stretch">
                <div className="flex gap-6 mb-8 pb-8 border-b border-zinc-100 w-full">
                  <div className="w-24 h-24 shrink-0 bg-zinc-50 rounded-md overflow-hidden border border-zinc-100">
                    <img
                      src={product?.image?.[0]}
                      alt={product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight leading-tight mb-1">
                      {product?.name}
                    </h3>
                    <p className="text-[11px] font-bold text-zinc-400 uppercase">
                      SIZE: {size}
                    </p>
                    <p className="text-[11px] font-bold text-zinc-400 uppercase ">
                      Price: ${currencyFormat(price)}
                    </p>
                    <p className="text-[11px] font-bold text-zinc-400 uppercase">
                      QTY: {qty}
                    </p>

                    <p className="text-sm font-black text-zinc-900 mt-3">
                      Total: ${currencyFormat(price * qty)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <Button
                    onClick={() => {
                      onClose();
                      navigate("/cart");
                    }}
                    className="w-full h-14 bg-zinc-900 text-white font-bold uppercase tracking-widest hover:bg-primary cursor-pointer transition-colors"
                  >
                    Go to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full h-14 border border-zinc-200 text-zinc-900 font-bold uppercase tracking-widest hover:text-primary cursor-pointer transition-all duration-300"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default AddToCartModal;
