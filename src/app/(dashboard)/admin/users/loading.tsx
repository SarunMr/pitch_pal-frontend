import UserTableSkeleton from "./_components/UserTableSkeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-36 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
          </div>
        </div>
        <div className="h-9 w-28 rounded-lg bg-slate-200 animate-pulse" />
      </div>
      {/* Search bar skeleton */}
      <div className="h-9 w-64 rounded-md bg-slate-200 animate-pulse" />
      {/* Table skeleton */}
      <UserTableSkeleton />
    </div>
  );
}
