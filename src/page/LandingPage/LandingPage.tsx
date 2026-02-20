import { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { useSearchParams } from "react-router-dom";
import { getProductList } from "../../features/product/productSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";

const LandingPage = () => {
  const dispatch = useAppDispatch();
  const productList = useAppSelector((state) => state.product.productList);
  const [query] = useSearchParams();
  const name = query.get("name") ?? "";

  useEffect(() => {
    dispatch(getProductList({ name }));
  }, [query, dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {productList.length > 0 ? (
          productList.map((item) => (
            <div key={item._id}>
              <ProductCard item={item} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-align-center empty-bag">
            {name === "" ? (
              <h2>We're Getting Ready!</h2>
            ) : (
              <h2>No results with {name}</h2>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
