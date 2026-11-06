import React from "react";
import { Link } from "react-router";
import { Package } from "lucide-react";
import type { OrderItem } from "../../types";

interface OrderItemCardProps {
  item: OrderItem;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item }) => {
  return (
    <Link
      to={`/product/${item.productId}`}
      className="flex items-center gap-4 rounded-xl p-2 transition hover:bg-gray-50"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.productName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <Package size={25} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-gray-800">
          {item.productName}
        </p>

        <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>

        {/* Selected Attributes */}
        {item.selectedAttributes?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.selectedAttributes.map((attribute) => (
              <span
                key={attribute.id}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
              >
                {attribute.name}: {attribute.value}
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="shrink-0 text-sm font-semibold text-gray-800">
        {formatPrice(item.unitPrice * item.quantity)}
      </p>
    </Link>
  );
};

export default OrderItemCard;
