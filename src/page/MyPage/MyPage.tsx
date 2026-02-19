import { useEffect } from "react";
import OrderStatusCard from "./component/OrderStatusCard";
import type { OrderStatusCardOrder } from "./component/OrderStatusCard";
import "./style/orderStatus.style.css";
import { getOrder } from "../../features/order/orderSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";

const MyPage = () => {
  const dispatch = useAppDispatch();
  const { orderList } = useAppSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  if (orderList?.length === 0) {
    return (
      <div className="no-order-box max-w-4xl mx-auto px-4">
        <div>Hungry? Start your first order now!</div>
      </div>
    );
  }

  return (
    <div className="status-card-container max-w-4xl mx-auto px-4">
      {orderList.map((item) => (
        <OrderStatusCard
          orderItem={item as unknown as OrderStatusCardOrder}
          className="status-card-container"
          key={item._id}
        />
      ))}
    </div>
  );
};

export default MyPage;
