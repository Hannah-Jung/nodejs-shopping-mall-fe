import { Button } from "@/components/ui/button";
import { currencyFormat } from "../../../utils/number";
import type { Product } from "@/features/product/productSlice";
import { SquarePen, Trash2 } from "lucide-react";

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
  totalCount,
  currentPage,
}: ProductTableProps) => {
  const itemsPerPage = 5;
  return (
    <div className="overflow-x">
      <table className="w-full border-collapse border border-gray-300 [&_th]:border [&_th]:border-gray-300 [&_th]:bg-white [&_th]:p-2 [&_td]:border [&_td]:border-gray-300 [&_td]:bg-white [&_td]:p-2 [&_tr:hover]:bg-gray-50">
        <thead>
          <tr>
            {header.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => {
              const stock = item.stock as Record<string, number>;
              const itemsPerPage = 5;
              const displayIndex =
                totalCount > 0
                  ? totalCount - (currentPage - 1) * itemsPerPage - index
                  : data.length - index;
              return (
                <tr key={item._id}>
                  <td className="text-center">{displayIndex}</td>
                  <td className="text-center">{item.sku}</td>
                  <td className="text-center">
                    <img
                      src={
                        item.image && item.image.length > 0
                          ? item.image[0]
                          : "/default-product-image.png"
                      }
                      width={100}
                      alt="image"
                      className="object-cover"
                    />
                  </td>
                  <td className="max-w-[200px] truncate" title={item.name}>
                    {item.name}
                  </td>
                  <td className="text-center">${currencyFormat(item.price)}</td>
                  <td>
                    {Object.keys(stock).map((size, i) => (
                      <div key={i} className="text-sm">
                        {size}: {stock[size]}
                      </div>
                    ))}
                  </td>

                  <td className="text-center">{item.status}</td>
                  <td style={{ minWidth: "100px" }}>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        className="cursor-pointer"
                        size="sm"
                        onClick={() => openEditForm(item)}
                      >
                        <SquarePen />
                      </Button>
                      <Button
                        className="cursor-pointer"
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteItem(item._id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={header.length} className="text-center py-4">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
