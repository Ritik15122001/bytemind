import { Blog } from "@/types";
import BlogCard from "./BlogCard";
import { BlogCardSkeleton } from "@/components/ui/Loading";

interface BlogGridProps {
  blogs: Blog[];
  loading?: boolean;
  featured?: boolean;
  columns?: 2 | 3;
}

export default function BlogGrid({ blogs, loading = false, featured = false, columns = 3 }: BlogGridProps) {
  if (loading) {
    return (
      <div className={`grid gap-6 ${columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
        {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-text-secondary text-lg">No articles found.</p>
        <p className="text-text-muted text-sm mt-2">Check back soon — new posts drop daily at midnight!</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} featured={featured} />
      ))}
    </div>
  );
}
