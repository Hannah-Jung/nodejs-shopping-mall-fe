import { Skeleton } from "../../components/ui/skeleton";

export const ProductSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4">
      <Skeleton className="aspect-square w-full rounded-none bg-zinc-100" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 bg-zinc-100" />
        <Skeleton className="h-4 w-1/4 bg-zinc-100" />
      </div>
    </div>
  );
};
