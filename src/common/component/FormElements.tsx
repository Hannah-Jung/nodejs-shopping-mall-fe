import { cn } from "@/lib/utils";

export const ErrorField = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <p className="text-[10px] text-red-500 font-semibold uppercase pl-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
      {message}
    </p>
  );
};

export const getFieldStyle = (hasError: boolean) =>
  cn(
    "w-full border px-4 h-12 outline-none transition-colors duration-300 ease-in-out text-xs font-black text-zinc-800 placeholder:text-zinc-400 uppercase antialiased flex items-center bg-white",
    hasError
      ? "border-red-500 ring-1 ring-red-500"
      : "border-zinc-200 focus:border-primary",
  );
