export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-bg-border" />
        <div className="absolute inset-0 rounded-full border-2 border-t-accent-purple animate-spin" />
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="glass-card p-5 animate-pulse">
      <div className="w-full h-48 bg-bg-border rounded-lg mb-4" />
      <div className="h-4 bg-bg-border rounded w-1/4 mb-3" />
      <div className="h-6 bg-bg-border rounded w-3/4 mb-2" />
      <div className="h-4 bg-bg-border rounded w-full mb-1" />
      <div className="h-4 bg-bg-border rounded w-5/6" />
    </div>
  );
}
