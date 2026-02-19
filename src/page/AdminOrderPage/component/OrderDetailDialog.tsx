import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";
import { updateOrder } from "../../../features/order/orderSlice";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";

type FormControlElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export interface OrderDetailOrder {
  _id: string;
  orderNum?: string;
  createdAt: string;
  totalPrice: number;
  status: string;
  userId: { email?: string };
  shipTo: { address?: string; city?: string };
  contact: { firstName?: string; lastName?: string; contact?: string };
  items: Array<{
    _id?: string;
    productId: { name?: string };
    price: number;
    qty: number;
  }>;
}

interface OrderDetailDialogProps {
  open: boolean;
  handleClose: () => void;
}

const OrderDetailDialog = ({ open, handleClose }: OrderDetailDialogProps) => {
  const dispatch = useAppDispatch();
  const selectedOrder = useAppSelector((state) => state.order.selectedOrder) as
    | OrderDetailOrder
    | null
    | Record<string, unknown>;
  const [orderStatus, setOrderStatus] = useState(
    (selectedOrder && "status" in selectedOrder
      ? selectedOrder.status
      : "") as string,
  );

  const handleStatusChange = (event: React.ChangeEvent<FormControlElement>) => {
    setOrderStatus((event.target as HTMLSelectElement).value);
  };

  const submitStatus = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (
      !selectedOrder ||
      typeof selectedOrder !== "object" ||
      !("_id" in selectedOrder)
    ) {
      return;
    }
    dispatch(
      updateOrder({ id: selectedOrder._id as string, status: orderStatus }),
    );
    handleClose();
  };

  if (!selectedOrder || !("orderNum" in selectedOrder)) {
    return null;
  }

  const order = selectedOrder as OrderDetailOrder;

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        aria-hidden
        onClick={handleClose}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 id="order-detail-title" className="text-lg font-semibold">
              Order Detail
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-2xl leading-none p-1"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <p>OrderNumber: {order.orderNum}</p>
          <p>OrderDate: {order.createdAt.slice(0, 10)}</p>
          <p>Email: {order.userId?.email}</p>
          <p>
            Address:{" "}
            {[order.shipTo?.address, order.shipTo?.city]
              .filter(Boolean)
              .join(" ")}
          </p>
          <p>
            Contact:{" "}
            {[
              order.contact?.firstName,
              order.contact?.lastName,
              order.contact?.contact,
            ]
              .filter(Boolean)
              .join(" ")}
          </p>
          <p>Order Details</p>
          <div className="overflow-x mb-4">
            <table className="w-full border-collapse border border-gray-300 [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:p-2 [&_td]:border [&_td]:border-gray-300 [&_td]:p-2">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Unit Price</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.length > 0 &&
                  order.items.map((item, idx) => (
                    <tr key={item._id ?? idx}>
                      <td>{item._id}</td>
                      <td>{item.productId?.name}</td>
                      <td>{currencyFormat(item.price)}</td>
                      <td>{item.qty}</td>
                      <td>{currencyFormat(item.price * item.qty)}</td>
                    </tr>
                  ))}
                <tr>
                  <td colSpan={4}>Grand Total:</td>
                  <td>{currencyFormat(order.totalPrice)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <form onSubmit={submitStatus}>
            <div className="mb-3">
              <label htmlFor="status" className="block font-medium mb-1">
                STATUS
              </label>
              <select
                id="status"
                value={orderStatus}
                onChange={handleStatusChange}
                className="w-full rounded border border-gray-300 px-3 py-2"
              >
                {ORDER_STATUS.map((item, idx) => (
                  <option key={idx} value={item.toLowerCase()}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="order-button-area flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="order-button"
              >
                CLOSE
              </Button>
              <Button type="submit">SAVE</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OrderDetailDialog;
