import React, { useEffect, useState } from "react";
import {
  Ticket,
  Tag,
  CalendarDays,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";
import type { Coupon } from "../../types";
import { couponApi } from "../../services/coupons";
import { formatPrice } from "../../utils/helperFunctions";

const UsedCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsedCoupons = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await couponApi.getUsedCoupons();
      setCoupons(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch used coupons.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsedCoupons();
  }, []);

  const getCouponStatus = (coupon: Coupon) => {
    if (!coupon.active) return "Inactive";

    if (
      coupon.expiresAt &&
      new Date(coupon.expiresAt).getTime() <= Date.now()
    ) {
      return "Expired";
    }

    return "Redeemed";
  };

  const formatExpiryDate = (date: string | null) => {
    if (!date) return "No expiry date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-indigo-600">
              <Ticket className="h-5 w-5" />
              <span className="text-sm font-semibold">My Rewards</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Used Coupons
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View all the coupons you've redeemed on your orders.
            </p>
          </div>

          <button
            onClick={fetchUsedCoupons}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>

            <button
              onClick={fetchUsedCoupons}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Coupon count */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total coupons redeemed</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {coupons.length}
          </h2>
        </div>

        {/* Empty state */}
        {!error && coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
              <Ticket className="h-8 w-8 text-indigo-500" />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              No used coupons yet
            </h2>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Coupons you redeem during checkout will appear here.
            </p>
          </div>
        ) : (
          /* Coupon list */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon) => {
              const status = getCouponStatus(coupon);

              return (
                <div
                  key={coupon.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Coupon top */}
                  <div className="border-b border-dashed border-slate-200 bg-indigo-50/60 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-indigo-600">
                          <Tag className="h-4 w-4" />
                          Coupon redeemed
                        </div>

                        <h3 className="text-xl font-bold tracking-wide text-slate-900">
                          {coupon.code}
                        </h3>
                      </div>

                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                        Used
                      </span>
                    </div>

                    <div className="mt-5">
                      <p className="text-3xl font-extrabold text-indigo-600">
                        {coupon.percentage
                          ? `${coupon.discount}% OFF`
                          : `${formatPrice(coupon.discount)} OFF`}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {coupon.percentage
                          ? "Percentage discount"
                          : "Flat discount"}
                      </p>
                    </div>
                  </div>

                  {/* Coupon details */}
                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays className="h-4 w-4" />
                        Expiry date
                      </span>

                      <span className="text-sm font-medium text-slate-700">
                        {formatExpiryDate(coupon.expiresAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm text-slate-500">Status</span>

                      <span
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          status === "Redeemed"
                            ? "bg-green-50 text-green-700"
                            : status === "Expired"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {status === "Redeemed" ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <Clock className="h-3.5 w-3.5" />
                        )}
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsedCouponsPage;
