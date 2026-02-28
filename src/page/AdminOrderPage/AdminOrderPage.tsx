import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";
import OrderDetailDialog from "./component/OrderDetailDialog";
import OrderTable from "./component/OrderTable";
import type { OrderTableOrder } from "./component/OrderTable";
import SearchBox from "../../common/component/SearchBox";
import {
  getOrderList,
  setSelectedOrder,
} from "../../features/order/orderSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";

const tableHeader = [
  "#",
  "Order#",
  "Order Date",
  "Order Item",
  "Total Price",
  "Status",
  "Action",
];

const AdminOrderPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useAppDispatch();
  const { orderList, totalPageNum, totalCount } = useAppSelector(
    (state) => state.order,
  );
  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState<Record<string, string>>({
    page: query.get("page") || "1",
    ordernum: query.get("ordernum") ?? "",
  });

  useEffect(() => {
    dispatch(
      getOrderList({
        ...searchQuery,
        page: Number(searchQuery.page),
        limit: "5",
      }),
    );

    const params = new URLSearchParams();
    if (Number(searchQuery.page) > 1) params.set("page", searchQuery.page);
    if (searchQuery.ordernum) params.set("ordernum", searchQuery.ordernum);

    navigate("?" + params.toString(), { replace: true });
  }, [dispatch, searchQuery, navigate]);

  const openEditForm = (order: OrderTableOrder) => {
    setOpen(true);
    dispatch(setSelectedOrder(order as any));
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    setSearchQuery((prev) => ({ ...prev, page: String(selected + 1) }));
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setSearchQuery({
      page: "1",
      ordernum: "",
    });
    navigate("/admin/order", { replace: true });
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1
          className="text-2xl font-black mb-8 uppercase tracking-tight cursor-pointer"
          onClick={handleReset}
        >
          Order Management
        </h1>

        <div className="mb-6 flex justify-start">
          <div className="w-full w-full">
            <SearchBox
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="SEARCH BY ORDER #"
              field="ordernum"
            />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-sm overflow-hidden mb-8">
          <OrderTable
            header={tableHeader}
            data={orderList as unknown as OrderTableOrder[]}
            openEditForm={openEditForm}
            currentPage={Number(searchQuery.page)}
          />
        </div>

        <ReactPaginate
          nextLabel={<ChevronRight className="size-4" />}
          onPageChange={handlePageClick}
          marginPagesDisplayed={0}
          pageRangeDisplayed={5}
          pageCount={Math.max(1, totalPageNum)}
          forcePage={Number(searchQuery.page) - 1}
          previousLabel={<ChevronLeft className="size-4" />}
          renderOnZeroPageCount={null}
          containerClassName="pagination flex justify-center items-center gap-2 mt-12 list-none select-none"
          pageClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
          pageLinkClassName="page-link px-4 py-2 block hover:bg-zinc-100 cursor-pointer transition-colors text-sm font-bold"
          previousClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
          previousLinkClassName="page-link px-3 py-2 block hover:bg-zinc-100 cursor-pointer"
          nextClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
          nextLinkClassName="page-link px-3 py-2 block hover:bg-zinc-100 cursor-pointer"
          activeClassName="Active bg-primary border-primary text-white"
          breakClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
          breakLinkClassName="page-link px-4 py-2 block"
          activeLinkClassName="!bg-primary !hover:bg-primary text-white cursor-default"
        />
      </div>

      {open && (
        <OrderDetailDialog
          open={open}
          handleClose={() => setOpen(false)}
          isAdmin={true}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};

export default AdminOrderPage;
