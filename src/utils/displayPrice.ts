import type { Product } from "@/features/product/productSlice";

export const getDisplayPrice = (item: Product): number => {
  const SIZE_ORDER = ["single", "double", "family"];

  const availablePrices = SIZE_ORDER.filter(
    (size) => item.stock && item.stock[size] > 0,
  )
    .map((size) => item.price[size as keyof typeof item.price])
    .filter((price): price is number => typeof price === "number" && price > 0);

  if (availablePrices.length > 0) {
    return Math.min(...availablePrices);
  }

  const allPrices = Object.values(item.price || {}).filter(
    (v): v is number => typeof v === "number" && v > 0,
  );

  return allPrices.length > 0 ? Math.min(...allPrices) : 0;
};
