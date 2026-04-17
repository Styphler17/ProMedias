import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-100", className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="w-full min-height-[480px] rounded-[32px] bg-white border border-zinc-100 p-0 overflow-hidden flex flex-direction-column">
      {/* Image Area */}
      <Skeleton className="w-full h-[260px] rounded-none" />
      
      {/* Header Area */}
      <div className="p-6 flex justify-between items-center">
        <Skeleton className="h-4 w-20" />
      </div>
      
      {/* Body Area */}
      <div className="px-8 pb-6 space-y-4 flex-grow">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        
        {/* Progress Bar Area */}
        <div className="mt-6 space-y-2">
            <Skeleton className="h-2 w-24" />
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-end">
                <Skeleton className="h-3 w-12" />
            </div>
        </div>
      </div>
      
      {/* Footer Area */}
      <div className="p-6 border-t border-zinc-50 flex gap-3">
        <Skeleton className="h-12 flex-grow rounded-xl" />
        <Skeleton className="h-12 w-1/3 rounded-xl" />
      </div>
    </div>
  );
}
