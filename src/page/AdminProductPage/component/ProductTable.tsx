import { Button } from "@/components/ui/button";
import type { Product } from "@/features/product/productSlice";
import { SquarePen, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProductTableProps {
  header: string[];
  data: Product[];
  deleteItem: (id: string) => void;
  openEditForm: (product: Product) => void;
  totalCount: number;
  currentPage: number;
}

const SIZE_ORDER = ["single", "double", "family"];

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
        <thead className="hidden sm:table-header-group bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-medium text-center">
          <tr>
            {header.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-xs uppercase tracking-wider"
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
                className={cn(
                  "block sm:table-row border-b border-zinc-100 last:border-none transition-all duration-300",
                  product.status === "inactive"
                    ? "bg-zinc-50/50 opacity-80"
                    : "bg-white hover:bg-zinc-50",
                )}
              >
                <div className="sm:hidden flex justify-between items-center bg-zinc-50 px-4 py-2 border-b border-zinc-100">
                  <span className="font-mono text-[10px] text-zinc-400">
                    #{index + 1 + (currentPage - 1) * 5}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500 font-bold">
                    {product.sku}
                  </span>
                </div>

                <td className="hidden sm:table-cell p-2 sm:py-4 text-zinc-500 text-center font-mono text-xs border-r border-zinc-50/50">
                  {index + 1 + (currentPage - 1) * 5}
                </td>

                <td className="hidden sm:table-cell p-2 sm:py-4 text-center font-mono text-xs border-r border-zinc-50/50">
                  {product.sku}
                </td>

                <td className="block sm:table-cell p-4 sm:p-2 sm:py-4">
                  <div className="flex gap-4 sm:items-center sm:justify-center">
                    <div className="relative shrink-0">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className={cn(
                          "w-24 h-28 sm:w-16 sm:h-20 object-cover rounded-lg border border-zinc-200 shadow-sm transition-all",
                          product.status === "inactive" &&
                            "grayscale opacity-60",
                        )}
                      />
                      <div className="absolute -top-2 -left-2 sm:hidden">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-md text-[9px] font-black uppercase shadow-sm border",
                            product.status === "active"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white",
                          )}
                        >
                          {product.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-1 flex-1 sm:hidden">
                      <div className="font-bold text-zinc-900 leading-tight line-clamp-2 text-base">
                        {product.name}
                      </div>
                      <div className="text-lg font-black text-zinc-900">
                        ${product.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="hidden sm:table-cell p-4 sm:py-4 font-medium text-zinc-900 max-w-[250px]">
                  <div
                    className="line-clamp-2 break-words"
                    title={product.name}
                  >
                    {product.name}
                  </div>
                </td>

                <td className="hidden sm:table-cell p-2 sm:py-4 text-center text-zinc-900 font-semibold">
                  ${product.price.toLocaleString()}
                </td>

                <td className="block sm:table-cell px-4 pb-4 sm:py-4">
                  <div className="grid grid-cols-3 gap-3 bg-zinc-50/50 p-3 rounded-xl sm:bg-transparent sm:p-0 sm:flex sm:flex-col sm:items-center sm:max-w-[120px] sm:mx-auto">
                    {Object.entries(product.stock)
                      .sort(
                        ([a], [b]) =>
                          SIZE_ORDER.indexOf(a.toLowerCase()) -
                          SIZE_ORDER.indexOf(b.toLowerCase()),
                      )
                      .map(([size, qty]) => (
                        <div
                          key={size}
                          className="flex flex-col gap-1 sm:w-full"
                        >
                          <div className="flex justify-between text-[10px]">
                            <span
                              className={cn(
                                "font-bold uppercase",
                                qty <= 0 ? "text-red-600" : "text-zinc-400",
                              )}
                            >
                              {size}
                            </span>
                            <span
                              className={cn(
                                "font-mono font-bold",
                                qty <= 0 ? "text-red-600" : "text-zinc-700",
                              )}
                            >
                              {qty}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-zinc-200 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all duration-500",
                                qty <= 0
                                  ? "bg-zinc-300"
                                  : qty < 20
                                    ? "bg-red-500"
                                    : "bg-emerald-500",
                              )}
                              style={{
                                width: `${Math.min((qty / 100) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </td>

                <td className="hidden sm:table-cell p-2 sm:py-4 text-center">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
                      product.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700",
                    )}
                  >
                    {product.status}
                  </span>
                </td>

                <td className="block sm:table-cell p-4 pt-0 sm:py-4">
                  <div className="flex gap-2 justify-end sm:justify-center border-t sm:border-0 pt-3 sm:pt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-10 flex-1 sm:flex-none sm:h-9 sm:w-9 p-0 hover:text-primary transition-all cursor-pointer bg-white"
                      onClick={() => openEditForm(product)}
                    >
                      <SquarePen className="size-4 mr-2 sm:mr-0" />
                      <span className="sm:hidden text-xs font-bold">EDIT</span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-10 flex-1 sm:flex-none sm:h-9 sm:w-9 p-0 hover:text-red-500 transition-all cursor-pointer bg-white"
                        >
                          <Trash2 className="size-4 mr-2 sm:mr-0" />
                          <span className="sm:hidden text-xs font-bold">
                            DELETE
                          </span>
                        </Button>
                      </AlertDialogTrigger>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={header.length}
                className="py-20 text-center text-zinc-500"
              >
                No results found.
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
