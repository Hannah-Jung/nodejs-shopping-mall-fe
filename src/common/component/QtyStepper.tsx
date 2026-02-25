import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface QtyStepperProps {
  value: number;
  onChange: (newValue: number) => void;
  max?: number;
  disabled?: boolean;
  className?: string;
  showLabel?: boolean;
}

const QtyStepper = ({
  value,
  onChange,
  max = 99,
  disabled = false,
  className,
  showLabel = true,
}: QtyStepperProps) => {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const validateAndSet = (val: number) => {
    let sanitized = val;
    if (isNaN(val) || val < 1) sanitized = 1;
    if (val > max) sanitized = max;

    onChange(sanitized);
    setInputValue(String(sanitized));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setInputValue(val);
  };

  const handleBlur = () => {
    validateAndSet(parseInt(inputValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      validateAndSet(parseInt(inputValue));
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className={cn("flex flex-col ", className)}>
      {showLabel && (
        <div className="flex justify-between items-center px-0.5">
          <p className="text-[10px] font-bold text-zinc-400 ">MAX: {max}</p>
        </div>
      )}
      <div
        className={cn(
          "flex items-center border border-zinc-200 bg-white shadow-sm transition-all  focus-within:border-primary",
          showLabel ? "rounded-b-md" : "rounded-md",
          disabled && "opacity-50 pointer-events-none",
        )}
      >
        <button
          type="button"
          onClick={() => validateAndSet(value - 1)}
          disabled={value <= 1}
          className="px-4 py-3 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-50 disabled:opacity-20 transition-colors cursor-pointer"
        >
          <Minus className="size-3.5" strokeWidth={3} />
        </button>

        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-10 text-center text-[13px] font-black font-mono text-zinc-900 border-x border-zinc-100 focus:outline-none focus:bg-zinc-50/50 transition-colors"
        />

        <button
          type="button"
          onClick={() => validateAndSet(value + 1)}
          disabled={value >= max}
          className="px-3 py-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-50 disabled:opacity-20 transition-colors cursor-pointer"
        >
          <Plus className="size-3.5" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default QtyStepper;
