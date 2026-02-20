import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import SearchBox from "../../common/component/SearchBox";
import NewItemDialog from "./component/NewItemDialog";
import ProductTable from "./component/ProductTable";
import {
  getProductList,
  deleteProduct,
  setSelectedProduct,
} from "../../features/product/productSlice";
import type { Product } from "../../features/product/productSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const tableHeader = [
  "#",
  "SKU",
  "IMAGE",
  "NAME",
  "PRICE",
  "STOCK",
  "STATUS",
  "ACTION",
];

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useAppDispatch();
  const { productList, totalPageNum, totalCount } = useAppSelector(
    (state) => state.product,
  );
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState<Record<string, unknown>>({
    page: Number(query.get("page")) || 1,
    name: query.get("name") ?? "",
    sort: "createdAt-desc",
  });
  const [mode, setMode] = useState<"new" | "edit">("new");

  useEffect(() => {
    dispatch(getProductList(searchQuery));
  }, [searchQuery, dispatch]);

  const deleteItem = (id: string) => {
    dispatch(deleteProduct(id));
  };

  const openEditForm = (product: Product) => {
    dispatch(setSelectedProduct(product));
    setMode("edit");
    setShowDialog(true);
  };

  const handleClickNewItem = () => {
    setMode("new");
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    const page = selected + 1;

    setSearchQuery((prev) => ({ ...prev, page }));

    const params = new URLSearchParams(query);
    params.set("page", page.toString());
    navigate(`/admin/product?${params.toString()}`);
  };

  return (
    <div className="locate-center">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mt-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search by product name"
            field="name"
          />
        </div>
        <Button
          className="mt-2 mb-2 cursor-pointer"
          onClick={handleClickNewItem}
        >
          <Plus className="size-5" strokeWidth={2} />
          Add
        </Button>

        <ProductTable
          header={tableHeader}
          data={productList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
          totalCount={totalCount || 0}
          currentPage={Number(searchQuery.page)}
        />
        <ReactPaginate
          nextLabel={<ChevronRight className="size-4" />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={Math.max(1, totalPageNum)}
          forcePage={Number(searchQuery.page) - 1 || 0}
          previousLabel={<ChevronLeft className="size-4" />}
          renderOnZeroPageCount={null}
          containerClassName="pagination flex justify-center items-center gap-2 mt-8 list-none select-none"
          pageClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
          pageLinkClassName="page-link px-4 py-2 block hover:bg-zinc-100 cursor-pointer transition-colors text-sm"
          previousClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
          previousLinkClassName="page-link px-3 py-2 block hover:bg-zinc-100 cursor-pointer text-sm"
          nextClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
          nextLinkClassName="page-link px-3 py-2 block hover:bg-zinc-100 cursor-pointer text-sm"
          breakLabel="..."
          breakClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
          breakLinkClassName="page-link px-4 py-2 block"
          activeClassName="Active bg-zinc-900 border-zinc-900 text-white"
        />

        <NewItemDialog
          mode={mode}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          onSuccess={() => {
            if (mode === "new") {
              setSearchQuery((prev) => ({ ...prev, page: 1 }));
            } else {
              dispatch(getProductList(searchQuery));
            }
          }}
        />
      </div>
    </div>
  );
};

export default AdminProductPage;
