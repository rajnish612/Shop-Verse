import React, { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";

import { OrderStatus } from "../../types";
import type { Order } from "../../types";
import { orderApis } from "../../services/order";

type StatusFilter = OrderStatus | "ALL";

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All orders", value: "ALL" },
  { label: "Pending", value: OrderStatus.PENDING },
  { label: "Confirmed", value: OrderStatus.CONFIRMED },
  { label: "Processing", value: OrderStatus.PROCESSING },
  { label: "Shipped", value: OrderStatus.SHIPPED },
  { label: "Out for delivery", value: OrderStatus.OUT_FOR_DELIVERY },
  { label: "Delivered", value: OrderStatus.DELIVERED },
  { label: "Cancelled", value: OrderStatus.CANCELLED },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);

const formatDate = (date: string) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.CONFIRMED:
      return "bg-blue-50 text-blue-700 ring-blue-600/20";

    case OrderStatus.PROCESSING:
      return "bg-indigo-50 text-indigo-700 ring-indigo-600/20";

    case OrderStatus.SHIPPED:
      return "bg-purple-50 text-purple-700 ring-purple-600/20";

    case OrderStatus.OUT_FOR_DELIVERY:
      return "bg-orange-50 text-orange-700 ring-orange-600/20";

    case OrderStatus.DELIVERED:
      return "bg-green-50 text-green-700 ring-green-600/20";

    case OrderStatus.CANCELLED:
      return "bg-red-50 text-red-700 ring-red-600/20";

    case OrderStatus.PENDING:
    default:
      return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
  }
};

