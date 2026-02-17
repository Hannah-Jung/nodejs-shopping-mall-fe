// import React, { useEffect, useState } from "react";
// import { Container } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import ReactPaginate from "react-paginate";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import OrderDetailDialog from "./component/OrderDetailDialog";
// import OrderTable from "./component/OrderTable";
// import SearchBox from "../../common/component/SearchBox";
// import {
//   getOrderList,
//   setSelectedOrder,
// } from "../../features/order/orderSlice";
// import "./style/adminOrder.style.css";

// const AdminOrderPage = () => {
//   const navigate = useNavigate();
//   const [query] = useSearchParams();
//   const dispatch = useDispatch();
//   const { orderList, totalPageNum } = useSelector((state) => state.order);
//   const [searchQuery, setSearchQuery] = useState({
//     page: query.get("page") || 1,
//     ordernum: query.get("ordernum") || "",
//   });
//   const [open, setOpen] = useState(false);

//   const tableHeader = [
//     "#",
//     "Order#",
//     "Order Date",
//     "User",
//     "Order Item",
//     "Address",
//     "Total Price",
//     "Status",
//   ];

//   useEffect(() => {
//     dispatch(getOrderList({ ...searchQuery }));
//   }, [query]);

//   useEffect(() => {
//     if (searchQuery.ordernum === "") {
//       delete searchQuery.ordernum;
//     }
//     const params = new URLSearchParams(searchQuery);
//     const queryString = params.toString();

//     navigate("?" + queryString);
//   }, [searchQuery]);

//   const openEditForm = (order) => {
//     setOpen(true);
//     dispatch(setSelectedOrder(order));
//   };

//   const handlePageClick = ({ selected }) => {
//     setSearchQuery({ ...searchQuery, page: selected + 1 });
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <div className="locate-center">
//       <Container>
//         <div className="mt-2 display-center mb-2">
//           <SearchBox
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             placeholder="오더번호"
//             field="ordernum"
//           />
//         </div>

//         <OrderTable
//           header={tableHeader}
//           data={orderList}
//           openEditForm={openEditForm}
//         />
//         <ReactPaginate
//           nextLabel="next >"
//           onPageChange={handlePageClick}
//           pageRangeDisplayed={5}
//           pageCount={totalPageNum}
//           forcePage={searchQuery.page - 1}
//           previousLabel="< previous"
//           renderOnZeroPageCount={null}
//           pageClassName="page-item"
//           pageLinkClassName="page-link"
//           previousClassName="page-item"
//           previousLinkClassName="page-link"
//           nextClassName="page-item"
//           nextLinkClassName="page-link"
//           breakLabel="..."
//           breakClassName="page-item"
//           breakLinkClassName="page-link"
//           containerClassName="pagination"
//           activeClassName="active"
//           className="display-center list-style-none"
//         />
//       </Container>

//       {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
//     </div>
//   );
// };

// export default AdminOrderPage;
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
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
import "./style/adminOrder.style.css";
import { useAppDispatch, useAppSelector } from "../../features/hooks";

const tableHeader = [
  "#",
  "Order#",
  "Order Date",
  "User",
  "Order Item",
  "Address",
  "Total Price",
  "Status",
];

const AdminOrderPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useAppDispatch();
  const { orderList, totalPageNum } = useAppSelector((state) => state.order);
  const [searchQuery, setSearchQuery] = useState<Record<string, unknown>>({
    page: Number(query.get("page")) || 1,
    ordernum: query.get("ordernum") ?? "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getOrderList({ ...searchQuery }));
  }, [query, dispatch, searchQuery]);

  useEffect(() => {
    const q: Record<string, string | number> = { ...searchQuery } as Record<
      string,
      string | number
    >;
    if (q.ordernum === "") delete q.ordernum;
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(q).map(([k, v]) => [k, String(v)])),
    );
    navigate("?" + params.toString());
  }, [searchQuery, navigate]);

  const openEditForm = (order: OrderTableOrder) => {
    setOpen(true);
    dispatch(setSelectedOrder(order as unknown as Record<string, unknown>));
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    setSearchQuery((prev) => ({ ...prev, page: selected + 1 }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2 display-center mb-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="오더번호"
            field="ordernum"
          />
        </div>

        <OrderTable
          header={tableHeader}
          data={orderList as unknown as OrderTableOrder[]}
          openEditForm={openEditForm}
        />
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={Math.max(1, totalPageNum)}
          forcePage={Number(searchQuery.page) - 1 || 0}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          className="display-center list-style-none"
        />
      </Container>

      {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
    </div>
  );
};

export default AdminOrderPage;
