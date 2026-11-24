import React from "react";
import { productApis } from "../services/products";
import { type Product } from "../types";
import ProductCard from "./ProductCard";
import { ArrowRight, Flame } from "lucide-react";
import { Link } from "react-router";

const Deals = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  //Fetch All deals
  React.useEffect(() => {
    productApis
      .getDeals()
      .then((data) => setProducts(data.content))
      .catch((err) => console.log("err fetching product deals", err));
  }, []);
  return (
    <section className="py-12 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-danger uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4" />
              Special Offers
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              Deals & Discounts
            </h2>

            <p className="text-text-secondary mt-2">
              Great prices on selected products. Grab your favorites for less.
            </p>
          </div>

          <Link
            to="/deals"
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary-dark transition-colors text-sm"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-border overflow-hidden"
              >
                <div className="aspect-square bg-surface-alt" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-1/3 rounded bg-surface-alt" />
                  <div className="h-4 w-3/4 rounded bg-surface-alt" />
                  <div className="h-5 w-1/2 rounded bg-surface-alt" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Deals;
