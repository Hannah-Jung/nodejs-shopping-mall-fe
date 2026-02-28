import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight, TriangleAlert } from "lucide-react";
import OrderStatusCard from "./OrderStatusCard";
import OrderDetailDialog from "../../AdminOrderPage/component/OrderDetailDialog";
import { getOrder } from "../../../features/order/orderSlice";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";
import "../style/orderStatus.style.css";

const MyOrders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const [open, setOpen] = useState(false);
  const { orderList, loading, totalPageNum } = useAppSelector(
    (state) => state.order,
  );

  const currentPage = Number(query.get("page")) || 1;

  useEffect(() => {
    dispatch(getOrder({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    navigate(`?page=${selected + 1}`);
    window.scrollTo(0, 0);
  };

  if (loading && orderList.length === 0)
    return (
      <div className="text-center py-20 uppercase font-black text-zinc-400">
        Loading...
      </div>
    );

  if (orderList?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-zinc-100 rounded-sm bg-zinc-50/30">
        <TriangleAlert size={40} className="text-zinc-300 mb-4" />
        <h1 className="text-2xl font-black uppercase mb-4">No Orders Found</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-10 py-4 text-xs font-black uppercase hover:bg-[#F97316]"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {orderList.map((item) => (
          <OrderStatusCard
            orderItem={item as any}
            key={item._id}
            onOpenModal={() => setOpen(true)}
          />
        ))}
        <OrderDetailDialog
          open={open}
          handleClose={() => setOpen(false)}
          isAdmin={false}
        />
      </div>
      <ReactPaginate
        nextLabel={<ChevronRight className="size-4" />}
        onPageChange={handlePageClick}
        pageCount={totalPageNum || 1}
        forcePage={currentPage - 1}
        previousLabel={<ChevronLeft className="size-4" />}
        containerClassName="pagination flex justify-center items-center gap-2 mt-12 list-none select-none"
        pageClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
        pageLinkClassName="page-link px-4 py-2 block text-sm font-bold"
        activeClassName="Active bg-zinc-900 border-zinc-900 text-white text-sm"
      />
    </>
  );
};

export default MyOrders;
