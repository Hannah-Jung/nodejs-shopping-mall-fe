import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";
import { updateOrder, getOrderList } from "../../../features/order/orderSlice";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";
import { X } from "lucide-react";

interface OrderDetailDialogProps {
  open: boolean;
  handleClose: () => void;
  isAdmin?: boolean;
}

export interface OrderDetailOrder {
  _id: string;
  orderNum?: string;
  createdAt: string;
  totalPrice: number;
  status: string;
  userId: { email?: string; firstName?: string; lastName?: string };
  shipTo: { address?: string; city?: string; state?: string; zip?: string };
  contact: { firstName?: string; lastName?: string; contact?: string };
  items: Array<{
    _id?: string;
    productId: { name?: string; image?: string[] };
    price: number;
    qty: number;
    size: string;
  }>;
}

const OrderDetailDialog = ({
  open,
  handleClose,
  isAdmin = false,
}: OrderDetailDialogProps) => {
  const dispatch = useAppDispatch();
  const selectedOrder = useAppSelector(
    (state) => state.order.selectedOrder,
  ) as OrderDetailOrder | null;
  const [orderStatus, setOrderStatus] = useState("");

  useEffect(() => {
    if (selectedOrder && selectedOrder.status) {
      setOrderStatus(selectedOrder.status.toLowerCase());
    }
  }, [selectedOrder]);

  if (!open || !selectedOrder) return null;

  const subtotal = selectedOrder.items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const shippingFee = subtotal >= 75 ? 0 : 9.99;
  const grandTotal = subtotal + shippingFee;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })} ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}`;
  };

  const submitStatus = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      await dispatch(
        updateOrder({ id: selectedOrder._id, status: orderStatus }),
      ).unwrap();
      dispatch(getOrderList({ page: 1 }));
      handleClose();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col p-6 border border-zinc-200 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900">
              {isAdmin ? (
                <>
                  <span className="bg-zinc-900 text-white px-2 py-0.5 text-[10px] font-black rounded-sm tracking-widest uppercase">
                    Admin
                  </span>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
                    Order Details
                  </h2>
                </>
              ) : (
                <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">
                  Order Details
                </h2>
              )}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="size-6 text-zinc-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-8 scrollbar-hide text-zinc-900">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-[11px] uppercase tracking-wider">
              <div className="flex items-start">
                <span className="w-24 font-black text-zinc-400 shrink-0">
                  ORDER#
                </span>
                <span className="font-bold">{selectedOrder.orderNum}</span>
              </div>
              <div className="flex items-start">
                <span className="w-24 font-black text-zinc-400 shrink-0">
                  DATE
                </span>
                <span className="font-bold">
                  {formatDate(selectedOrder.createdAt)}
                </span>
              </div>
              <div className="flex items-start border-t border-zinc-50 pt-3 sm:col-span-2">
                <span className="w-24 font-black text-zinc-400 shrink-0">
                  NAME
                </span>
                <span className="font-bold">
                  {selectedOrder.contact?.firstName}{" "}
                  {selectedOrder.contact?.lastName}
                </span>
              </div>
              <div className="flex items-start sm:col-span-2">
                <span className="w-24 font-black text-zinc-400 shrink-0">
                  EMAIL
                </span>
                <span className="font-bold lowercase">
                  {selectedOrder.userId?.email}
                </span>
              </div>
              <div className="flex items-start sm:col-span-2">
                <span className="w-24 font-black text-zinc-400 shrink-0">
                  ADDRESS
                </span>
                <div className="flex flex-col font-bold leading-tight">
                  <span>{selectedOrder.shipTo?.address}</span>
                  <span className="mt-1 ">
                    {selectedOrder.shipTo?.city}, {selectedOrder.shipTo?.state}{" "}
                    {selectedOrder.shipTo?.zip}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-zinc-100 rounded-sm overflow-hidden">
              <table className="w-full text-[11px] text-left border-collapse table-fixed">
                <thead className="bg-zinc-50 text-zinc-500 font-black uppercase border-b border-zinc-100">
                  <tr>
                    <th className="p-3 w-[60%] text-center">ITEM</th>
                    <th className="p-3 w-[25%] text-right pr-6">PRICE</th>
                    <th className="p-3 w-[15%] text-right pr-6">QTY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 font-bold">
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={item._id ?? idx}>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="aspect-square w-10 shrink-0 bg-zinc-50 border border-zinc-100 rounded-sm overflow-hidden">
                            <img
                              src={
                                item.productId?.image?.[0] || "/placeholder.png"
                              }
                              className="w-full h-full object-cover"
                              alt="product"
                            />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <p className="line-clamp-2 break-words leading-tight text-zinc-900 font-bold">
                              {item.productId?.name}
                            </p>

                            <p className="text-[9px] text-zinc-400 mt-0.5 uppercase font-bold tracking-tighter">
                              {item.size || "Regular"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right text-zinc-500 whitespace-nowrap pr-6">
                        ${currencyFormat(item.price)}
                      </td>
                      <td className="p-3 text-right text-zinc-400 pr-6">
                        {item.qty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-zinc-50/50 border-t border-zinc-100 px-4 py-3 space-y-1">
                <div className="flex justify-end items-center text-[10px] uppercase tracking-wider">
                  <span className="font-black text-zinc-400 mr-1">
                    Subtotal
                  </span>
                  <span className="font-bold w-24 text-right pr-2">
                    ${currencyFormat(subtotal)}
                  </span>
                </div>
                <div className="flex justify-end items-center py-1 text-[10px] uppercase tracking-wider">
                  <span className="font-black text-zinc-400 mr-1">
                    Shipping Fee
                  </span>
                  <span
                    className={`font-bold w-24 text-right pr-2 ${shippingFee === 0 ? "text-green-600" : "text-zinc-900"}`}
                  >
                    {shippingFee === 0
                      ? "FREE"
                      : `$${currencyFormat(shippingFee)}`}
                  </span>
                </div>
                <div className="flex justify-end items-center pt-2 mt-1 border-t border-zinc-100">
                  <span className="text-[11px] font-black text-zinc-700 uppercase mr-1">
                    Grand Total
                  </span>
                  <span className="text-sm font-black text-zinc-900 w-24 text-right pr-2 tracking-tighter">
                    ${currencyFormat(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-zinc-100">
              {isAdmin ? (
                <form onSubmit={submitStatus}>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="status"
                        className="block text-[10px] font-black text-zinc-400 uppercase mb-2 tracking-widest"
                      >
                        Change Order Status
                      </label>
                      <select
                        id="status"
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="w-full rounded-sm border border-zinc-200 px-3 py-2.5 text-xs font-bold uppercase focus:ring-1 focus:ring-primary outline-none appearance-none bg-white"
                        style={{
                          backgroundImage: 'url("data:image/svg+xml;...")',
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 0.5rem center",
                          backgroundSize: "1em",
                        }}
                      >
                        {ORDER_STATUS.map((item, idx) => (
                          <option key={idx} value={item.toLowerCase()}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1 sm:w-28 text-xs font-black uppercase h-10"
                      >
                        CLOSE
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 sm:w-32 text-xs font-black uppercase h-10 bg-black hover:bg-primary"
                      >
                        SAVE
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex justify-end">
                  <Button
                    onClick={handleClose}
                    className="w-full sm:w-32 bg-black text-xs font-black uppercase h-10"
                  >
                    CLOSE
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailDialog;
