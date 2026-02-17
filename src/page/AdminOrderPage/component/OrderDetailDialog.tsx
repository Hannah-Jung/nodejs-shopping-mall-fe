// import React, { useState } from "react";
// import { Form, Modal, Button, Col, Table } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { ORDER_STATUS } from "../../../constants/order.constants";
// import { currencyFormat } from "../../../utils/number";
// import { updateOrder } from "../../../features/order/orderSlice";

// const OrderDetailDialog = ({ open, handleClose }) => {
//   const selectedOrder = useSelector((state) => state.order.selectedOrder);
//   const [orderStatus, setOrderStatus] = useState(selectedOrder.status);
//   const dispatch = useDispatch();

//   const handleStatusChange = (event) => {
//     setOrderStatus(event.target.value);
//   };
//   const submitStatus = () => {
//     dispatch(updateOrder({ id: selectedOrder._id, status: orderStatus }));
//     handleClose();
//   };

//   if (!selectedOrder) {
//     return <></>;
//   }
//   return (
//     <Modal show={open} onHide={handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>Order Detail</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <p>예약번호: {selectedOrder.orderNum}</p>
//         <p>주문날짜: {selectedOrder.createdAt.slice(0, 10)}</p>
//         <p>이메일: {selectedOrder.userId.email}</p>
//         <p>
//           주소:{selectedOrder.shipTo.address + " " + selectedOrder.shipTo.city}
//         </p>
//         <p>
//           연락처:
//           {`${
//             selectedOrder.contact.firstName + selectedOrder.contact.lastName
//           } ${selectedOrder.contact.contact}`}
//         </p>
//         <p>주문내역</p>
//         <div className="overflow-x">
//           <Table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Unit Price</th>
//                 <th>Qty</th>
//                 <th>Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedOrder.items.length > 0 &&
//                 selectedOrder.items.map((item) => (
//                   <tr key={item._id}>
//                     <td>{item._id}</td>
//                     <td>{item.productId.name}</td>
//                     <td>{currencyFormat(item.price)}</td>
//                     <td>{item.qty}</td>
//                     <td>{currencyFormat(item.price * item.qty)}</td>
//                   </tr>
//                 ))}
//               <tr>
//                 <td colSpan={4}>총계:</td>
//                 <td>{currencyFormat(selectedOrder.totalPrice)}</td>
//               </tr>
//             </tbody>
//           </Table>
//         </div>
//         <Form onSubmit={submitStatus}>
//           <Form.Group as={Col} controlId="status">
//             <Form.Label>Status</Form.Label>
//             <Form.Select value={orderStatus} onChange={handleStatusChange}>
//               {ORDER_STATUS.map((item, idx) => (
//                 <option key={idx} value={item.toLowerCase()}>
//                   {item}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//           <div className="order-button-area">
//             <Button
//               variant="light"
//               onClick={handleClose}
//               className="order-button"
//             >
//               닫기
//             </Button>
//             <Button type="submit">저장</Button>
//           </div>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default OrderDetailDialog;
import { useState } from "react";
import { Form, Modal, Button, Col, Table } from "react-bootstrap";
import { ORDER_STATUS } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";
import { updateOrder } from "../../../features/order/orderSlice";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";

type FormControlElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

/** 다이얼로그에서 쓰는 주문 (userId, contact, items 등 populate) */
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

  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Order Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>예약번호: {order.orderNum}</p>
        <p>주문날짜: {order.createdAt.slice(0, 10)}</p>
        <p>이메일: {order.userId?.email}</p>
        <p>
          주소:{" "}
          {[order.shipTo?.address, order.shipTo?.city]
            .filter(Boolean)
            .join(" ")}
        </p>
        <p>
          연락처:{" "}
          {[
            order.contact?.firstName,
            order.contact?.lastName,
            order.contact?.contact,
          ]
            .filter(Boolean)
            .join(" ")}
        </p>
        <p>주문내역</p>
        <div className="overflow-x">
          <Table>
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
                <td colSpan={4}>총계:</td>
                <td>{currencyFormat(order.totalPrice)}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <Form onSubmit={submitStatus}>
          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select value={orderStatus} onChange={handleStatusChange}>
              {ORDER_STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <div className="order-button-area">
            <Button
              type="button"
              variant="light"
              onClick={handleClose}
              className="order-button"
            >
              닫기
            </Button>
            <Button type="submit">저장</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetailDialog;
