import { Link } from "react-router";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">
                S
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Store<span className="text-primary">.</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              Discover products you'll love. From everyday essentials to
              something special, find everything you need in one place.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 transition hover:border-primary hover:bg-primary hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-[18px] w-[18px]"
                >
                  <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.4v2.2H7v3.2h2.9V21h3.6Z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 transition hover:border-primary hover:bg-primary hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-[18px] w-[18px]"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="18"
                    cy="6"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* X (Twitter) */}
              <a
                href="#"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 transition hover:border-primary hover:bg-primary hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-[18px] w-[18px]"
                >
                  <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.6 22H2.4l7.3-8.4L1.5 2h6.5l4.5 6.7L18.9 2Zm-1.1 18h1.7L6.9 3.9H5.1L17.8 20Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shopping */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Shop
            </h3>
            <ul className="mt-6 space-y-4 text-sm text-gray-400">
              <li>
                <Link to="/products" className="transition hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/deals" className="transition hover:text-white">
                  Today's Deals
                </Link>
              </li>
              <li>
                <Link to="/categories" className="transition hover:text-white">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Your Account
            </h3>
            <ul className="mt-6 space-y-4 text-sm text-gray-400">
              <li>
                <Link to="/account" className="transition hover:text-white">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="transition hover:text-white">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition hover:text-white">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-6 space-y-4 text-sm text-gray-400">
              <li>
                <Link to="/contact" className="transition hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="transition hover:text-white">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact strip */}
        <div className="mt-14 grid grid-cols-1 gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <Mail className="shrink-0 text-primary" size={20} />
            <div>
              <p className="text-xs text-gray-500">Email us</p>
              <p className="mt-1 text-sm text-gray-300">
                support@yourstore.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="shrink-0 text-primary" size={20} />
            <div>
              <p className="text-xs text-gray-500">Call us</p>
              <p className="mt-1 text-sm text-gray-300">+91 XXXXX XXXXX</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="shrink-0 text-primary" size={20} />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="mt-1 text-sm text-gray-300">India</p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Store. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            <Link to="/privacy-policy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition hover:text-white">
              Terms & Conditions
            </Link>
            <Link to="/refund-policy" className="transition hover:text-white">
              Refund Policy
            </Link>
          </div>

          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-white"
          >
            Start Shopping
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
