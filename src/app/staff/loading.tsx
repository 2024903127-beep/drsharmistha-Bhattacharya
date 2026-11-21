export default function StaffLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading staff portal section">
      {/* Header Skeleton */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="skeleton h-9 w-64 rounded-xl" />
          <div className="skeleton mt-2 h-4 w-96 max-w-full rounded-lg opacity-70" />
        </div>
        <div className="skeleton h-10 w-32 rounded-xl opacity-60" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass p-5 space-y-2">
            <div className="skeleton h-4 w-28 rounded-md opacity-60" />
            <div className="skeleton h-8 w-24 rounded-lg" />
            <div className="skeleton h-3 w-36 rounded-md opacity-40" />
          </div>
        ))}
      </div>

      {/* Table / Card skeleton */}
      <div className="solid overflow-hidden p-6">
        <div className="mb-4 flex items-center justify-between border-b border-p-border pb-3">
          <div className="skeleton h-5 w-48 rounded-lg" />
          <div className="skeleton h-8 w-24 rounded-xl opacity-70" />
        </div>
        <div className="space-y-4 pt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b border-p-border/40 last:border-0">
              <div className="skeleton h-4 w-24 rounded-md" />
              <div className="skeleton h-4 w-40 rounded-md" />
              <div className="skeleton h-4 w-32 rounded-md hidden md:block" />
              <div className="skeleton h-6 w-20 rounded-full ml-auto" />
              <div className="skeleton h-8 w-16 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
