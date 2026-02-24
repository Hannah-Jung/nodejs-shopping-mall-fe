import { useState, useEffect, useRef } from "react";
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
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ImageIcon,
  Package,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type FormControlElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

const InitialFormData: any = {
  name: "",
  sku: "",
  stock: {},
  image: [],
  description: "",
  category: [],
  status: "active",
  price: {},
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
  const [stock, setStock] = useState<[string, number, number][]>([]);
  const [stockError, setStockError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const stockEndRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
  }, [formData.description]);

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
          price: selectedProduct.price ?? {},
        });

        const sizeArray = Object.entries(selectedProduct.stock || {}).map(
          ([size, qty]) => {
            const priceObj = selectedProduct.price as any;
            const lowerSize = size.toLowerCase();
            const price = priceObj ? priceObj[size] : 0;

            return [lowerSize, qty, price] as [string, number, number];
          },
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
      setErrors({});
      setStockError(false);
      dispatch(clearError());
    }
  }, [showDialog, mode, selectedProduct, productList, dispatch]);

  const handleClose = () => {
    setShowDialog(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const totalStock: Record<string, number> = {};
    const totalObjectPrice: Record<string, number> = {};

    stock.forEach((item) => {
      const size = item[0].toLowerCase();
      const qty = item[1];
      const price = item[2] || 0;

      totalStock[size] = qty;
      totalObjectPrice[size] = price;
    });

    const payload = {
      ...formData,
      stock: totalStock,
      price: totalObjectPrice,
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

    if (!formData.name?.trim()) newErrors.name = "Product name is required";
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (!formData.image || formData.image.length === 0)
      newErrors.image = "At least one image is required";
    if (!formData.category || formData.category.length === 0)
      newErrors.category = "Please select at least one category";

    if (stock.length === 0) {
      newErrors.stock = "Please add at least one stock & price entry";
    } else if (stock.some((item) => !item[0])) {
      newErrors.stock = "Size selection required for all entries";
    } else if (stock.some((item) => item[2] <= 0)) {
      newErrors.stock = "Price must be greater than 0 for all sizes";
    } else if (stock.some((item) => item[1] < 0)) {
      newErrors.stock = "Stock quantity cannot be negative";
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
      setErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (type === "number") {
      const numericValue = value === "" ? "" : Number(value);
      setFormData((prev: any) => ({ ...prev, [key]: numericValue }));
    } else {
      setFormData((prev: any) => ({ ...prev, [key]: value }));
    }
  };

  const addStock = () => {
    setStock((prev) => [...prev, ["", 0, 0]]);
    setTimeout(() => {
      stockEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const deleteStock = (idx: number) => {
    setStock((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSizeChange = (value: string, index: number) => {
    if (errors.stock) setErrors((prev: any) => ({ ...prev, stock: "" }));
    setStock((prev) => {
      const next = [...prev];
      next[index] = [value.toLowerCase(), next[index][1], next[index][2]];
      return next;
    });
  };
  const handleStockChange = (value: string, index: number) => {
    const numValue = value === "" ? 0 : Number(value);

    if (numValue < 0) return;

    if (errors.stock)
      setErrors((prev: Record<string, string>) => ({ ...prev, stock: "" }));

    setStock((prev) => {
      const next = [...prev];
      next[index] = [next[index][0], numValue, next[index][2]];
      return next;
    });
  };

  const handleSizePriceChange = (value: string, index: number) => {
    const numValue = value === "" ? 0 : Number(value);
    if (numValue < 0) return;

    setStock((prev) => {
      const next = [...prev];
      const size = next[index][0];
      const qty = next[index][1];
      next[index] = [size, qty, numValue];
      return next;
    });
  };

  const onHandleCategory = (event: any) => {
    const value = event.target.value;
    if (formData.category?.includes(value)) {
      setFormData((prev: any) => ({
        ...prev,
        category: prev.category?.filter((item: string) => item !== value) ?? [],
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        category: [...(prev.category ?? []), value],
      }));
    }
  };

  const uploadImage = (url: string) => {
    if (formData.image && formData.image.length >= 5) {
      setErrors((prev) => ({ ...prev, image: "Maximum 5 images allowed." }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setFormData((prev: any) => ({
      ...prev,
      image: [...(prev.image || []), url],
    }));
  };

  const deleteImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      image: (prev.image || []).filter((_: string, i: number) => i !== index),
    }));
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    setFormData((prev: any) => {
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
    "w-full rounded-md border border-input bg-background px-3 py-2 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          className="page-transition w-full max-w-2xl max-h-[90vh] overflow-auto rounded-xl bg-white shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-white px-8 py-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                {mode === "new" ? "Create New Product" : "Edit Product"}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-zinc-400 hover:text-zinc-600 transition-colors text-3xl cursor-pointer"
            >
              &times;
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 flex flex-col"
          >
            <div className="p-7 space-y-4 flex-1">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  {error}
                </div>
              )}

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Package className="size-5" />
                  <span className="tracking-tight">BASIC INFORMATION</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1.5 block text-zinc-700">
                      SKU <span className="sm:hidden">(AUTO)</span>
                      <span className="hidden sm:inline">(AUTO-GENERATED)</span>
                    </label>
                    <input
                      value={formData.sku}
                      readOnly
                      className={cn(
                        inputStyles,
                        "h-9 bg-zinc-100 cursor-not-allowed text-zinc-500 font-mono",
                      )}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1.5 block text-zinc-700">
                      STATUS
                    </label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) =>
                        setFormData((p: any) => ({ ...p, status: v }))
                      }
                    >
                      <SelectTrigger
                        className={cn(inputStyles, "h-9 cursor-pointer")}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={4}>
                        {STATUS.map((s) => (
                          <SelectItem key={s} value={s.toLowerCase()}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="w-full">
                  <label className="text-sm font-semibold mb-1.5 block text-zinc-700">
                    PRODUCT NAME
                  </label>
                  <textarea
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={cn(
                      inputStyles,
                      "w-full resize-none py-2 px-3 leading-tight transition-all",
                      "h-14 sm:h-9 sm:py-1.5",
                      errors.name && "border-red-500",
                    )}
                    placeholder="e.g. Chicken Breast Burrito Bowl"
                  />
                  <ErrorMsg message={errors.name} />
                </div>
              </section>

              <div>
                <label className="text-sm font-semibold mb-1.5 block text-zinc-700">
                  PRODUCT DESCRIPTION
                </label>
                <textarea
                  ref={descriptionRef}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={cn(
                    inputStyles,
                    "resize-none overflow-hidden transition-[height] duration-200",
                  )}
                  placeholder="Write a detailed product description..."
                />
                <ErrorMsg message={errors.description} />
              </div>

              <div>
                <label className="text-sm font-semibold mb-1.5 block text-zinc-700">
                  CATEGORY
                </label>
                <div className="flex flex-wrap gap-3 p-4 rounded-xl border bg-zinc-50/50">
                  {CATEGORY.map((item) => {
                    const val = item.toLowerCase();
                    const checked = formData.category?.includes(val);
                    return (
                      <div
                        key={val}
                        onClick={() =>
                          onHandleCategory({ target: { value: val } } as any)
                        }
                        className={cn(
                          "px-4 py-2 rounded-md border text-sm font-medium transition-all cursor-pointer select-none",
                          checked
                            ? "bg-primary border-primary text-white shadow-sm"
                            : "bg-white border-zinc-200 text-zinc-600 hover:border-primary/50 hover:bg-zinc-50",
                        )}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
                <ErrorMsg message={errors.category} />
              </div>

              <Separator className="my-2" />

              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-primary font-bold shrink-0">
                    <ImageIcon className="size-5" />
                    <span>PRODUCT IMAGE</span>
                  </div>
                  <div className="flex justify-end">
                    {(formData.image?.length ?? 0) < 5 ? (
                      <CloudinaryUploadWidget
                        uploadImage={uploadImage}
                        imageCount={formData.image?.length || 0}
                      />
                    ) : (
                      <span className="text-[10px] sm:text-[11px] text-zinc-500 font-bold bg-zinc-100 px-2 py-1.5 rounded tracking-tight text-right shadow-sm">
                        <span className="inline sm:hidden">MAX 5 IMAGES</span>
                        <span className="hidden sm:inline">
                          MAXIMUM OF 5 IMAGES REACHED
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <Card className="border-dashed bg-zinc-50/30 mb-2">
                  <CardContent className="p-4">
                    <ErrorMsg message={errors.image} />

                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
                      {formData.image?.length === 0 ? (
                        <div className="w-full py-10 flex flex-col items-center justify-center text-zinc-400">
                          <ImageIcon className="size-10 mb-2 opacity-20" />
                          <p className="text-sm">No images uploaded yet</p>
                        </div>
                      ) : (
                        formData.image?.map((imgUrl: string, idx: number) => (
                          <div
                            key={idx}
                            className={cn(
                              "relative group border rounded-lg overflow-hidden bg-white shadow-sm transition-transform",
                              "w-64 h-72",
                              "sm:w-32 sm:h-40",
                            )}
                          >
                            <img
                              src={imgUrl}
                              className="w-full h-full object-cover"
                            />
                            {idx === 0 && (
                              <span className="absolute top-2 left-2 bg-primary text-[10px] px-2 py-0.5 rounded-md font-bold text-white shadow-md">
                                MAIN
                              </span>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => moveImage(idx, "left")}
                                  className="p-1 text-white disabled:opacity-30"
                                >
                                  <ArrowUp
                                    size={18}
                                    className="inline sm:hidden cursor-pointer"
                                  />
                                  <ArrowLeft
                                    size={18}
                                    className="hidden sm:inline cursor-pointer"
                                  />
                                </button>
                                <button
                                  type="button"
                                  disabled={
                                    idx === (formData.image?.length ?? 0) - 1
                                  }
                                  onClick={() => moveImage(idx, "right")}
                                  className="p-1 text-white disabled:opacity-30"
                                >
                                  <ArrowDown
                                    size={18}
                                    className="inline sm:hidden cursor-pointer"
                                  />
                                  <ArrowRight
                                    size={18}
                                    className="hidden sm:inline cursor-pointer"
                                  />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => deleteImage(idx)}
                                className="p-1 text-white/40 hover:text-red-400 cursor-pointer transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>

              <Separator />

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Settings className="size-5" />
                    <span>STOCK MANAGEMENT</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStock}
                    className="h-8 gap-1 cursor-pointer"
                  >
                    <Plus className="size-4" /> ADD
                  </Button>
                </div>

                <div className="space-y-3">
                  {stock.length > 0 && (
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      <div className="col-span-3">Size</div>
                      <div className="col-span-4 ">Price</div>
                      <div className="col-span-3 ">Quantity</div>
                      <div className="col-span-2"></div>
                    </div>
                  )}
                  {stock.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-3 p-4 rounded-xl border border-zinc-100 bg-zinc-50/30 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center sm:p-0 sm:border-none sm:bg-transparent animate-in slide-in-from-left-2 duration-300"
                    >
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-zinc-400 mb-1 sm:hidden">
                          SIZE
                        </label>
                        <Select
                          value={item[0]}
                          onValueChange={(v) => handleSizeChange(v, idx)}
                        >
                          <SelectTrigger className="w-full bg-white px-2 sm:px-4 h-9 flex items-center justify-between border-input cursor-pointer">
                            <SelectValue placeholder="SIZE" />
                          </SelectTrigger>

                          <SelectContent position="popper">
                            {SIZE.map((s) => (
                              <SelectItem
                                key={s}
                                value={s.toLowerCase()}
                                disabled={stock.some(
                                  ([size], i) =>
                                    size === s.toLowerCase() && i !== idx,
                                )}
                              >
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sm:col-span-4 relative">
                        <label className="text-[10px] font-bold text-zinc-400 mb-1 sm:hidden">
                          PRICE
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="0.00"
                            value={item[2] || ""}
                            onChange={(e) =>
                              handleSizePriceChange(e.target.value, idx)
                            }
                            className={cn(inputStyles, "h-9 pl-7")}
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                            $
                          </span>
                        </div>
                      </div>
                      <div className="sm:col-span-3 relative">
                        <label className="text-[10px] font-bold text-zinc-400 mb-1 sm:hidden">
                          QUANTITY
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="0"
                            value={item[1]}
                            onChange={(e) =>
                              handleStockChange(e.target.value, idx)
                            }
                            className={cn(inputStyles, "h-9 pr-8 sm:pr-10")}
                          />
                          <span className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 select-none">
                            QTY
                          </span>
                        </div>
                      </div>
                      <div className="sm:col-span-2 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteStock(idx)}
                          className="text-zinc-400 hover:text-red-500 h-9 w-full sm:w-9 hover:bg-transparent transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-5" />
                          <span className="sm:hidden text-xs font-bold">
                            REMOVE
                          </span>
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div ref={stockEndRef} className="h-1" />
                  <ErrorMsg message={errors.stock} />
                </div>
              </section>
            </div>
            <div className="sticky bottom-0 z-10 bg-white border-t px-8 py-5 flex justify-end gap-3 mt-auto">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="px-8 text-zinc-500 hover:bg-zinc-100 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 font-bold text-md shadow-lg bg-black transition-all active:scale-95 cursor-pointer"
              >
                {mode === "new" ? "Create Product" : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default NewItemDialog;
