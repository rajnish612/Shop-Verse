import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Heart,
  Package,
  MapPin,
  LogOut,
  UserCircle,
  Store,
  ShieldCheck,
  Folder,
} from "lucide-react";
import { currentUser } from "../../data/mockData";
import type { Category } from "../../types";
import { categoriesApi } from "../../services/categories";
import { cartApi } from "../../services/cart";
import { TEST_USER_ID } from "../../config/testIdentity";
import { NavbarCategoryTree } from "./NavbarCategoryTree";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const categoryRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const submitSearch = () => {
    const keyword = searchValue.trim();
    navigate(keyword ? `/shop?search=${encodeURIComponent(keyword)}` : "/shop");
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(e.target as Node)
      ) {
        setCategoryOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const loadCartCount = () => {
      void cartApi
        .getItems(TEST_USER_ID)
        .then((items) =>
          setCartCount(items.reduce((total, item) => total + item.quantity, 0)),
        )
        .catch((requestError) => {
          console.error(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load cart count.",
          );
        });
    };

    loadCartCount();
    window.addEventListener("cart-updated", loadCartCount);
    return () => window.removeEventListener("cart-updated", loadCartCount);
  }, [location.pathname]);

  useEffect(() => {
    void categoriesApi
      .getAll()
      .then((loadedCategories) => {
        setCategories(
          [...loadedCategories].sort(
            (a, b) => a.level - b.level || a.name.localeCompare(b.name),
          ),
        );
      })
      .catch((requestError) => {
        console.error(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load navigation categories.",
        );
      });
  }, []);

  const userInitial = currentUser.name.charAt(0).toUpperCase();

  const userDropdownItems = [
    { label: "My Profile", href: "/profile", icon: UserCircle },
    { label: "My Orders", href: "/orders", icon: Package },
    { label: "My Addresses", href: "/addresses", icon: MapPin },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left: Logo + hamburger */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link to="/" className="flex items-center gap-2 shrink-0">
                <ShoppingBag className="h-7 w-7 text-indigo-600" />
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                  Shop<span className="text-indigo-600">Verse</span>
                </span>
              </Link>
            </div>

            {/* Center: Desktop nav links + search */}
            <div className="hidden lg:flex items-center gap-1 flex-1 max-w-2xl">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Categories dropdown */}
              <div ref={categoryRef} className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    categoryOpen
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Folder className="h-4 w-4 text-indigo-600" />
                  <span>Categories</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {categoryOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-slate-200/80 border border-slate-100 z-50 animate-in fade-in slide-in-from-top-1">
                    <NavbarCategoryTree
                      categories={categories}
                      onNavigate={() => setCategoryOpen(false)}
                      showSearch
                      maxHeight="max-h-80"
                    />
                  </div>
                )}
              </div>

              {/* Search bar */}
              <div className="relative flex-1 ml-4 flex">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submitSearch();
                  }}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`min-w-0 flex-1 pl-10 pr-4 py-2 text-sm rounded-l-xl border bg-slate-50 transition-all outline-none ${
                    searchFocused
                      ? "border-indigo-400 ring-2 ring-indigo-100 bg-white"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={submitSearch}
                  className="px-4 py-2 rounded-r-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Right: Search icon (mobile), Cart, User */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile search icon */}
              <Link
                to="/shop"
                className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Search className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User dropdown */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold">
                    {userInitial}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="hidden sm:block h-4 w-4 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 rounded-xl bg-white shadow-lg ring-1 ring-slate-200 py-2 animate-in fade-in slide-in-from-top-1">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    {userDropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    ))}

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <div className="px-4 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Management Panels
                      </div>
                      <Link
                        to="/seller"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Store className="h-4 w-4 text-emerald-600" />
                        Seller Center
                      </Link>
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ShieldCheck className="h-4 w-4 text-indigo-600" />
                        Admin Dashboard
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile slide-out drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 shrink-0">
              <Link
                to="/"
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <ShoppingBag className="h-6 w-6 text-indigo-600" />
                <span className="text-lg font-bold text-slate-900">
                  Shop<span className="text-indigo-600">Verse</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable drawer body */}
            <div className="flex-1 overflow-y-auto">
              {/* Mobile search */}
              <div className="p-4">
                <div className="relative flex">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        submitSearch();
                        setMobileOpen(false);
                      }
                    }}
                    className="min-w-0 flex-1 pl-10 pr-4 py-2.5 text-sm rounded-l-xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      submitSearch();
                      setMobileOpen(false);
                    }}
                    className="px-3 py-2.5 rounded-r-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Mobile nav */}
              <div className="px-2 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.href
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile categories */}
              <div className="px-3 pt-3 pb-4 border-t border-slate-100 mt-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
                  Categories
                </p>
                <NavbarCategoryTree
                  categories={categories}
                  onNavigate={() => setMobileOpen(false)}
                  showSearch
                  maxHeight="max-h-64"
                />
              </div>
            </div>

            {/* Mobile user section */}
            <div className="shrink-0 border-t border-slate-200 p-4 bg-slate-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {userDropdownItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-white hover:text-indigo-600 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
