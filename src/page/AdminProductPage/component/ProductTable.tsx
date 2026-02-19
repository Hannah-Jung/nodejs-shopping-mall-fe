import { Button } from "@/components/ui/button";
import { currencyFormat } from "../../../utils/number";
import type { Product } from "@/features/product/productSlice";

interface ProductTableProps {
  header: string[];
  data: Product[];
  deleteItem: (id: string) => void;
  openEditForm: (product: Product) => void;
}

const ProductTable = ({
  header,
  data,
  deleteItem,
  openEditForm,
}: ProductTableProps) => {
  return (
    <div className="overflow-x">
      <table className="w-full border-collapse border border-gray-300 [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:p-2 [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_tr:nth-child(even)]:bg-gray-50 [&_tr:hover]:bg-gray-100">
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
              return (
                <tr key={item._id}>
                  <th>{index}</th>
                  <th>{item.sku}</th>
                  <th style={{ minWidth: "100px" }}>{item.name}</th>
                  <th>{currencyFormat(item.price)}</th>
                  <th>
                    {Object.keys(stock).map((size, i) => (
                      <div key={i}>
                        {size}:{stock[size]}
                      </div>
                    ))}
                  </th>
                  <th>
                    <img src={item.image} width={100} alt="image" />
                  </th>
                  <th>{item.status}</th>
                  <th style={{ minWidth: "100px" }}>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteItem(item._id)}
                      className="mr-1"
                    >
                      -
                    </Button>
                    <Button size="sm" onClick={() => openEditForm(item)}>
                      Edit
                    </Button>
                  </th>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={header.length}>No Data to show</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
