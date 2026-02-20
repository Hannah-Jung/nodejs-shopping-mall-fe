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
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

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
  image: [],
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

const ErrorMsg = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1">
      {message}
    </p>
  ) : null;

const NewItemDialog = ({
  mode,
  showDialog,
  setShowDialog,
  onSuccess,
}: NewItemDialogProps) => {
  const dispatch = useAppDispatch();
  const { error, success, selectedProduct, productList } = useAppSelector(
    (state) => state.product,
  );
  const [formData, setFormData] = useState(InitialFormData);
  const [stock, setStock] = useState<[string, number][]>([]);
  const [stockError, setStockError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (success) {
      onSuccess?.();
      setShowDialog(false);
    }
  }, [success, setShowDialog, onSuccess]);

  useEffect(() => {
    if (showDialog) {
      if (mode === "edit" && selectedProduct) {
        setFormData({
          ...selectedProduct,
          stock: (selectedProduct.stock || {}) as Record<string, number>,
          category: (selectedProduct.category ?? []) as string[],
          status: selectedProduct.status ?? "active",
        });
        const sizeArray = Object.entries(selectedProduct.stock || {}).map(
          ([size, qty]) => [size, qty] as [string, number],
        );
        setStock(sizeArray);
      } else {
        const nums = productList.map((p) => {
          const match = p.sku.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        });
        const maxNum = nums.length > 0 ? Math.max(...nums) : 0;
        const nextSku = `P${(maxNum + 1).toString().padStart(3, "0")}`;

        setFormData({
          ...InitialFormData,
          sku: nextSku,
          status: "active",
        });
        setStock([]);
      }
      dispatch(clearError());
    }
  }, [showDialog, mode, selectedProduct]);

  const handleClose = () => {
    setShowDialog(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    if (stock.length === 0) {
      setStockError(true);
      return;
    }

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

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = "Product name is required.";
    if (!formData.description?.trim())
      newErrors.description = "Description is required.";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be greater than 0.";
    if (!formData.image || formData.image.length === 0)
      newErrors.image = "At least one image is required.";
    if (!formData.category || formData.category.length === 0)
      newErrors.category = "Please select at least one category.";

    if (stock.length === 0) {
      newErrors.stock = "Please add at least one stock entry.";
    } else if (stock.some((item) => !item[0])) {
      newErrors.stock = "Size selection required for all entries.";
    } else if (stock.some((item) => item[1] <= 0)) {
      newErrors.stock = "Stock quantity must be greater than 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target;
    const key = name as keyof typeof formData;

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (type === "number") {
      const numericValue = value === "" ? "" : Number(value);
      setFormData((prev) => ({ ...prev, [key]: numericValue as any }));
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
    if (errors.stock) setErrors((prev) => ({ ...prev, stock: "" }));
    setStock((prev) => {
      const next = [...prev];
      next[index] = [value, next[index][1]];
      return next;
    });
  };

  const handleStockChange = (value: string, index: number) => {
    if (errors.stock) setErrors((prev) => ({ ...prev, stock: "" }));
    setStock((prev) => {
      const next = [...prev];
      const newValue = value === "" ? "" : Number(value);
      next[index] = [next[index][0], newValue as number];
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
    setErrors((prev) => ({ ...prev, image: "" }));
    setFormData((prev) => ({
      ...prev,
      image: [...(prev.image || []), url],
    }));
  };

  const deleteImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      image: (prev.image || []).filter((_: string, i: number) => i !== index),
    }));
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    setFormData((prev) => {
      const images = [...(prev.image || [])];
      const targetIndex = direction === "left" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= images.length) return prev;

      [images[index], images[targetIndex]] = [
        images[targetIndex],
        images[index],
      ];

      return { ...prev, image: images };
    });
  };

  if (!showDialog) return null;

  const inputStyles =
    "w-full rounded-md border border-input bg-muted/30 px-3 py-2 outline-none transition-colors duration-200 focus:border-primary/75";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 cursor-pointer animate-in fade-in duration-300"
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
          className="page-transition form-container max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex justify-between items-center">
            <h2 id="new-item-dialog-title" className="text-lg font-semibold">
              {mode === "new" ? "Create New Product" : "Edit Product"}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-2xl leading-none p-1 cursor-pointer"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {error && (
            <div className="error-message mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-red-700">
              {error}
            </div>
          )}

          <form className="form-container" onSubmit={handleSubmit} noValidate>
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="sku" className="block font-medium mb-1">
                  SKU (Auto-generated)
                </label>
                <input
                  id="sku"
                  name="sku"
                  type="text"
                  placeholder="Generating SKU..."
                  required
                  value={formData.sku ?? ""}
                  readOnly
                  className={`${inputStyles} bg-gray-100 cursor-not-allowed text-gray-500`}
                />
              </div>
              <div>
                <label htmlFor="name" className="block font-medium mb-1">
                  PRODUCT NAME
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Product Name"
                  required
                  value={formData.name ?? ""}
                  onChange={handleChange}
                  className={cn(inputStyles, errors.name && "border-red-500")}
                />
                <ErrorMsg message={errors.name} />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="block font-medium mb-1">
                PRODUCT DESCRIPTION
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Product Description"
                rows={3}
                required
                value={formData.description ?? ""}
                onChange={handleChange}
                className={inputStyles}
              />
              <ErrorMsg message={errors.description} />
            </div>

            <div className="mb-3">
              <label className="mr-1 block font-medium mb-1">STOCK</label>
              {stockError && (
                <span className="error-message text-red-600">Add stock</span>
              )}
              <Button
                type="button"
                size="sm"
                onClick={addStock}
                className="cursor-pointer"
              >
                <Plus />
                Add
              </Button>
              <ErrorMsg message={errors.stock} />
              <div className="mt-2 space-y-2">
                {stock.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center sm:grid-cols-12"
                  >
                    <div className="sm:col-span-4">
                      <Select
                        required
                        value={item[0] ?? ""}
                        onValueChange={(value) =>
                          handleSizeChange(value, index)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            inputStyles,
                            "bg-[#fbfbfb] text-[#737373] border-input focus:ring-primary/75",
                          )}
                        >
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#fbfbfb] border-zinc-200 shadow-lg">
                          {SIZE.map((s, i) => (
                            <SelectItem
                              key={i}
                              value={s}
                              disabled={stock.some(([size]) => size === s)}
                            >
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-6">
                      <input
                        type="number"
                        placeholder="Quantity"
                        required
                        value={item[1] === 0 ? "" : item[1]}
                        onChange={(e) =>
                          handleStockChange(e.target.value, index)
                        }
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            handleStockChange("", index);
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            handleStockChange("0", index);
                          }
                        }}
                        className={inputStyles}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Button
                        type="button"
                        variant="destructive"
                        className="cursor-pointer"
                        size="sm"
                        onClick={() => deleteStock(index)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="block font-medium mb-1">IMAGE</label>
              <div className="flex flex-col items-start">
                <CloudinaryUploadWidget uploadImage={uploadImage} />
                <ErrorMsg message={errors.image} />
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                {formData.image?.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="relative group w-32 h-40 border rounded-md overflow-hidden bg-gray-50 flex flex-col"
                  >
                    <div className="relative flex-1">
                      <img
                        src={imgUrl}
                        alt={`product-${index}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                          MAIN
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center p-1 bg-white border-t">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveImage(index, "left")}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          <ArrowLeft size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={index === (formData.image?.length ?? 0) - 1}
                          onClick={() => moveImage(index, "right")}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          <ArrowRight size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteImage(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                  value={formData.price === 0 ? "" : formData.price}
                  onChange={handleChange}
                  onFocus={(e) => {
                    if (formData.price === 0) {
                      setFormData((prev) => ({ ...prev, price: "" as any }));
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setFormData((prev) => ({ ...prev, price: 0 }));
                    }
                  }}
                  className={inputStyles}
                />
                <ErrorMsg message={errors.price} />
              </div>
              <div>
                <label htmlFor="category" className="block font-medium mb-1">
                  CATEGORY
                </label>
                <div className="mb-3">
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-md border border-input bg-muted/30">
                    {CATEGORY.map((item) => {
                      const value = item.toLowerCase();
                      const isChecked = formData.category?.includes(value);

                      return (
                        <div
                          key={value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`category-${value}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (errors.category)
                                setErrors((prev) => ({
                                  ...prev,
                                  category: "",
                                }));
                              if (checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  category: [...(prev.category ?? []), value],
                                }));
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  category:
                                    prev.category?.filter((c) => c !== value) ??
                                    [],
                                }));
                              }
                            }}
                            className="border-zinc-500 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                          />
                          <label
                            htmlFor={`category-${value}`}
                            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  <ErrorMsg message={errors.category} />
                </div>
              </div>
              <div>
                <label htmlFor="status" className="block font-medium mb-1">
                  STATUS
                </label>
                <Select
                  required
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value,
                    }))
                  }
                >
                  <SelectTrigger className={inputStyles}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent className="bg-[#fbfbfb] border-zinc-200 shadow-lg">
                    {STATUS.map((item, idx) => (
                      <SelectItem key={idx} value={item.toLowerCase()}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-center">
              <Button type="submit" className="cursor-pointer">
                {mode === "new" ? "Submit" : "Edit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default NewItemDialog;