const OrdersAdminPage: React.FC = () => {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await orderApis.getAllForAdmin(
        searchQuery.trim() || undefined,
        selectedStatus === "ALL" ? undefined : selectedStatus,
      );

      setOrderList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update order status
  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus,
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setError(null);

      await orderApis.updateStatus(orderId, newStatus);

      setOrderList((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update order status.",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const toggleOrder = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const totalItems = (order: Order) =>
    order.orderItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer orders, track deliveries and update order statuses.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Package size={17} />
          <span>
            {orderList.length} {orderList.length === 1 ? "order" : "orders"}
          </span>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer, email or transaction ID..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as StatusFilter)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Orders table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="w-12 px-4 py-4"></th>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Update status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <RefreshCw
                      size={24}
                      className="mx-auto animate-spin text-gray-400"
                    />
                    <p className="mt-3 text-sm text-gray-500">
                      Loading orders...
                    </p>
                  </td>
                </tr>
              ) : orderList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Package size={32} className="mx-auto text-gray-300" />
                    <p className="mt-3 font-medium text-gray-700">
                      No orders found
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or status filter.
                    </p>
                  </td>
                </tr>
              ) : (
                orderList.map((order) => {
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        className={`transition hover:bg-gray-50 ${
                          isExpanded ? "bg-gray-50" : ""
                        }`}
                      >
                        {/* Expand */}
                        <td className="px-4 py-4">
                          <button
                            onClick={() => toggleOrder(order.id)}
                            className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                            aria-label={
                              isExpanded ? "Collapse order" : "Expand order"
                            }
                          >
                            {isExpanded ? (
                              <ChevronUp size={17} />
                            ) : (
                              <ChevronDown size={17} />
                            )}
                          </button>
                        </td>

                        {/* Order ID */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <span className="font-semibold text-gray-900">
                            #{order.id}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <p className="whitespace-nowrap text-sm font-medium text-gray-800">
                            {order.userName}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {order.userEmail}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={15} className="text-gray-400" />
                            {formatDate(order.orderDate)}
                          </div>
                        </td>

                        {/* Items */}
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                          {totalItems(order)}{" "}
                          {totalItems(order) === 1 ? "item" : "items"}
                        </td>

                        {/* Total */}
                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
                          {formatPrice(order.totalPrice)}
                        </td>

                        {/* Status badge */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(
                              order.orderStatus,
                            )}`}
                          >
                            {order.orderStatus.replaceAll("_", " ")}
                          </span>
                        </td>

                        {/* Status update */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <select
                            value={order.orderStatus}
                            disabled={updatingOrderId === order.id}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value as OrderStatus,
                              )
                            }
                            className="max-w-[170px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:border-primary disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.filter(
                              (status) => status.value !== "ALL",
                            ).map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>

                      {/* Expanded order details */}
                      {isExpanded && (
                        <tr className="bg-gray-50/70">
                          <td colSpan={8} className="px-6 py-6">
                            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                              {/* Ordered items */}
                              <div className="space-y-3 xl:col-span-2">
                                <div className="flex items-center justify-between">
                                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <Package
                                      size={17}
                                      className="text-gray-500"
                                    />
                                    Ordered items
                                  </h3>

                                  <span className="text-xs text-gray-500">
                                    {order.orderItems.length} products
                                  </span>
                                </div>

                                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                                  <div className="divide-y divide-gray-100">
                                    {order.orderItems.map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
                                      >
                                        {/* Product */}
                                        <div className="flex min-w-0 flex-1 items-center gap-3">
                                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                            {item.imageUrl ? (
                                              <img
                                                src={item.imageUrl}
                                                alt={item.productName}
                                                className="h-full w-full object-cover"
                                              />
                                            ) : (
                                              <div className="flex h-full items-center justify-center text-gray-400">
                                                <Package size={22} />
                                              </div>
                                            )}
                                          </div>

                                          <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-800">
                                              {item.productName}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                              Product ID: {item.productId}
                                            </p>

                                            {item.selectedAttributes?.length >
                                              0 && (
                                              <div className="mt-2 flex flex-wrap gap-1.5">
                                                {item.selectedAttributes.map(
                                                  (attribute) => (
                                                    <span
                                                      key={attribute.id}
                                                      className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                                                    >
                                                      {attribute.name}:{" "}
                                                      {attribute.value}
                                                    </span>
                                                  ),
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="text-sm text-gray-500 sm:w-20 sm:text-center">
                                          Qty: {item.quantity}
                                        </div>

                                        {/* Price */}
                                        <div className="sm:w-32 sm:text-right">
                                          <p className="text-sm font-semibold text-gray-900">
                                            {formatPrice(
                                              item.unitPrice * item.quantity,
                                            )}
                                          </p>
                                          <p className="mt-1 text-xs text-gray-500">
                                            {formatPrice(item.unitPrice)} each
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
                                    <span className="text-sm font-medium text-gray-600">
                                      Order total
                                    </span>
                                    <span className="text-base font-bold text-gray-900">
                                      {formatPrice(order.totalPrice)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Customer, shipping and payment */}
                              <div className="space-y-4">
                                {/* Customer details */}
                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <UserRound
                                      size={16}
                                      className="text-gray-500"
                                    />
                                    Customer
                                  </h3>

                                  <p className="text-sm font-medium text-gray-800">
                                    {order.userName}
                                  </p>
                                  <p className="mt-1 break-all text-xs text-gray-500">
                                    {order.userEmail}
                                  </p>
                                </div>

                                {/* Shipping address */}
                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <MapPin
                                      size={16}
                                      className="text-gray-500"
                                    />
                                    Shipping address
                                  </h3>

                                  <div className="space-y-1 text-sm text-gray-600">
                                    <p>{order.shippingAddress.locality}</p>
                                    <p>
                                      {order.shippingAddress.city},{" "}
                                      {order.shippingAddress.state}
                                    </p>
                                    <p>
                                      {order.shippingAddress.zipCode},{" "}
                                      {order.shippingAddress.country}
                                    </p>
                                  </div>
                                </div>

                                {/* Payment details */}
                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <CreditCard
                                      size={16}
                                      className="text-gray-500"
                                    />
                                    Payment details
                                  </h3>

                                  <div className="space-y-3 text-sm">
                                    <div className="flex justify-between gap-3">
                                      <span className="text-gray-500">
                                        Method
                                      </span>
                                      <span className="font-medium text-gray-800">
                                        {order.paymentMethod}
                                      </span>
                                    </div>

                                    <div className="flex justify-between gap-3">
                                      <span className="text-gray-500">
                                        Payment status
                                      </span>
                                      <span
                                        className={`font-semibold ${
                                          order.paymentStatus === "PAID"
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                        }`}
                                      >
                                        {order.paymentStatus}
                                      </span>
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-gray-500">
                                        Transaction ID
                                      </span>
                                      <p className="break-all font-mono text-xs text-gray-700">
                                        {order.paymentTransactionId || "—"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Delivery date */}
                                {order.deliveryDate && (
                                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                                    <p className="text-xs text-gray-500">
                                      Expected delivery date
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-gray-800">
                                      {formatDate(order.deliveryDate)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Select an order to view its products, customer information, shipping
        address and payment details.
      </p>
    </div>
  );
};

export default OrdersAdminPage;
