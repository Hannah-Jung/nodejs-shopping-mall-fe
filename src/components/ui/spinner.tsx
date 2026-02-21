import { Loader2 } from "lucide-react";

const Spinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={
        className ||
        "fixed inset-0 flex items-center justify-center bg-white/50 z-[9999]"
      }
    >
      <Loader2 className="size-10 animate-spin text-orange-500" />
    </div>
  );
};

export default Spinner;
