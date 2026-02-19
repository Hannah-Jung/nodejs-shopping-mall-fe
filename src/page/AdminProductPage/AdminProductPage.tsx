import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
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

const tableHeader = [
  "#",
  "Sku",
  "Name",
  "Price",
  "Stock",
  "Image",
  "Status",
  "",
];

const AdminProductPage = () => {
  const [query] = useSearchParams();
  const dispatch = useAppDispatch();
  const { productList, totalPageNum } = useAppSelector(
    (state) => state.product,
  );
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState<Record<string, unknown>>({
    page: Number(query.get("page")) || 1,
    name: query.get("name") ?? "",
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
    setSearchQuery((prev) => ({ ...prev, page: selected + 1 }));
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
        <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
          Add New Item +
        </Button>

        <ProductTable
          header={tableHeader}
          data={productList}
          deleteItem={deleteItem}
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

        <NewItemDialog
          mode={mode}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          onSuccess={() => dispatch(getProductList(searchQuery))}
        />
      </div>
    </div>
  );
};

export default AdminProductPage;
