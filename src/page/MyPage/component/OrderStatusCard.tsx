import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

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
  items: Array<{
    productId: {
      image: string;
      name: string;
    };
  }>;
}

interface OrderStatusCardProps {
  orderItem: OrderStatusCardOrder;
  className?: string;
}

const OrderStatusCard = ({ orderItem, className }: OrderStatusCardProps) => {
  const firstItem = orderItem.items[0];
  const productId = firstItem?.productId;
  const statusKey = orderItem.status as keyof typeof badgeBg;
  const bgKey = badgeBg[statusKey] ?? "primary";

  return (
    <div>
      <div
        className={`status-card grid grid-cols-12 gap-4 items-center ${className ?? ""}`.trim()}
      >
        <div className="col-span-2">
          <img
            src={productId?.image}
            alt={productId?.name ?? "product"}
            height={96}
          />
        </div>
        <div className="col-span-8 order-info">
          <div>
            <strong>주문번호: {orderItem.orderNum}</strong>
          </div>
          <div className="text-12">{orderItem.createdAt.slice(0, 10)}</div>
          <div>
            {productId?.name}
            {orderItem.items.length > 1 &&
              ` 외 ${orderItem.items.length - 1}개`}
          </div>
          <div>$ {currencyFormat(orderItem.totalPrice)}</div>
        </div>
        <div className="col-span-2 vertical-middle">
          <div className="text-align-center text-12">주문상태</div>
          <span
            className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${badgeBgClass[bgKey] ?? badgeBgClass.primary}`}
          >
            {orderItem.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusCard;
