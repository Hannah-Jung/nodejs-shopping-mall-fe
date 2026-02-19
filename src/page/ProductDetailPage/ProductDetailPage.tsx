import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ColorRing } from "react-loader-spinner";
import { currencyFormat } from "../../utils/number";
import "./style/productDetail.style.css";
import { getProductDetail } from "../../features/product/productSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";

const ProductDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedProduct, loading } = useAppSelector((state) => state.product);
  const user = useAppSelector((state) => state.user.user);
  const [size, setSize] = useState("");
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetail(id));
    }
  }, [id, dispatch]);

  const addItemToCart = () => {
    void dispatch;
    void user;
    void navigate;
  };
  const selectSize = (value: string) => {
    setSize(value);
    setSizeError(false);
  };

  if (loading || !selectedProduct) {
    return (
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    );
  }

  const stock = selectedProduct.stock as Record<string, number>;

  return (
    <div className="mx-auto max-w-6xl px-4 product-detail-card">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <img
            src={selectedProduct.image}
            className="w-full"
            alt={selectedProduct.name ?? "product"}
          />
        </div>
        <div className="product-info-area sm:col-span-1">
          <div className="product-info">{selectedProduct.name}</div>
          <div className="product-info">
            $ {currencyFormat(selectedProduct.price)}
          </div>
          <div className="product-info">{selectedProduct.description}</div>

          <label htmlFor="size-select" className="sr-only">
            Select size
          </label>
          <select
            id="size-select"
            value={size}
            onChange={(e) => selectSize(e.target.value)}
            className={`size-drop-down w-full rounded border px-3 py-2 ${
              sizeError ? "border-red-500 outline-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select size</option>
            {Object.keys(stock).length > 0 &&
              Object.keys(stock).map((item, index) => (
                <option key={index} value={item} disabled={stock[item] <= 0}>
                  {item.toUpperCase()}
                </option>
              ))}
          </select>
          <div
            className={
              sizeError ? "warning-message text-red-600" : "warning-message"
            }
          >
            {sizeError && "Select size"}
          </div>
          <Button
            variant="default"
            className="add-button mt-2"
            onClick={addItemToCart}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
