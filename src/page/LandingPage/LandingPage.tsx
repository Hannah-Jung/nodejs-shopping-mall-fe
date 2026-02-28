import { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { useSearchParams } from "react-router-dom";
import { getProductList } from "../../features/product/productSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight, TriangleAlert } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import { ProductSkeleton } from "@/common/component/ProductSkeleton";

const LandingPage = () => {
  const dispatch = useAppDispatch();
  const { loading: userLoading } = useAppSelector((state) => state.user);
  const { productList, totalPageNum, loading, error } = useAppSelector(
    (state) => state.product,
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const name = searchParams.get("name") ?? "";
  const page = searchParams.get("page") ?? "1";

  const handleRetry = () => {
    dispatch(getProductList({ page, limit: 12, name }));
  };

  useEffect(() => {
    if (userLoading) return;
    if (!searchParams.get("page")) {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");

      setSearchParams(params, { replace: true });
      return;
    }
    dispatch(
      getProductList({
        page: page,
        limit: 12,
        name,
      }),
    );
  }, [name, page, dispatch, searchParams, setSearchParams, userLoading]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(selected + 1));
    setSearchParams(params);
  };

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 12 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : error ? (
            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
              <TriangleAlert
                size={78}
                strokeWidth={1.5}
                className="text-zinc-900 mb-6"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
              <h2 className="text-xl font-bold text-zinc-500 uppercase tracking-tight">
                Something went wrong
              </h2>
              <p className="text-zinc-500 text-sm max-w-xs">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 px-6 py-2 bg-zinc-900 text-white text-xs font-bold uppercase hover:bg-orange-500 transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : productList.length > 0 ? (
            productList.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <h2 className="text-xl font-medium text-zinc-500">
                {name === ""
                  ? "We're Getting Ready!"
                  : `No results for "${name}"`}
              </h2>
            </div>
          )}
        </div>
        {!loading && productList.length > 0 && (
          <div className="mt-12">
            <ReactPaginate
              nextLabel={<ChevronRight className="size-4" />}
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={totalPageNum}
              forcePage={Number(page) - 1}
              previousLabel={<ChevronLeft className="size-4" />}
              renderOnZeroPageCount={null}
              containerClassName="pagination flex justify-center items-center gap-2 list-none select-none"
              pageClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
              pageLinkClassName="page-link px-4 py-2 block hover:bg-zinc-100 cursor-pointer transition-colors text-sm  font-bold"
              previousClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
              previousLinkClassName="page-link px-3 py-2 block hover:bg-zinc-100 cursor-pointer text-sm"
              nextClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
              nextLinkClassName="page-link px-3 py-2 block hover:bg-zinc-100 cursor-pointer text-sm"
              breakLabel="..."
              breakClassName="page-item border border-zinc-200 rounded-md overflow-hidden"
              breakLinkClassName="page-link px-4 py-2 block"
              activeLinkClassName="!bg-orange-500 !border-orange-500 !text-white cursor-default"
              activeClassName="active bg-orange-500 border-orange-500 text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
