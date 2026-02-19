import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
import { CATEGORY, STATUS, SIZE } from "../../../constants/product.constants";
import "../style/adminProduct.style.css";
import {
  clearError,
  createProduct,
  editProduct,
} from "../../../features/product/productSlice";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";
import type { Product } from "@/features/product/productSlice";

type FormControlElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

const InitialFormData: Partial<Product> & {
  stock: Record<string, number>;
  category: string[];
  status: string;
} = {
  name: "",
  sku: "",
  stock: {},
  image: "",
  description: "",
  category: [],
  status: "active",
  price: 0,
};

interface NewItemDialogProps {
  mode: "new" | "edit";
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onSuccess?: () => void;
}

const NewItemDialog = ({
  mode,
  showDialog,
  setShowDialog,
  onSuccess,
}: NewItemDialogProps) => {
  const dispatch = useAppDispatch();
  const { error, success, selectedProduct } = useAppSelector(
    (state) => state.product,
  );
  const [formData, setFormData] = useState(InitialFormData);
  const [stock, setStock] = useState<[string, number][]>([]);
  const [stockError, setStockError] = useState(false);

  useEffect(() => {
    if (success) {
      onSuccess?.();
      setShowDialog(false);
    }
  }, [success, setShowDialog, onSuccess]);

  useEffect(() => {
    if (error || !success) {
      dispatch(clearError());
    }
    if (showDialog) {
      if (mode === "edit" && selectedProduct) {
        setFormData({
          ...selectedProduct,
          stock: (selectedProduct.stock || {}) as Record<string, number>,
          category: (selectedProduct.category ?? []) as string[],
          status: selectedProduct.status ?? "active",
        });
        const sizeArray = Object.entries(
          (selectedProduct.stock || {}) as Record<string, number>,
        ).map(([size, qty]) => [size, qty] as [string, number]);
        setStock(sizeArray);
      } else {
        setFormData({ ...InitialFormData });
        setStock([]);
      }
    }
  }, [showDialog, mode, selectedProduct]);

  const handleClose = () => {
    setShowDialog(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (stock.length === 0) return setStockError(true);
    setStockError(false);
    const totalStock = stock.reduce<Record<string, number>>((total, item) => {
      return { ...total, [item[0]]: item[1] };
    }, {});
    const payload = {
      ...formData,
      stock: totalStock,
    };

    if (mode === "new") {
      dispatch(createProduct(payload));
    } else {
      if (selectedProduct?._id) {
        dispatch(editProduct({ id: selectedProduct._id, ...payload }));
      }
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target;
    const key = name as keyof typeof formData;
    if (type === "number") {
      setFormData((prev) => ({ ...prev, [key]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const addStock = () => {
    setStock((prev) => [...prev, ["", 0]]);
  };

  const deleteStock = (idx: number) => {
    setStock((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSizeChange = (value: string, index: number) => {
    setStock((prev) => {
      const next = [...prev];
      next[index] = [value, next[index][1]];
      return next;
    });
  };

  const handleStockChange = (value: string, index: number) => {
    setStock((prev) => {
      const next = [...prev];
      next[index] = [next[index][0], Number(value) || 0];
      return next;
    });
  };

  const onHandleCategory = (event: React.ChangeEvent<FormControlElement>) => {
    const value = (event.target as HTMLSelectElement).value;
    if (formData.category?.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        category: prev.category?.filter((item) => item !== value) ?? [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        category: [...(prev.category ?? []), value],
      }));
    }
  };

  const uploadImage = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  if (!showDialog) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        aria-hidden
        onClick={handleClose}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-item-dialog-title"
      >
        <div
          className="form-container max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex justify-between items-center">
            <h2 id="new-item-dialog-title" className="text-lg font-semibold">
              {mode === "new" ? "Create New Product" : "Edit Product"}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-2xl leading-none p-1"
              aria-label="닫기"
            >
              &times;
            </button>
          </div>

          {error && (
            <div className="error-message mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-red-700">
              {error}
            </div>
          )}

          <form className="form-container" onSubmit={handleSubmit}>
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="sku" className="block font-medium mb-1">
                  SKU
                </label>
                <input
                  id="sku"
                  name="sku"
                  type="text"
                  placeholder="Enter SKU"
                  required
                  value={formData.sku ?? ""}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="name" className="block font-medium mb-1">
                  NAME
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  required
                  value={formData.name ?? ""}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="block font-medium mb-1">
                DESCRIPTION
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Description"
                rows={3}
                required
                value={formData.description ?? ""}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="mb-3">
              <label className="mr-1 block font-medium mb-1">STOCK</label>
              {stockError && (
                <span className="error-message text-red-600">Add stock</span>
              )}
              <Button type="button" size="sm" onClick={addStock}>
                Add +
              </Button>
              <div className="mt-2 space-y-2">
                {stock.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center sm:grid-cols-12"
                  >
                    <div className="sm:col-span-4">
                      <select
                        required
                        value={item[0] ?? ""}
                        onChange={(e) =>
                          handleSizeChange(e.target.value, index)
                        }
                        className="w-full rounded border border-gray-300 px-3 py-2"
                      >
                        <option value="" disabled>
                          Select size
                        </option>
                        {SIZE.map((s, i) => (
                          <option
                            key={i}
                            value={s.toLowerCase()}
                            disabled={stock.some(
                              ([size]) => size === s.toLowerCase(),
                            )}
                          >
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-6">
                      <input
                        type="number"
                        placeholder="number of stock"
                        required
                        value={item[1]}
                        onChange={(e) =>
                          handleStockChange(e.target.value, index)
                        }
                        className="w-full rounded border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteStock(index)}
                      >
                        -
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="block font-medium mb-1">IMAGE</label>
              <CloudinaryUploadWidget uploadImage={uploadImage} />
              <img
                id="uploadedimage"
                // src={formData.image}
                className="upload-image mt-2"
                // alt="uploadedimage"
              />
            </div>

            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="price" className="block font-medium mb-1">
                  PRICE
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0"
                  required
                  value={formData.price ?? 0}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="category" className="block font-medium mb-1">
                  CATEGORY
                </label>
                <select
                  id="category"
                  multiple
                  required
                  value={formData.category ?? []}
                  onChange={onHandleCategory}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                >
                  {CATEGORY.map((item, idx) => (
                    <option key={idx} value={item.toLowerCase()}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block font-medium mb-1">
                  STATUS
                </label>
                <select
                  id="status"
                  required
                  value={formData.status ?? "active"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: (e.target as HTMLSelectElement).value,
                    }))
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2"
                >
                  {STATUS.map((item, idx) => (
                    <option key={idx} value={item.toLowerCase()}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit">{mode === "new" ? "Submit" : "Edit"}</Button>
          </form>
        </div>
      </div>
    </>
  );
};
export default NewItemDialog;
