import Link from "next/link";
import Image from "next/image";
import { Blog, Category } from "@/types";
import { formatDate } from "@/lib/utils";
import { FiClock, FiEye } from "react-icons/fi";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

export default function BlogCard({ blog, featured = false }: BlogCardProps) {
  const category = blog.category as Category;

  if (featured) {
    return (
      <Link href={`/blog/${blog.slug}`} className="group block glass-card overflow-hidden hover:border-accent-purple/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
        <div className="relative h-64 overflow-hidden">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent-purple/20 to-accent-cyan/10 flex items-center justify-center">
              <span className="text-4xl">{typeof category === "object" ? category.icon : "🤖"}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            {typeof category === "object" && (
              <CategoryBadge name={category.name} slug={category.slug} color={category.color} icon={category.icon} />
            )}
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-accent-purple transition-colors">
            {blog.title}
          </h2>
          <p className="text-text-secondary text-sm line-clamp-3 mb-4">{blog.excerpt}</p>
          <div className="flex items-center gap-4 text-text-muted text-xs">
            <span>{formatDate(blog.publishedAt)}</span>
            <span className="flex items-center gap-1"><FiClock className="w-3 h-3" />{blog.readTime} min</span>
            <span className="flex items-center gap-1"><FiEye className="w-3 h-3" />{blog.views}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${blog.slug}`} className="group flex gap-4 p-4 glass-card rounded-xl hover:border-accent-purple/30 transition-all duration-300">
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
        {blog.coverImage ? (
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent-purple/20 to-accent-cyan/10 flex items-center justify-center text-2xl">
            {typeof category === "object" ? category.icon : "🤖"}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: typeof category === "object" ? category.color : "#7c3aed" }}>
            {blog.categoryName}
          </span>
        </div>
        <h3 className="font-semibold text-text-primary text-sm line-clamp-2 mb-1 group-hover:text-accent-purple transition-colors">
          {blog.title}
        </h3>
        <div className="flex items-center gap-3 text-text-muted text-xs">
          <span>{formatDate(blog.publishedAt)}</span>
          <span className="flex items-center gap-1"><FiClock className="w-3 h-3" />{blog.readTime}m</span>
        </div>
      </div>
    </Link>
  );
}
