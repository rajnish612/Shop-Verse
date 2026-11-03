import React from "react";
import { type Product } from "../types";
import { formatPrice, getDiscountedPrice } from "../data/mockData";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isWished, setIsWished] = React.useState(false);
  const discountedPrice = getDiscountedPrice(
    product.mrpPrice,
    product.discount,
  );

  return (
    <div className="group relative bg-surface rounded-2xl border border-border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-alt">
        <img
          src={product.imageUrls[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-danger text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {product.discount}% OFF
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWished(!isWished);
          }}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-surface/80 backdrop-blur-xs text-text-secondary hover:text-danger hover:bg-surface shadow-xs transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${
              isWished ? "fill-danger text-danger" : "stroke-current"
            }`}
          />
        </button>
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
          {product.categoryName || "General"}
        </span>

        <Link
          to={`/product/${product.id}`}
          className="font-semibold text-text-primary hover:text-primary transition-colors line-clamp-1 mb-2"
        >
          {product.name}
        </Link>

        {/* Rating */}
        {/* <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-amber-500">
            <Star className="w-4 h-4 fill-amber-500" />
            <span className="text-xs font-bold ml-1 text-text-primary">
              {avgRating}
            </span>
          </div>
          <span className="text-xs text-text-muted">
            ({product.numRatings})
          </span>
        </div> */}

        {/* Price and Add button */}
        <div className="mt-auto pt-2 border-t border-border flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-text-primary">
              {formatPrice(discountedPrice)}
            </div>
            {product.discount > 0 && (
              <div className="text-xs text-text-muted line-through">
                {formatPrice(product.mrpPrice)}
              </div>
            )}
          </div>

          <Link
            to={`/product/${product.id}`}
            className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors flex items-center justify-center shadow-xs"
            title="View Product"
          >
            <ShoppingBag className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
