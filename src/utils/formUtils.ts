import { cn } from "@/lib/utils";

export const getFieldStyle = (hasError: boolean) =>
  cn(
    "w-full border px-4 h-12 outline-none transition-colors duration-300 ease-in-out text-xs font-black text-zinc-800 placeholder:text-zinc-400 uppercase antialiased flex items-center bg-white",
    hasError
      ? "border-red-500 ring-1 ring-red-500"
      : "border-zinc-200 focus:border-primary",
  );

export const formFilters = {
  numeric: (val: string) => val.replace(/\D/g, ""),

  alphabetic: (val: string) =>
    val.replace(/[0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~]/g, ""),

  cardNumber: (val: string) =>
    val
      .replace(/\D/g, "")
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim(),
};
