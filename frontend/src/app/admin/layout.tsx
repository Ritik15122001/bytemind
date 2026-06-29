"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAdminStore } from "@/store/useAdminStore";
import { FiZap, FiGrid, FiFileText, FiTag, FiLogOut, FiEye } from "react-icons/fi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, adminInfo, checkAuth, logout } = useAdminStore();

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin/login") router.push("/admin/login");
  }, [isAuthenticated, pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!isAuthenticated) return null;

  const navItems = [
    { icon: FiGrid, label: "Dashboard", href: "/admin/dashboard" },
    { icon: FiEye, label: "Review Drafts", href: "/admin/review" },
    { icon: FiFileText, label: "All Blogs", href: "/admin/blogs" },
    { icon: FiTag, label: "Categories", href: "/admin/categories" },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-bg-border flex flex-col fixed h-full z-50 shadow-card">
        <div className="p-6 border-b border-bg-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center">
              <FiZap className="text-white text-sm" />
            </div>
            <span className="font-bold text-lg">
              <span className="gradient-text">Byte</span>
              <span className="text-text-primary">Mind</span>
            </span>
          </Link>
          <p className="text-xs text-text-muted mt-1 font-medium">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ icon: Icon, label, href }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-purple-50 text-accent-purple border border-purple-100"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
              }`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-bg-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-white text-xs font-bold">
              {adminInfo?.name?.[0] || "A"}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">{adminInfo?.name}</p>
              <p className="text-xs text-text-muted">{adminInfo?.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); router.push("/admin/login"); }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-red-500 hover:bg-red-50 transition-all w-full">
            <FiLogOut className="w-4 h-4" />Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-64 p-8 min-h-screen">{children}</div>
    </div>
  );
}
