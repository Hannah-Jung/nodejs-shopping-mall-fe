// import React from "react";
// import { Table, Badge } from "react-bootstrap";
// import { badgeBg } from "../../../constants/order.constants";
// import { currencyFormat } from "../../../utils/number";

// const OrderTable = ({ header, data, openEditForm }) => {
//   return (
//     <div className="overflow-x">
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             {header.map((title) => (
//               <th>{title}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.length > 0 ? (
//             data.map((item, index) => (
//               <tr onClick={() => openEditForm(item)}>
//                 <th>{index}</th>
//                 <th>{item.orderNum}</th>
//                 <th>{item.createdAt.slice(0, 10)}</th>
//                 <th>{item.userId.email}</th>
//                 {item.items.length > 0 ? (
//                   <th>
//                     {item.items[0].productId.name}
//                     {item.items.length > 1 && `외 ${item.items.length - 1}개`}
//                   </th>
//                 ) : (
//                   <th></th>
//                 )}

//                 <th>{item.shipTo.address + " " + item.shipTo.city}</th>

//                 <th>{currencyFormat(item.totalPrice)}</th>
//                 <th>
//                   <Badge bg={badgeBg[item.status]}>{item.status}</Badge>
//                 </th>
//               </tr>
//             ))
//           ) : (
//             <tr>No Data to show</tr>
//           )}
//         </tbody>
//       </Table>
//     </div>
//   );
// };
// export default OrderTable;
import { Table, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

/** 테이블에 표시되는 주문 (userId, items[].productId 등 populate된 형태) */
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
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item._id} onClick={() => openEditForm(item)}>
                <th>{index}</th>
                <th>{item.orderNum}</th>
                <th>{item.createdAt.slice(0, 10)}</th>
                <th>{item.userId?.email ?? ""}</th>
                {item.items?.length > 0 ? (
                  <th>
                    {item.items[0].productId?.name}
                    {item.items.length > 1 && ` 외 ${item.items.length - 1}개`}
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
                  <Badge bg={badgeBg[item.status as keyof typeof badgeBg]}>
                    {item.status}
                  </Badge>
                </th>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={header.length}>No Data to show</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderTable;
