// import React from "react";
// import { Row, Col, Badge } from "react-bootstrap";
// import { badgeBg } from "../../../constants/order.constants";
// import { currencyFormat } from "../../../utils/number";

// const OrderStatusCard = ({ orderItem }) => {
//   return (
//     <div>
//       <Row className="status-card">
//         <Col xs={2}>
//           <img
//             src={orderItem.items[0]?.productId?.image}
//             alt={orderItem.items[0]?.productId?.image}
//             height={96}
//           />
//         </Col>
//         <Col xs={8} className="order-info">
//           <div>
//             <strong>주문번호: {orderItem.orderNum}</strong>
//           </div>

//           <div className="text-12">{orderItem.createdAt.slice(0, 10)}</div>

//           <div>
//             {orderItem.items[0].productId.name}
//             {orderItem.items.length > 1 && `외 ${orderItem.items.length - 1}개`}
//           </div>
//           <div>₩ {currencyFormat(orderItem.totalPrice)}</div>
//         </Col>
//         <Col md={2} className="vertical-middle">
//           <div className="text-align-center text-12">주문상태</div>
//           <Badge bg={badgeBg[orderItem.status]}>{orderItem.status}</Badge>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default OrderStatusCard;
import { Row, Col, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

/** 카드에 표시되는 주문 (items[].productId가 populate된 형태) */
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

  return (
    <div>
      <Row className={`status-card ${className ?? ""}`.trim()}>
        <Col xs={2}>
          <img
            src={productId?.image}
            alt={productId?.name ?? "product"}
            height={96}
          />
        </Col>
        <Col xs={8} className="order-info">
          <div>
            <strong>주문번호: {orderItem.orderNum}</strong>
          </div>
          <div className="text-12">{orderItem.createdAt.slice(0, 10)}</div>
          <div>
            {productId?.name}
            {orderItem.items.length > 1 &&
              ` 외 ${orderItem.items.length - 1}개`}
          </div>
          <div>₩ {currencyFormat(orderItem.totalPrice)}</div>
        </Col>
        <Col md={2} className="vertical-middle">
          <div className="text-align-center text-12">주문상태</div>
          <Badge bg={badgeBg[orderItem.status as keyof typeof badgeBg]}>
            {orderItem.status}
          </Badge>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatusCard;
