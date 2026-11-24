import { href, Link, useLocation, useNavigate } from "react-router";
import {
  ShoppingBag,
  ShoppingCart,
  Menu,
  ChevronDown,
  Package,
  MapPin,
  UserCircle,
  Folder,
  X,
  LayoutDashboard,
} from "lucide-react";
import NavbarCategoryTree from "./NavbarCategoryTree";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authApis } from "../../services/auth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
];

const userDropdownItems = [
  { label: "My Profile", href: "/profile", icon: UserCircle },
  { label: "My Orders", href: "/orders", icon: Package },
  { label: "My Addresses", href: "/addresses", icon: MapPin },
  { label: "Used Coupons", href: "/coupons", icon: Folder },
];

export function Navbar() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();

  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo + Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <Link to="/" className="flex shrink-0 items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-indigo-600" />
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Shop<span className="text-indigo-600">Verse</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden max-w-2xl flex-1 items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Categories */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                aria-expanded={isCategoryOpen}
              >
                <Folder className="h-4 w-4 text-indigo-600" />
                Categories
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                  <NavbarCategoryTree
                    onNavigate={() => setIsCategoryOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>
          {!loading && user?.roles.includes("ADMIN") && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                location.pathname.startsWith("/admin")
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Panel
            </Link>
          )}
          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {/* User Dropdown */}
            {user && (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-slate-100"
                  aria-expanded={isUserDropdownOpen}
                  aria-haspopup="true"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-700 sm:block">
                    {user.name}
                  </span>

                  <ChevronDown
                    className={`hidden h-4 w-4 text-slate-400 transition-transform sm:block ${
                      isUserDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    {/* Dropdown Header */}
                    <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    {/* Dropdown Links */}
                    <div className="p-2">
                      {userDropdownItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-100 p-2">
                      <button
                        onClick={async () => {
                          await authApis.logout();
                          navigate("/login");
                        }}
                        className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 top-16 z-[55] bg-black/30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-16 left-0 z-[60] flex w-80 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-2xl lg:hidden">
            {/* Mobile Navigation */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-1 px-2 py-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      location.pathname === link.href
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Categories */}
              <div className="mt-2 border-t border-slate-100 px-3 pb-4 pt-3">
                <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Categories
                </p>

                <Link
                  to="/shop"
                  className="mb-2 block rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Browse all products
                </Link>

                <NavbarCategoryTree
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </div>

            {/* Mobile User Section */}
            {user && (
              <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"></div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {userDropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-white hover:text-indigo-600"
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
