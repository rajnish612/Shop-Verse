import React from "react";
import { Link } from "react-router";
import { Package, CalendarDays, CreditCard, ArrowRight } from "lucide-react";
import type { Order } from "../../types";
import OrderItemCard from "./OrderItemCard";

interface OrderCardProps {
  order: Order;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getStatusStyle = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";
    case "SHIPPED":
      return "bg-purple-100 text-purple-700";
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "PENDING":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Order header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Order #{order.id}</p>

          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays size={15} />
            <span>Placed on {formatDate(order.orderDate)}</span>
          </div>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
            order.orderStatus,
          )}`}
        >
          {order.orderStatus}
        </span>
      </div>

      {/* Order items */}
      <div className="space-y-2 py-4">
        {order.orderItems.map((item) => (
          <OrderItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Order footer */}
      <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CreditCard size={15} />
          <span>
            {order.paymentMethod} · {order.paymentStatus}
          </span>
        </div>

        <p className="text-lg font-bold text-gray-900">
          Total: {formatPrice(order.totalPrice)}
        </p>
      </div>
    </article>
  );
};

export default OrderCard;
