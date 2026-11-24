import React from "react";
import { Link } from "react-router";
import { MapPin, Loader2, AlertCircle, ShieldCheck } from "lucide-react";

import { formatPrice } from "../../utils/helperFunctions";
import type { Address, Coupon } from "../../types";
import AddressCard from "../ui/AddressCard";

interface CheckoutAddressStepProps {
  addresses: Address[];
  selectedAddressId: number | null;
  onSelectAddress: (id: number) => void;

  loading: boolean;
  onRetry: () => void;

  coupon: Coupon | null;
  subtotal: number;
  couponDiscount: number;
  grandTotal: number;

  onContinue: () => void;
  onAddressSelect: (id: number) => void;
}

const CheckoutAddressStep: React.FC<CheckoutAddressStepProps> = ({
  addresses,
  selectedAddressId,
  loading,
  coupon,
  subtotal,
  couponDiscount,
  grandTotal,
  onContinue,
  onAddressSelect,
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
          {addresses.map((address, idx) => (
            <AddressCard
              key={address.id}
              onSelect={() => onAddressSelect(address.id)}
              isSelected={address.id == selectedAddressId}
              address={address}
            />
          ))}
          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 size={32} className="animate-spin text-primary" />
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
              disabled={!selectedAddressId || loading || addresses.length === 0}
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
