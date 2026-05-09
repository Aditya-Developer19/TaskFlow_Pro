import { Skeleton } from '../ui/Skeleton';

export default function TaskCardSkeleton() {
  return (
    <div className="bg-white dark:bg-surface-cardDark p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-1.5 w-8 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}
