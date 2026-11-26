import React from "react";
import { Link } from "react-router";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowRight,
  Eye,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "../../data/mockData";
import { type DashBoardData } from "../../types";
import { dashBoardApis, type RevenueChartData } from "../../services/dashboard";
import { toast } from "sonner";

export const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = React.useState<DashBoardData>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = formatLocalDate(new Date());

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  const [startDate, setStartDate] = React.useState(
    formatLocalDate(thirtyDaysAgo),
  );
  const [endDate, setEndDate] = React.useState(today);

  const [revenueData, setRevenueData] = React.useState<RevenueChartData[]>([]);
  const [isRevenueLoading, setIsRevenueLoading] = React.useState(false);
  const [revenueError, setRevenueError] = React.useState(false);

  const fetchRevenue = React.useCallback(async (from: string, to: string) => {
    if (!from || !to || from > to) return;

    setIsRevenueLoading(true);
    setRevenueError(false);

    try {
      const data = await dashBoardApis.getRevenue(from, to);
      setRevenueData(data);
    } catch (error) {
      console.error("Unable to fetch revenue data:", error);
      setRevenueError(true);
      toast.error("Unable to fetch revenue data");
    } finally {
      setIsRevenueLoading(false);
    }
  }, []);

  // Fetch revenue initially only.
  React.useEffect(() => {
    fetchRevenue(startDate, endDate);
  }, []);

  // Fetch dashboard statistics.
  React.useEffect(() => {
    dashBoardApis
      .getDashBoardData()
      .then((data) => {
        setDashboardData(data);
      })
      .catch((err) => {
        console.error("Unable to fetch dashboard data:", err);
        setHasError(true);
        toast.error("Unable to fetch Dashboard data");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handlePreset = (days: number) => {
    const end = new Date();
    const start = new Date();

    start.setDate(start.getDate() - (days - 1));

    setStartDate(formatLocalDate(start));
    setEndDate(formatLocalDate(end));
  };

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(Number(dashboardData?.totalRevenue ?? 0)),
      description: "Revenue from confirmed orders",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Total Orders",
      value: (dashboardData?.totalOrders ?? 0).toLocaleString("en-IN"),
      description: "Orders placed in your store",
      icon: ShoppingCart,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30",
      link: "/admin/orders",
    },
    {
      label: "Total Users",
      value: (dashboardData?.totalUsers ?? 0).toLocaleString("en-IN"),
      description: "Registered users",
      icon: Users,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30",
      link: "/admin/users",
    },
    {
      label: "Total Products",
      value: (dashboardData?.totalProducts ?? 0).toLocaleString("en-IN"),
      description: "Products in your catalog",
      icon: Package,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30",
      link: "/admin/products",
    },
  ];

  const totalRevenue = revenueData.reduce(
    (total, item) => total + Number(item.revenue),
    0,
  );

  const maxRevenue = Math.max(
    ...revenueData.map((item) => Number(item.revenue)),
    1,
  );

  return (
    <div className="space-y-6">
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Real-time overview of your store performance, orders, and sales
            activity.
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

      {/* Dashboard Error State */}
      {hasError && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 py-12 text-center">
          <AlertCircle className="mb-3 h-10 w-10 text-danger" />

          <h2 className="font-semibold text-text-primary">
            Unable to load dashboard
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Something went wrong while fetching your store statistics.
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      {!hasError && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            const content = (
              <div className="flex h-full flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-secondary">
                    {stat.label}
                  </span>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5">
                  {isLoading ? (
                    <div className="h-8 w-32 animate-pulse rounded-md bg-surface-hover" />
                  ) : (
                    <p className="text-2xl font-bold text-text-primary">
                      {stat.value}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-text-muted">
                    {stat.description}
                  </p>
                </div>

                {stat.link && (
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary">
                    View details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            );

            return stat.link ? (
              <Link key={stat.label} to={stat.link} className="block">
                {content}
              </Link>
            ) : (
              <div key={stat.label}>{content}</div>
            );
          })}
        </div>
      )}

      {/* Revenue Chart */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border pb-4">
          {/* Preset Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "7 Days", days: 7 },
              { label: "30 Days", days: 30 },
              { label: "3 Months", days: 90 },
              { label: "1 Year", days: 365 },
            ].map((preset) => (
              <button
                key={preset.days}
                type="button"
                onClick={() => handlePreset(preset.days)}
                className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-primary hover:text-primary"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Date Filters */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="revenue-start-date"
                className="text-xs font-medium text-text-secondary"
              >
                Start Date
              </label>

              <input
                id="revenue-start-date"
                type="date"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="revenue-end-date"
                className="text-xs font-medium text-text-secondary"
              >
                End Date
              </label>

              <input
                id="revenue-end-date"
                type="date"
                value={endDate}
                min={startDate}
                max={today}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>

            <button
              type="button"
              disabled={
                isRevenueLoading ||
                !startDate ||
                !endDate ||
                startDate > endDate
              }
              onClick={() => fetchRevenue(startDate, endDate)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRevenueLoading ? "Loading..." : "Apply Filter"}
            </button>
          </div>
        </div>

        {/* Revenue Total */}
        <div className="mt-5">
          <p className="text-xs text-text-secondary">
            Revenue for selected period
          </p>

          <p className="mt-1 text-2xl font-bold text-text-primary">
            {formatPrice(totalRevenue)}
          </p>
        </div>

        {/* Chart */}
        <div className="mt-6">
          {isRevenueLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : revenueError ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <AlertCircle className="h-8 w-8 text-danger" />

              <p className="text-sm text-text-secondary">
                Unable to load revenue data.
              </p>

              <button
                onClick={() => fetchRevenue(startDate, endDate)}
                className="text-sm font-medium text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : revenueData.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-text-secondary">
                No revenue data available.
              </p>
            </div>
          ) : (
            <div className="flex h-64 items-end justify-between gap-2 overflow-x-auto px-1 pb-2">
              {revenueData.map((item) => {
                const value = Number(item.revenue);
                const height = (value / maxRevenue) * 100;

                const date = new Date(`${item.period}T00:00:00`);

                const label =
                  revenueData.length <= 31
                    ? date.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })
                    : date.toLocaleDateString("en-IN", {
                        month: "short",
                        year: "2-digit",
                      });

                return (
                  <div
                    key={item.period}
                    className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                  >
                    <div className="absolute -top-9 z-10 hidden whitespace-nowrap rounded-md bg-text-primary px-2 py-1 text-xs font-semibold text-white shadow-md group-hover:block">
                      {formatPrice(value)}
                    </div>

                    <div
                      className="w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-primary to-primary-light transition-all duration-300 group-hover:opacity-80"
                      style={{
                        height: `${Math.max(height, 1)}%`,
                        minHeight: value > 0 ? "4px" : "2px",
                      }}
                    />

                    <span className="mt-3 whitespace-nowrap text-[10px] font-medium text-text-secondary">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chart Footer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-primary" />
            <span>Confirmed Order Revenue</span>
          </div>

          <span>
            {startDate} to {endDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
