import React from "react";
import { Link } from "react-router";
import { MapPin, Loader2, AlertCircle, ShieldCheck } from "lucide-react";

import { formatPrice } from "../../utils/helperFunctions";
import type { Address, Coupon } from "../../types";
import AddressCard from "../../components/ui/AddressCard";

interface CheckoutAddressStepProps {
  addresses: Address[];
  selectedAddressId: number | null;
  onSelectAddress: (id: number) => void;

  loading: boolean;
  error: string;
  onRetry: () => void;

  coupon: Coupon | null;
  subtotal: number;
  couponDiscount: number;
  grandTotal: number;

  onContinue: () => void;
}

const CheckoutAddressStep: React.FC<CheckoutAddressStepProps> = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  loading,
  error,
  onRetry,
  coupon,
  subtotal,
  couponDiscount,
  grandTotal,
  onContinue,
}) => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p className="text-gray-500 mb-8">
        Select your delivery address and confirm your order total.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Address Selection */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Delivery Address
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Select an address for delivery.
              </p>
            </div>

            <Link
              to="/addresses"
              className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
            >
              <MapPin size={17} />
              Manage Addresses
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={32} className="animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <AlertCircle size={36} className="text-red-500 mx-auto mb-3" />

              <p className="text-red-500">{error}</p>

              <button
                type="button"
                onClick={onRetry}
                className="mt-4 px-5 py-2 bg-primary text-white rounded-lg font-semibold"
              >
                Try Again
              </button>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
              <MapPin size={40} className="text-gray-400 mx-auto mb-3" />

              <h3 className="font-semibold text-gray-900">
                No addresses found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Add an address to continue with checkout.
              </p>

              <Link
                to="/addresses"
                className="inline-block mt-5 px-5 py-3 bg-primary text-white rounded-xl font-semibold"
              >
                Add Address
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  isSelected={selectedAddressId === address.id}
                  onSelect={onSelectAddress}
                />
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Coupon Discount
                    {coupon?.code && ` (${coupon.code})`}
                  </span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4">
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-green-50">
              <ShieldCheck size={22} className="text-green-600 shrink-0" />

              <div>
                <p className="text-sm font-semibold text-green-800">
                  Safe and Secure Checkout
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Your order information is protected.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={
                !selectedAddressId ||
                loading ||
                !!error ||
                addresses.length === 0
              }
              onClick={onContinue}
              className="w-full mt-6 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutAddressStep;
