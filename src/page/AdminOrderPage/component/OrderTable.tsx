import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

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
  userId: { email?: string };
  shipTo: { address?: string; city?: string };
  items: Array<{
    productId: { name?: string };
  }>;
}

interface OrderTableProps {
  header: string[];
  data: OrderTableOrder[];
  openEditForm: (order: OrderTableOrder) => void;
}

const OrderTable = ({ header, data, openEditForm }: OrderTableProps) => {
  return (
    <div className="overflow-x">
      <table className="w-full border-collapse border border-gray-300 [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:p-2 [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_tr:nth-child(even)]:bg-gray-50 [&_tr:hover]:bg-gray-100">
        <thead>
          <tr>
            {header.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => {
              const statusKey = item.status as keyof typeof badgeBg;
              const bgKey = badgeBg[statusKey] ?? "primary";
              return (
                <tr
                  key={item._id}
                  onClick={() => openEditForm(item)}
                  className="cursor-pointer"
                >
                  <th>{index}</th>
                  <th>{item.orderNum}</th>
                  <th>{item.createdAt.slice(0, 10)}</th>
                  <th>{item.userId?.email ?? ""}</th>
                  {item.items?.length > 0 ? (
                    <th>
                      {item.items[0].productId?.name}
                      {item.items.length > 1 &&
                        ` 외 ${item.items.length - 1}개`}
                    </th>
                  ) : (
                    <th></th>
                  )}
                  <th>
                    {[item.shipTo?.address, item.shipTo?.city]
                      .filter(Boolean)
                      .join(" ")}
                  </th>
                  <th>{currencyFormat(item.totalPrice)}</th>
                  <th>
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${badgeBgClass[bgKey] ?? badgeBgClass.primary}`}
                    >
                      {item.status}
                    </span>
                  </th>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={header.length}>No Data to show</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
