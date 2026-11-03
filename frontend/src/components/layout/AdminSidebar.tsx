import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FolderTree,
  Ticket,
  Store,
  SlidersHorizontal,
  Settings,
  ShoppingBag,
  X,
  ArrowLeft,
} from "lucide-react";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Attributes", href: "/admin/attributes", icon: SlidersHorizontal },
];

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-slate-800">
        <Link to="/admin" className="flex items-center gap-2.5">
          <ShoppingBag className="h-7 w-7 text-indigo-400" />
          <div>
            <span className="text-lg font-bold text-white tracking-tight">
              ShopVerse
            </span>
            <span className="block text-[10px] font-semibold text-indigo-400 uppercase tracking-widest -mt-0.5">
              Admin Panel
            </span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {sidebarLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              to={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to store */}
      <div className="p-3 border-t border-slate-800">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Store
        </Link>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800/60">
        <p className="text-[11px] text-slate-500 text-center">
          &copy; {new Date().getFullYear()} ShopVerse
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />
          <aside className="fixed inset-y-0 left-0 w-64 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;
