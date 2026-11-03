import React from "react";
import { type Product } from "../types";
import ProductCard from "./ProductCard";
import { PackageSearch } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <div className="aspect-square bg-surface-alt" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-1/3 rounded bg-surface-alt" />
              <div className="h-4 w-3/4 rounded bg-surface-alt" />
              <div className="h-5 w-1/2 rounded bg-surface-alt" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
        <PackageSearch className="mb-4 h-12 w-12 text-text-muted" />

        <h3 className="text-lg font-semibold text-text-primary">
          No products found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-text-muted">
          We couldn't find any products matching your filters. Try adjusting
          your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
