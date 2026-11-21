import React, { useEffect, useState } from "react";
import {
  Ticket,
  Plus,
  Trash2,
  Calendar,
  Percent,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  X,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Loader2,
} from "lucide-react";
import { formatDate } from "../../data/mockData";
import type { Coupon } from "../../types";
import { couponApi } from "../../services/coupons";

export const CouponsPage: React.FC = () => {
  const [couponList, setCouponList] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [updatingCouponId, setUpdatingCouponId] = useState<number | null>(null);

  const [searchCode, setSearchCode] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  // Form State
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState<number>(10);
  const [isPercentage, setIsPercentage] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");

  const handleDeleteCoupon = (id: number) => {
    setCouponList((prev) => prev.filter((c) => c.id !== id));
  };

  //Create new coupon
  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCoupon: Coupon = {
      id: Math.max(...couponList.map((c) => c.id), 0) + 1,
      code: code.trim().toUpperCase(),
      discount: Number(discount),
      percentage: isPercentage,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      active: true,
    };

    try {
      setIsCreating(true);

      const data = await couponApi.create(newCoupon);
      setCouponList((prev) => [data, ...prev]);

      setIsModalOpen(false);
      setCode("");
      setDiscount(10);
      setIsPercentage(true);
      setExpiresAt("");
    } catch (err) {
      console.error("Error creating coupon:", err);
    } finally {
      setIsCreating(false);
    }
  };

  //Update status of coupon
  const updateCouponStatus = async (couponId: number, active: boolean) => {
    if (updatingCouponId !== null) return;

    try {
      setUpdatingCouponId(couponId);

      const data = await couponApi.updateStatus(couponId, active);

      setCouponList((prev) =>
        prev.map((c) =>
          c.id === couponId ? { ...c, active: data.active } : c,
        ),
      );
    } catch (err) {
      console.error("Error updating coupon status:", err);
    } finally {
      setUpdatingCouponId(null);
    }
  };
  //Fetch all coupons
  const fetchCoupons = async () => {
    setIsLoading(true);

    try {
      const data = await couponApi.getAll({
        code: searchCode.trim() || undefined,
        active:
          selectedStatus === "all" ? undefined : selectedStatus === "active",
        fromDate: fromDate ? `${fromDate}T00:00:00` : undefined,
        toDate: toDate ? `${toDate}T23:59:59` : undefined,
      });

      setCouponList(data);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchCoupons();
  }, [searchCode, selectedStatus, fromDate, toDate]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Coupons & Discounts
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Create promotional coupon codes, set flat or percentage discounts,
            and manage expiry limits.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          Add Coupon
        </button>
      </div>
      {/* Coupon Filters */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-secondary" />
          <h2 className="text-sm font-semibold text-text-primary">
            Filter Coupons
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search by code */}
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">
              Coupon Code
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Search coupon code..."
                className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">
              Status
            </label>

            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value as "all" | "active" | "inactive",
                )
              }
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* From date */}
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">
              Expiring From
            </label>

            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* To date */}
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">
              Expiring Until
            </label>

            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setSearchCode("");
              setSelectedStatus("all");
              setFromDate("");
              setToDate("");
            }}
            className="text-sm font-medium text-text-secondary transition hover:text-primary"
          >
            Clear filters
          </button>
        </div>
      </div>
      {/* Coupons Table */}
      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-alt text-xs font-semibold uppercase text-text-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3.5">Coupon Code</th>
                <th className="px-6 py-3.5">Discount</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Expiry Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-7 w-7 animate-spin text-primary" />
                      <p className="text-sm text-text-secondary">
                        Loading coupons...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : couponList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Ticket className="mx-auto mb-3 h-8 w-8 text-text-muted" />
                    <p className="text-sm font-medium text-text-primary">
                      No coupons found
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      Try changing your filters or create a new coupon.
                    </p>
                  </td>
                </tr>
              ) : (
                couponList.map((coupon, idx) => {
                  const isExpired =
                    (coupon.expiresAt &&
                      new Date(coupon.expiresAt).getTime() < Date.now()) ||
                    !coupon.active;

                  return (
                    <tr
                      key={coupon.id}
                      className={`transition hover:bg-surface-hover ${
                        idx % 2 === 1 ? "bg-surface-alt/40" : "bg-surface"
                      }`}
                    >
                      {/* Code */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Ticket className="h-4 w-4" />
                          </div>
                          <span className="font-mono font-bold tracking-wider text-text-primary">
                            {coupon.code}
                          </span>
                        </div>
                      </td>

                      {/* Discount Value */}
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-text-primary">
                        {coupon.percentage
                          ? `${coupon.discount}% OFF`
                          : `₹${coupon.discount} FLAT OFF`}
                      </td>

                      {/* Type Badge */}
                      <td className="whitespace-nowrap px-6 py-4 text-text-secondary">
                        <span className="inline-flex items-center gap-1 rounded-md bg-surface-alt px-2 py-0.5 text-xs font-medium border border-border">
                          {coupon.percentage ? (
                            <>
                              <Percent className="h-3 w-3 text-primary" />{" "}
                              Percentage
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-3 w-3 text-emerald-600" />{" "}
                              Flat Amount
                            </>
                          )}
                        </span>
                      </td>

                      {/* Expiry */}
                      <td className="whitespace-nowrap px-6 py-4 text-text-secondary">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="h-3.5 w-3.5 text-text-muted" />
                          {coupon.expiresAt
                            ? formatDate(coupon.expiresAt)
                            : "Never Expires"}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                            <Clock className="h-3 w-3" /> Expired
                          </span>
                        ) : coupon.active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                            <CheckCircle className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateCouponStatus(coupon.id, !coupon.active)
                            }
                            disabled={updatingCouponId !== null}
                            className="text-text-secondary hover:text-primary transition disabled:cursor-not-allowed disabled:opacity-50"
                            title={
                              coupon.active ? "Disable Coupon" : "Enable Coupon"
                            }
                          >
                            {updatingCouponId === coupon.id ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : coupon.active ? (
                              <ToggleRight className="h-6 w-6 text-primary" />
                            ) : (
                              <ToggleLeft className="h-6 w-6 text-text-muted" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="rounded p-1 text-text-secondary hover:text-danger transition"
                            title="Delete Coupon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-bold text-text-primary">
                Create New Coupon
              </h3>
              <button
                disabled={isCreating}
                onClick={() => setIsModalOpen(false)}
                className="rounded p-1 text-text-muted hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE50"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary font-mono uppercase focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Discount Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPercentage(true)}
                    className={`rounded-lg border p-2.5 text-xs font-semibold text-center transition ${
                      isPercentage
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPercentage(false)}
                    className={`rounded-lg border p-2.5 text-xs font-semibold text-center transition ${
                      !isPercentage
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                    }`}
                  >
                    Flat Discount (₹)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Discount Value {isPercentage ? "(%)" : "(₹)"}
                </label>
                <input
                  type="number"
                  min="1"
                  max={isPercentage ? 100 : 100000}
                  required
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  disabled={isCreating}
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex min-w-[145px] items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Coupon"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
