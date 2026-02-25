import { Link } from "react-router-dom";
import { useAppSelector } from "../../features/hooks";
import { Check, CircleAlert, TriangleAlert } from "lucide-react";

const OrderCompletePage = () => {
  const { orderNum } = useAppSelector((state) => state.order);

  if (!orderNum) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-8">
          <TriangleAlert
            size={40}
            strokeWidth={2}
            className="text-black mb-1"
          />
        </div>
        <h1 className="text-2xl font-black uppercase mb-4">No Order Found</h1>
        <p className="text-zinc-500 mb-8 uppercase">
          Looks like there's no order
        </p>
        <Link
          to="/"
          className="bg-black text-white px-10 py-4 text-xs font-black uppercase tracking-tighter hover:bg-zinc-800 transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-20 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-8">
        <Check size={40} strokeWidth={3} className="text-black" />
      </div>

      <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">
        Order Confirmed
      </h2>
      <p className="text-zinc-500 font-medium mb-8 uppercase">
        Your order is being processed
      </p>

      <div className="w-full max-w-md border border-zinc-200 p-6 mb-10 bg-white shadow-sm">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
          Order Number
        </p>
        <p className="text-2xl font-black tracking-widest text-black">
          {orderNum}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/account/purchase"
            className="bg-black text-white px-12 py-4 text-xs font-black uppercase tracking-tighter hover:bg-primary duration-300 transition-all"
          >
            Order History
          </Link>
          <Link
            to="/"
            className="border border-zinc-200 px-12 py-4 text-xs font-black uppercase tracking-tighter hover:bg-primary hover:text-white duration-300 transition-all"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletePage;
