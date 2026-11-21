import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  QrCode,
  Banknote,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { PaymentMethod } from "../../types";

interface CheckoutPaymentStepProps {
  selectedPaymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  upiId: string;
  onUpiIdChange: (value: string) => void;
  onBack: () => void;
  onPlaceOrder: () => void;
  placingOrder: boolean;
}

const CheckoutPaymentStep: React.FC<CheckoutPaymentStepProps> = ({
  selectedPaymentMethod,
  onPaymentMethodChange,
  upiId,
  onUpiIdChange,
  onBack,
  onPlaceOrder,
  placingOrder,
}) => {
  const isUpiSelected = selectedPaymentMethod === PaymentMethod.UPI;
  const isCodSelected = selectedPaymentMethod === PaymentMethod.COD;

  const handlePlaceOrder = () => {
    if (isUpiSelected && !upiId.trim()) {
      return;
    }

    onPlaceOrder();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Payment Options</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select your preferred payment method.
        </p>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        {/* UPI */}
        <label
          className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
            isUpiSelected
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={PaymentMethod.UPI}
            checked={isUpiSelected}
            onChange={() => onPaymentMethodChange(PaymentMethod.UPI)}
            disabled={placingOrder}
            className="mt-1 accent-primary cursor-pointer"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <QrCode className="w-5 h-5 text-primary" />

              <span className="font-bold text-sm text-gray-900">
                Instant UPI
              </span>

              <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold">
                FASTEST
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Pay via Google Pay, PhonePe, Paytm, or BHIM.
            </p>

            {isUpiSelected && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 space-y-2">
                <label
                  htmlFor="upiId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter UPI ID / VPA
                </label>

                <input
                  id="upiId"
                  type="text"
                  value={upiId}
                  onChange={(e) => onUpiIdChange(e.target.value)}
                  placeholder="e.g. mobile@upi"
                  disabled={placingOrder}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                />
              </div>
            )}
          </div>
        </label>

        {/* Cash on Delivery */}
        <label
          className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
            isCodSelected
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={PaymentMethod.COD}
            checked={isCodSelected}
            onChange={() => onPaymentMethodChange(PaymentMethod.COD)}
            disabled={placingOrder}
            className="mt-1 accent-primary cursor-pointer"
          />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Banknote className="w-5 h-5 text-amber-500" />

              <span className="font-bold text-sm text-gray-900">
                Cash on Delivery (COD)
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Pay with cash or UPI QR at your doorstep when you receive your
              package.
            </p>
          </div>
        </label>
      </div>

      {/* Navigation */}
      <div className="pt-4 flex items-center justify-between border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          disabled={placingOrder}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={17} />
          Back to Address
        </button>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={placingOrder || (isUpiSelected && !upiId.trim())}
          className="inline-flex min-w-[155px] items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {placingOrder ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Placing Order...
            </>
          ) : (
            <>
              Place Order
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPaymentStep;
