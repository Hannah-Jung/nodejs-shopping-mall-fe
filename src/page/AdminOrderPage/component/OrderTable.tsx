import { useState } from "react";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";
import { Plus, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";

const cellStyle = "p-4 border-b border-zinc-100 sm:text-center align-middle";
const mobileLabel = "sm:hidden font-black text-zinc-400 mr-2";

const badgeBgClass: Record<string, string> = {
  primary: "bg-blue-500 text-white",
  warning: "bg-amber-500 text-white",
  danger: "bg-red-500 text-white",
  success: "bg-green-600 text-white",
};

export interface OrderTableOrder {
  _id: string;
  orderNum?: string;
  createdAt: string;
  totalPrice: number;
  status: string;
  userId: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  shipTo: { address?: string; city?: string };
  items: Array<{
    productId: { name?: string; image?: string[] };
  }>;
}

interface OrderTableProps {
  header: string[];
  data: OrderTableOrder[];
  openEditForm: (order: OrderTableOrder) => void;
  currentPage: number;
}

const OrderTable = ({
  header,
  data,
  openEditForm,
  currentPage,
}: OrderTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left border-t border-zinc-200">
        <thead className="hidden sm:table-header-group bg-zinc-50/50 text-zinc-500 font-bold">
          <tr>
            {header.map((h) => (
              <th
                key={h}
                className="px-4 py-4 text-[11px] uppercase tracking-wider text-center border-b border-zinc-200"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="block sm:table-row-group">
          {data.length > 0 ? (
            data.map((order, index) => {
              const statusKey =
                order.status.toLowerCase() as keyof typeof badgeBg;
              const bgKey = badgeBg[statusKey] ?? "primary";
              const orderIndex = index + 1 + (Number(currentPage) - 1) * 5;

              const subtotal = order.totalPrice;
              const shippingFee = subtotal >= 75 ? 0 : 9.99;
              const grandTotal = subtotal + shippingFee;
              return (
                <tr
                  key={order._id}
                  className="block sm:table-row border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="sm:hidden block w-full p-4 space-y-4">
                    <div className="flex justify-between items-center bg-zinc-50 px-4 py-2 border-b border-zinc-100 -mx-4 -mt-4">
                      <span className="font-mono text-[10px] text-zinc-400">
                        #{orderIndex}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase">
                        ORDER# {order.orderNum}
                      </span>
                    </div>

                    <div className="flex gap-4 items-start pt-2">
                      <img
                        src={
                          order.items[0]?.productId?.image?.[0] ||
                          "/placeholder.png"
                        }
                        className="size-20 rounded-sm object-cover bg-zinc-100 shrink-0 border border-zinc-200"
                        alt="p"
                      />
                      <div className="flex flex-col gap-2 flex-1">
                        <span
                          className={cn(
                            "self-start px-2 py-0.5 rounded-sm text-[10px] font-black uppercase ",
                            badgeBgClass[bgKey],
                          )}
                        >
                          {order.status}
                        </span>
                        <div className="font-bold text-zinc-900 line-clamp-2 leading-tight text-sm">
                          {order.items[0]?.productId?.name}
                        </div>
                        {order.items.length > 1 && (
                          <div className="flex items-center gap-0.5 text-primary">
                            <Plus className="size-3" strokeWidth={3} />
                            <span className="text-[10px] font-black">
                              {order.items.length - 1} MORE
                            </span>
                          </div>
                        )}
                        <div className="text-xs font-black text-zinc-900 mt-1">
                          TOTAL: ${currencyFormat(grandTotal)}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-zinc-100">
                      <div className="text-[10px] text-zinc-400 font-medium leading-tight">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                        <br />
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </div>
                      <button
                        onClick={() => openEditForm(order)}
                        className="flex items-center gap-2 p-2 text-zinc-500 rounded-sm bg-white hover:text-primary transition-colors"
                      >
                        <SquarePen className="size-4" />
                        <span className="text-[10px] font-black uppercase">
                          Edit
                        </span>
                      </button>
                    </div>
                  </td>

                  <td className="hidden sm:table-cell p-4 text-center text-zinc-400 font-mono text-xs">
                    {orderIndex}
                  </td>

                  <td className="hidden sm:table-cell p-4 text-center font-bold text-zinc-900 font-mono tracking-wider text-sm">
                    {order.orderNum}
                  </td>

                  <td className="hidden sm:table-cell p-4 sm:text-center text-xs text-zinc-500">
                    <div>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </div>
                    <div className="text-[10px] text-zinc-400 uppercase">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </td>

                  <td className="hidden sm:table-cell p-4">
                    <div className="flex items-center gap-3 sm:justify-start">
                      <img
                        src={
                          order.items[0]?.productId?.image?.[0] ||
                          "/placeholder.png"
                        }
                        alt="product"
                        className="size-12 rounded-sm object-cover bg-zinc-100 shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <div className="font-bold text-zinc-900 line-clamp-2 leading-tight">
                          {order.items[0]?.productId?.name}
                        </div>
                        {order.items.length > 1 && (
                          <div className="flex items-center gap-0.5 text-zinc-500 mt-1 ">
                            <Plus className="size-3" strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase">
                              {order.items.length - 1} MORE
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="hidden sm:table-cell p-4 font-black text-zinc-900 sm:text-center">
                    ${currencyFormat(grandTotal)}
                  </td>

                  <td className="hidden sm:table-cell p-4 sm:text-center">
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 font-black text-[10px] uppercase rounded-sm",
                        badgeBgClass[bgKey],
                      )}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="hidden sm:table-cell p-4 sm:text-center text-zinc-400">
                    <button
                      className="p-2 hover:text-primary transition-colors cursor-pointer"
                      onClick={() => openEditForm(order)}
                    >
                      <SquarePen className="size-5" />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr className="block sm:table-row border-none">
              <td
                colSpan={header.length}
                className="block sm:table-cell py-20 text-center w-full bg-white"
              >
                <div className="flex flex-col items-center justify-center text-zinc-400">
                  <p className="font-bold uppercase tracking-widest">
                    No results
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default OrderTable;
