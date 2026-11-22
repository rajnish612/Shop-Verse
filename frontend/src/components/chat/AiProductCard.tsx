import { useNavigate } from "react-router";
import type { Product } from "../../types";

interface AiProductCardProps {
  product: Product;
}

function AiProductCard({ product }: AiProductCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/product/${product.id}`)}
      className="flex w-full gap-3 rounded-xl border border-slate-200 bg-white p-2 text-left transition hover:border-slate-400 hover:shadow-md"
    >
      <img
        src={product.imageUrls?.[0] || "/placeholder.png"}
        alt={product.name}
        className="h-20 w-20 shrink-0 rounded-lg object-cover"
      />

      <div className="min-w-0 flex-1">
        <h4 className="line-clamp-2 text-sm font-semibold text-slate-900">
          {product.name}
        </h4>

        <p className="mt-1 text-sm font-bold text-slate-900">
          ₹{product.mrpPrice}
        </p>

        <p
          className={`mt-1 text-xs ${
            product.stockQuantity > 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
        </p>
      </div>
    </button>
  );
}

export default AiProductCard;
