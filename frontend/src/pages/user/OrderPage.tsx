import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Package, RefreshCw } from "lucide-react";

import type { Order } from "../../types";
import { OrderStatus } from "../../types";
import { orderApis } from "../../services/order";
import OrderCard from "../../components/order/OrderCard";

const TEST_USER_ID = 1;

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">(
    "ALL",
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await orderApis.getOrdersForUser(
        TEST_USER_ID,
        selectedStatus === "ALL" ? undefined : selectedStatus,
      );

      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Unable to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-primary"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and manage your orders.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Status filter */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-gray-600">
            {selectedStatus === "ALL"
              ? "All orders"
              : `${selectedStatus.toLowerCase()} orders`}
          </p>

          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as OrderStatus | "ALL")
            }
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-primary"
          >
            <option value="ALL">All Orders</option>
            {Object.values(OrderStatus).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-64 items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-700">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-3 text-sm font-semibold text-red-700 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Package size={30} />
            </div>

            <h2 className="text-xl font-bold text-gray-800">No orders found</h2>

            <p className="mt-2 text-sm text-gray-500">
              {selectedStatus === "ALL"
                ? "You haven't placed any orders yet."
                : `You don't have any ${selectedStatus.toLowerCase()} orders.`}
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
