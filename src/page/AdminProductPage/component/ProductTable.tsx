import { Button } from "@/components/ui/button";
import type { Product } from "@/features/product/productSlice";
import { SquarePen, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductTableProps {
  header: string[];
  data: Product[];
  deleteItem: (id: string) => void;
  openEditForm: (product: Product) => void;
  totalCount: number;
  currentPage: number;
}

const ProductTable = ({
  header,
  data,
  deleteItem,
  openEditForm,
  currentPage,
}: ProductTableProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <table className="w-full text-sm text-left">
        <thead className="hidden sm:table-header-group bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-medium">
          <tr>
            {header.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-xs uppercase tracking-wider sm:text-center"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="block sm:table-row-group">
          {data.length > 0 ? (
            data.map((product, index) => (
              <tr
                key={product._id}
                className="block sm:table-row border-b border-zinc-100 last:border-none hover:bg-zinc-50 transition-colors"
              >
                <td className="block sm:table-cell p-2 sm:py-4 before:content-['#'] before:font-bold before:mr-2 sm:before:content-none sm:text-center text-zinc-500">
                  {index + 1 + (currentPage - 1) * 5}
                </td>

                <td className="block sm:table-cell p-2 sm:py-4 sm:before:content-none sm:text-center">
                  <span className="sm:hidden font-bold mr-2 text-zinc-500">
                    SKU:
                  </span>
                  <span className="text-xs">{product.sku}</span>
                </td>

                <td className="block sm:table-cell p-2 sm:py-4 sm:before:content-none sm:text-center">
                  <div className="flex items-center">
                    <span className="sm:hidden font-bold mr-2 text-zinc-500">
                      Image:
                    </span>
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-20 h-20 object-cover border border-zinc-200"
                    />
                  </div>
                </td>
                <td className="block sm:table-cell p-2 sm:py-4 sm:text-left font-medium text-zinc-900 sm:before:content-none">
                  <div className="flex items-center sm:block">
                    {" "}
                    <span className="sm:hidden font-bold mr-2 text-zinc-500 shrink-0">
                      Name:
                    </span>
                    <div
                      className="line-clamp-2 sm:line-clamp-3 break-words max-w-[200px] sm:max-w-[250px]"
                      title={product.name}
                    >
                      {product.name}
                    </div>
                  </div>
                </td>

                <td className="block sm:table-cell p-2 sm:py-4 sm:text-right sm:before:content-none">
                  <span className="sm:hidden font-bold mr-2 text-zinc-500">
                    Price:
                  </span>
                  ${product.price.toLocaleString()}
                </td>

                <td>
                  <div className="space-y-2 p-4">
                    {Object.entries(product.stock).map(([size, qty]) => (
                      <div key={size} className="w-20">
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="font-semibold uppercase">
                            {size}
                          </span>
                          <span className="font-mono">{qty}</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 rounded-md overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-md",
                              qty < 20 ? "bg-orange-400" : "bg-emerald-500",
                            )}
                            style={{
                              width: `${Math.min((qty / 50) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </td>

                <td className="block sm:table-cell p-2 sm:py-4 sm:before:content-none sm:text-center">
                  <span className="sm:hidden font-bold mr-2 text-zinc-500">
                    Status:
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ",
                      product.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700",
                    )}
                  >
                    {product.status}
                  </span>
                </td>

                <td className="block sm:table-cell p-2 sm:py-4">
                  <div className="flex sm:justify-start">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 sm:w-auto sm:px-2 sm:h-9 hover:text-primary hover:bg-zinc-100 transition-all"
                      onClick={() => openEditForm(product)}
                    >
                      <SquarePen className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 sm:w-auto sm:px-2 sm:h-9 hover:text-red-500 hover:bg-zinc-100 transition-all"
                      onClick={() => deleteItem(product._id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="block sm:table-row">
              <td
                colSpan={header.length}
                className="block sm:table-cell py-20 text-center text-zinc-500"
              >
                No results for "{}"
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default ProductTable;
