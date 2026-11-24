import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import type { Address, Coupon, Order } from "../../types";
import { PaymentMethod } from "../../types";

import { addressesApi } from "../../services/address";
import { orderApis } from "../../services/order";

import CheckoutAddressStep from "../../components/checkout/CheckoutAddressStep";
import CheckoutPaymentStep from "../../components/checkout/CheckoutPaymentStep";
import { toast } from "sonner";

interface CheckoutState {
  coupon: Coupon | null;
  subtotal: number;
  couponDiscount: number;
  grandTotal: number;
}

const TEST_USER_ID = 1;

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const checkoutState = location.state as CheckoutState | null;

  const [currentStep, setCurrentStep] = useState(1);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(PaymentMethod.UPI);

  const [upiId, setUpiId] = useState("");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Order creation states
  const [placingOrder, setPlacingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);

        const data = await addressesApi.getByUser(TEST_USER_ID);

        setAddresses(data);
        setSelectedAddressId(data[0]?.id ?? null);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [retryCount]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      return;
    }

    if (placingOrder) return;

    try {
      setPlacingOrder(true);

      const order = await orderApis.createOrder({
        userId: TEST_USER_ID,
        addressId: selectedAddressId,
        paymentMethod: selectedPaymentMethod,
        couponCode: checkoutState?.coupon?.code ?? null,
      });

      setCreatedOrder(order);
      setCurrentStep(3);
      toast.success("Order placed successfully");
    } catch (err) {
      console.error("Failed to create order:", err);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!checkoutState) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <AlertCircle size={40} className="text-red-500 mb-3" />

        <h2 className="text-xl font-bold text-gray-900">
          Checkout information not found
        </h2>

        <p className="text-gray-500 mt-2">
          Please return to your cart and try again.
        </p>

        <Link
          to="/cart"
          className="mt-5 px-6 py-3 bg-primary text-white rounded-xl font-semibold"
        >
          Return to Cart
        </Link>
      </div>
    );
  }

  const { coupon, subtotal, couponDiscount, grandTotal } = checkoutState;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Step 1: Address */}
        {currentStep === 1 && (
          <CheckoutAddressStep
            onAddressSelect={(id: number) => setSelectedAddressId(id)}
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
            loading={loading}
            onRetry={() => setRetryCount((count) => count + 1)}
            coupon={coupon}
            subtotal={subtotal}
            couponDiscount={couponDiscount}
            grandTotal={grandTotal}
            onContinue={() => setCurrentStep(2)}
          />
        )}

        {/* Step 2: Payment */}
        {currentStep === 2 && (
          <CheckoutPaymentStep
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentMethodChange={setSelectedPaymentMethod}
            upiId={upiId}
            onUpiIdChange={setUpiId}
            onBack={() => setCurrentStep(1)}
            onPlaceOrder={handlePlaceOrder}
            placingOrder={placingOrder}
          />
        )}

        {/* Step 3: Order Confirmation */}
        {currentStep === 3 && createdOrder && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />

            <h2 className="text-2xl font-bold text-gray-900">
              Order placed successfully!
            </h2>

            <p className="text-gray-500 mt-2">Thank you for your purchase.</p>

            <div className="bg-gray-50 rounded-xl p-5 mt-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="font-semibold">{createdOrder.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Order Status</span>
                <span className="font-semibold">
                  {createdOrder.orderStatus}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-semibold">
                  {createdOrder.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status</span>
                <span className="font-semibold">
                  {createdOrder.paymentStatus}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">
                  ₹{createdOrder.totalPrice}
                </span>
              </div>
            </div>

            <Link
              to="/"
              className="inline-flex mt-7 px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
