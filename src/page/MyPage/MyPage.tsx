import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import OrderStatusCard from "./component/OrderStatusCard";
import "./style/orderStatus.style.css";
import { getOrder } from "../../features/order/orderSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight, TriangleAlert } from "lucide-react";
import OrderDetailDialog from "../AdminOrderPage/component/OrderDetailDialog";

const MyPage = () => {
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
    const page = selected + 1;
    navigate(`?page=${page}`);
    window.scrollTo(0, 0);
  };

  if (loading && orderList.length === 0)
    return (
      <div className="text-center py-20 uppercase font-black tracking-widest text-zinc-400">
        Loading...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-10 tracking-tight uppercase">
        MY ORDERS
      </h1>
      {orderList?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border border-zinc-100 rounded-sm bg-zinc-50/30 text-center px-4">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-8">
            <TriangleAlert
              size={40}
              strokeWidth={2}
              className="text-black mb-1"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </div>
          <h1 className="text-2xl font-black uppercase mb-4">
            No Orders Found
          </h1>
          <p className="text-zinc-500 mb-8 uppercase text-xs tracking-tight">
            Looks like there's no order history yet
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-10 py-4 text-xs font-black uppercase tracking-tighter hover:bg-primary duration-300 transition-all cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      ) : (
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
            pageRangeDisplayed={5}
            pageCount={totalPageNum || 1}
            forcePage={currentPage - 1}
            previousLabel={<ChevronLeft className="size-4" />}
            renderOnZeroPageCount={null}
            containerClassName="pagination flex justify-center items-center gap-2 mt-12 list-none select-none"
            pageClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
            pageLinkClassName="page-link px-4 py-2 block hover:bg-zinc-100 cursor-pointer transition-colors text-sm font-bold"
            previousClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
            previousLinkClassName="page-link px-3 py-2 block hover:bg-zinc-100 cursor-pointer"
            nextClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
            nextLinkClassName="page-link px-3 py-2 block hover:bg-zinc-100 cursor-pointer"
            activeClassName="Active bg-zinc-900 border-zinc-900 text-white"
            breakLabel="..."
            breakClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
            breakLinkClassName="page-link px-4 py-2 block"
          />
        </>
      )}
    </div>
  );
};

export default MyPage;
