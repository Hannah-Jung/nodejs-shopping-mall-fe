// import React from "react";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { Row, Col, Form } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useDispatch } from "react-redux";
// import { currencyFormat } from "../../../utils/number";
// import { updateQty, deleteCartItem } from "../../../features/cart/cartSlice";
// const CartProductCard = ({ item }) => {
//   const dispatch = useDispatch();

//   const handleQtyChange = (id, value) => {
//     dispatch(updateQty({ id, value }));
//   };

//   const deleteCart = (id) => {
//     dispatch(deleteCartItem(id));
//   };

//   return (
//     <div className="product-card-cart">
//       <Row>
//         <Col md={2} xs={12}>
//           <img src={item.productId.image} width={112} alt="product" />
//         </Col>
//         <Col md={10} xs={12}>
//           <div className="display-flex space-between">
//             <h3>{item.productId.name}</h3>
//             <button className="trash-button">
//               <FontAwesomeIcon
//                 icon={faTrash}
//                 width={24}
//                 onClick={() => deleteCart(item._id)}
//               />
//             </button>
//           </div>

//           <div>
//             <strong>₩ {currencyFormat(item.productId.price)}</strong>
//           </div>
//           <div>Size: {item.size}</div>
//           <div>Total: ₩ {currencyFormat(item.productId.price * item.qty)}</div>
//           <div>
//             Quantity:
//             <Form.Select
//               onChange={(event) =>
//                 handleQtyChange(item._id, event.target.value)
//               }
//               required
//               defaultValue={item.qty}
//               className="qty-dropdown"
//             >
//               <option value={1}>1</option>
//               <option value={2}>2</option>
//               <option value={3}>3</option>
//               <option value={4}>4</option>
//               <option value={5}>5</option>
//               <option value={6}>6</option>
//               <option value={7}>7</option>
//               <option value={8}>8</option>
//               <option value={9}>9</option>
//               <option value={10}>10</option>
//             </Form.Select>
//           </div>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default CartProductCard;
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { currencyFormat } from "../../../utils/number";
import { updateQty, deleteCartItem } from "../../../features/cart/cartSlice";
import { useAppDispatch } from "../../../features/hooks";

/** 장바구니 카드에 표시되는 아이템 (productId가 populate된 형태) */
export interface CartProductCardItem {
  _id: string;
  size: string;
  qty: number;
  productId: {
    image: string;
    name: string;
    price: number;
  };
}

interface CartProductCardProps {
  item: CartProductCardItem;
}

const CartProductCard = ({ item }: CartProductCardProps) => {
  const dispatch = useAppDispatch();

  const handleQtyChange = (id: string, value: string) => {
    dispatch(updateQty({ id, value: Number(value) }));
  };

  const deleteCart = (id: string) => {
    dispatch(deleteCartItem(id));
  };

  return (
    <div className="product-card-cart">
      <Row>
        <Col md={2} xs={12}>
          <img src={item.productId.image} width={112} alt="product" />
        </Col>
        <Col md={10} xs={12}>
          <div className="display-flex space-between">
            <h3>{item.productId.name}</h3>
            <button type="button" className="trash-button">
              <FontAwesomeIcon
                icon={faTrash}
                width={24}
                onClick={() => deleteCart(item._id)}
              />
            </button>
          </div>
          <div>
            <strong>₩ {currencyFormat(item.productId.price)}</strong>
          </div>
          <div>Size: {item.size}</div>
          <div>Total: ₩ {currencyFormat(item.productId.price * item.qty)}</div>
          <div>
            Quantity:
            <Form.Select
              onChange={(e) => handleQtyChange(item._id, e.target.value)}
              required
              defaultValue={item.qty}
              className="qty-dropdown"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Form.Select>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
