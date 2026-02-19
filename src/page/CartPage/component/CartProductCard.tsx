import { Trash2 } from "lucide-react";
import { currencyFormat } from "../../../utils/number";
import { updateQty, deleteCartItem } from "../../../features/cart/cartSlice";
import { useAppDispatch } from "../../../features/hooks";

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-2">
          <img src={item.productId.image} width={112} alt="product" />
        </div>
        <div className="md:col-span-10">
          <div className="display-flex space-between">
            <h3>{item.productId.name}</h3>
            <button type="button" className="trash-button">
              <Trash2 className="size-6" onClick={() => deleteCart(item._id)} />
            </button>
          </div>
          <div>
            <strong>$ {currencyFormat(item.productId.price)}</strong>
          </div>
          <div>Size: {item.size}</div>
          <div>Total: $ {currencyFormat(item.productId.price * item.qty)}</div>
          <div>
            Quantity:
            <select
              onChange={(e) => handleQtyChange(item._id, e.target.value)}
              required
              defaultValue={item.qty}
              className="qty-dropdown rounded border border-gray-300 px-2 py-1"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
