import React from 'react';
import { Link } from 'react-router';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { adminDashboardStats, orders, products, formatPrice, formatDate, getOrderStatusColor } from '../../data/mockData';
import type { OrderStatus } from '../../types';

export const DashboardPage: React.FC = () => {
  // Stat icons mapping
  const statIcons = [
    { icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' },
    { icon: ShoppingCart, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' },
    { icon: Users, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30' },
    { icon: Package, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/30' },
  ];

  // Monthly revenue mock data for the bar chart
  const monthlyData = [
    { month: 'May', revenue: 142000, percentage: 48 },
    { month: 'Jun', revenue: 178000, percentage: 60 },
    { month: 'Jul', revenue: 195000, percentage: 66 },
    { month: 'Aug', revenue: 230000, percentage: 78 },
    { month: 'Sep', revenue: 265000, percentage: 89 },
    { month: 'Oct', revenue: 298000, percentage: 100 },
  ];

  // Top 4 selling products
  const topProducts = products.slice(0, 4).map((p, idx) => ({
    ...p,
    salesCount: [428, 312, 198, 154][idx],
    revenueGenerated: [428 * 133308, 312 * 114399, 198 * 189905, 154 * 1499][idx],
  }));

  return (
    <div className="space-y-6">
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Admin Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time overview of your store performance, orders, and sales activity.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition hover:bg-surface-hover"
          >
            <Eye className="h-4 w-4" />
            View Orders
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition hover:bg-surface-hover"
          >
            <Users className="h-4 w-4" />
            Manage Users
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {adminDashboardStats.map((stat, index) => {
          const IconComp = statIcons[index]?.icon || Package;
          const colorStyles = statIcons[index]?.color || 'text-primary bg-primary/10';
          const isPositive = (stat.change ?? 0) >= 0;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">{stat.label}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorStyles}`}>
                  <IconComp className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                {stat.change !== undefined && (
                  <div
                    className={`flex items-center text-xs font-semibold ${
                      isPositive ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="mr-1 h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="mr-1 h-3.5 w-3.5" />
                    )}
                    <span>
                      {isPositive ? '+' : ''}
                      {stat.change}%
                    </span>
                  </div>
                )}
              </div>
              {stat.changeLabel && (
                <p className="mt-1 text-xs text-text-muted">{stat.changeLabel}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Analytics Chart & Top Selling Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Revenue Bar Chart */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-text-primary">Revenue Overview</h2>
              <p className="text-xs text-text-secondary mt-0.5">Monthly revenue trends for the last 6 months</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              +18.4% growth
            </span>
          </div>

          <div className="mt-6 flex h-64 items-end justify-between gap-4 px-2">
            {monthlyData.map((item) => (
              <div key={item.month} className="group relative flex flex-1 flex-col items-center h-full justify-end">
                {/* Tooltip */}
                <div className="absolute -top-10 hidden rounded-md bg-text-primary px-2.5 py-1 text-xs font-semibold text-white group-hover:block transition whitespace-nowrap shadow-md">
                  {formatPrice(item.revenue)}
                </div>
                {/* Bar */}
                <div className="w-full max-w-[48px] rounded-t-md bg-primary/20 transition-all duration-300 group-hover:bg-primary"
                  style={{ height: `${item.percentage}%` }}
                >
                  <div
                    className="w-full h-full rounded-t-md bg-gradient-to-t from-primary to-primary-light opacity-90 transition group-hover:opacity-100"
                  />
                </div>
                <span className="mt-3 text-xs font-medium text-text-secondary">{item.month}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary" />
              <span>Gross Sales Revenue</span>
            </div>
            <span>Target: ₹30,00,000 / month</span>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h2 className="text-base font-semibold text-text-primary">Top Products</h2>
            <Link
              to="/admin/products"
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              All Products <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-border">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="h-12 w-12 rounded-lg object-cover border border-border flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{product.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {product.salesCount} sold • {formatPrice(product.mrpPrice * (1 - product.discount / 100))}
                  </p>
                </div>
                <span className="inline-flex items-center rounded bg-surface-alt px-2 py-1 text-xs font-semibold text-text-secondary border border-border">
                  #{product.id}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-text-primary">Recent Orders</h2>
            <p className="text-xs text-text-secondary mt-0.5">Overview of latest customer transactions</p>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View all orders <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-alt text-xs font-semibold uppercase text-text-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3.5">Order ID</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`transition hover:bg-surface-hover ${
                    idx % 2 === 1 ? 'bg-surface-alt/40' : 'bg-surface'
                  }`}
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-text-primary">
                    <span className="font-mono text-primary font-semibold">#{order.id}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-text-primary">{order.user.name}</div>
                    <div className="text-xs text-text-muted">{order.user.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-text-secondary">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getOrderStatusColor(
                        order.orderStatus as OrderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-text-primary">
                    {formatPrice(order.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
