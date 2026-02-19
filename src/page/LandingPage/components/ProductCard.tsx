import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import type { Product } from "@/features/product/productSlice";

interface ProductCardProps {
  item: Product;
}

const ProductCard = ({ item }: ProductCardProps) => {
  const navigate = useNavigate();
  const showProduct = (id: string) => {
    navigate(`/product/${id}`);
  };
  return (
    <div className="card" onClick={() => showProduct(item._id)}>
      <img src={item?.image} alt={item?.name ?? ""} />
      <div>{item?.name}</div>
      <div>$ {currencyFormat(item?.price)}</div>
    </div>
  );
};

export default ProductCard;
