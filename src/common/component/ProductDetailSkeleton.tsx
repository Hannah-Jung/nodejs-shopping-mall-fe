import { Skeleton } from "@/components/ui/skeleton";

export const ProductDetailSkeleton = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-5 lg:py-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
        <div className="aspect-square w-full">
          <Skeleton className="h-full w-full rounded-none bg-zinc-100" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 bg-zinc-100" />
              <Skeleton className="h-5 w-16 bg-zinc-100" />
            </div>
            <Skeleton className="h-10 w-full bg-zinc-100" />
            <Skeleton className="h-8 w-32 bg-zinc-100" />
          </div>

          <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-full bg-zinc-100" />
            <Skeleton className="h-4 w-full bg-zinc-100" />
            <Skeleton className="h-4 w-2/3 bg-zinc-100" />
          </div>

          <div className="space-y-4 mt-8">
            <Skeleton className="h-12 w-full bg-zinc-100" />
            <Skeleton className="h-10 w-32 bg-zinc-100" />
            <Skeleton className="h-14 w-full bg-zinc-100" />
          </div>
        </div>
      </div>
    </div>
  );
};
