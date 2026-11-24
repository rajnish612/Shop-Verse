import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ShoppingBag,
  ArrowRight,
  Loader2,
  Tag,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";

import { formatPrice, getDiscountedPrice } from "../../utils/helperFunctions";

import type { CartItem, Coupon } from "../../types";
import { cartApis } from "../../services/cart";
import { couponApi } from "../../services/coupons";
import { toast } from "sonner";

const CartPage: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [updatingCartItemId, setUpdatingCartItemId] = useState<number | null>(
    null,
  );

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Load cart items
  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await cartApis.getAll();
      setItems(data);
    } catch (err) {
      setLoadFailed(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  // Apply coupon
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");

    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    try {
      setIsApplyingCoupon(true);

      const coupon = await couponApi.apply(code);
      // Calculate the coupon discount
      const discountAmount = coupon.percentage
        ? Math.round((discountedItemsTotal * coupon.discount) / 100)
        : coupon.discount;

      // Validate discount
      if (coupon.discount <= 0) {
        setCouponError("Invalid coupon discount.");
        return;
      }


      // Do not allow a completely free order
      if (discountAmount >= discountedItemsTotal) {
        setCouponError("This coupon cannot make your order completely free.");
        return;
      }
      toast.success("Coupon applied successfully!");
      setAppliedCoupon(coupon);
      setCouponCode("");
    } catch (err) {
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  // Calculate cart totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Total before product discounts
  const rawSubtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Total after product discounts
  const discountedItemsTotal = items.reduce(
    (sum, item) =>
      sum + getDiscountedPrice(item.price, item.discount ?? 0) * item.quantity,
    0,
  );

  // Savings from individual product discounts
  const productSavings = rawSubtotal - discountedItemsTotal;

  // Coupon discount
  const couponDiscount = appliedCoupon
    ? Math.min(
        Math.max(
          0,
          appliedCoupon.percentage
            ? Math.round((discountedItemsTotal * appliedCoupon.discount) / 100)
            : appliedCoupon.discount,
        ),
        discountedItemsTotal,
      )
    : 0;

  // Final payable amount
  const grandTotal = Math.max(0, discountedItemsTotal - couponDiscount);
  //Increase quantity of item
  const handleIncreaseQuantity = async (cartItemId: number) => {
    try {
      setUpdatingCartItemId(cartItemId);

      const updatedItem = await cartApis.increaseQuantity(cartItemId);

      setItems((current) =>
        current.map((item) =>
          item.cartItemId === cartItemId ? updatedItem : item,
        ),
      );
    } catch (err) {
      console.error("Failed to increase quantity:", err);
    } finally {
      setUpdatingCartItemId(null);
    }
  };
  // Decrease quantity of item
  const handleDecreaseQuantity = async (cartItemId: number) => {
    try {
      setUpdatingCartItemId(cartItemId);

      const updatedItem = await cartApis.decreaseQuantity(cartItemId);

      setItems((current) =>
        current.map((item) =>
          item.cartItemId === cartItemId ? updatedItem : item,
        ),
      );
    } catch (err) {
      console.error("Failed to decrease quantity:", err);
    } finally {
      setUpdatingCartItemId(null);
    }
  };
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (loadFailed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-alt">
        <button
          onClick={() => void loadCart()}
          className="px-5 py-2 rounded-xl bg-primary text-white font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-alt flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface rounded-3xl border border-border p-10 text-center">
          <ShoppingBag className="w-14 h-14 mx-auto mb-5 text-primary" />

          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Your Cart is Empty
          </h2>

          <p className="text-sm text-text-secondary mb-7">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-semibold"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-8">
          Shopping Cart ({totalItems})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const discountedPrice = getDiscountedPrice(
                item.price,
                item.discount ?? 0,
              );

              const itemSubtotal = discountedPrice * item.quantity;

              return (
                <div
                  key={item.cartItemId}
                  className="bg-surface rounded-2xl border border-border p-4 sm:p-6 flex flex-col sm:flex-row gap-5"
                >
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.productId}`}
                    className="w-24 h-24 rounded-xl overflow-hidden bg-surface-alt border border-border shrink-0"
                  >
                    <img
                      src={item.imageUrls?.[0] ?? ""}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-semibold text-text-primary hover:text-primary"
                    >
                      {item.productName}
                    </Link>

                    {/* Product Price and Discount */}
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      <span className="text-sm font-bold text-text-primary">
                        {formatPrice(discountedPrice)}
                      </span>

                      {(item.discount ?? 0) > 0 && (
                        <>
                          <span className="text-xs text-text-muted line-through">
                            {formatPrice(item.price)}
                          </span>

                          <span className="text-xs font-semibold text-green-600">
                            {item.discount}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {/* Selected Attributes */}
                    {item.selectedAttributes?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.selectedAttributes.map((attribute) => (
                          <span
                            key={attribute.id}
                            className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary"
                          >
                            {attribute.name}:{" "}
                            {Object.values(attribute.values)[0]}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Quantity */}
                    <div className="mt-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-text-secondary">
                          Quantity:
                        </span>

                        <div className="inline-flex items-center overflow-hidden rounded-lg border border-border">
                          {/* Decrease */}
                          <button
                            type="button"
                            disabled={
                              item.quantity <= 1 ||
                              updatingCartItemId === item.cartItemId
                            }
                            onClick={() =>
                              handleDecreaseQuantity(item.cartItemId)
                            }
                            aria-label="Decrease quantity"
                            className="flex h-9 w-9 items-center justify-center text-text-secondary transition hover:bg-surface-hover hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {updatingCartItemId === item.cartItemId ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Minus size={15} />
                            )}
                          </button>

                          {/* Current Quantity */}
                          <span className="min-w-10 border-x border-border px-3 py-1.5 text-center text-sm font-semibold text-text-primary">
                            {item.quantity}
                          </span>

                          {/* Increase */}
                          <button
                            type="button"
                            disabled={updatingCartItemId === item.cartItemId}
                            onClick={() =>
                              handleIncreaseQuantity(item.cartItemId)
                            }
                            aria-label="Increase quantity"
                            className="flex h-9 w-9 items-center justify-center text-text-secondary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item Subtotal */}
                  <div className="sm:text-right flex sm:flex-col justify-between sm:justify-center">
                    <span className="text-xs text-text-muted">Subtotal</span>

                    <span className="font-bold text-text-primary">
                      {formatPrice(itemSubtotal)}
                    </span>
                  </div>
                </div>
              );
            })}

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline pt-3"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 space-y-5">
            {/* Coupon Section */}
            <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-4 font-semibold text-text-primary text-sm">
                <Tag className="w-4 h-4 text-primary" />
                <span>Apply Promo Coupon</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-accent/10 border border-accent/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />

                    <div>
                      <span className="font-bold text-xs text-text-primary block">
                        {appliedCoupon.code}
                      </span>

                      <span className="text-[11px] text-accent">
                        {appliedCoupon.percentage
                          ? `${appliedCoupon.discount}% Off applied`
                          : `${formatPrice(appliedCoupon.discount)} Flat Off applied`}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-danger font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError("");
                      }}
                      className="min-w-0 flex-1 px-3 py-2 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                    />

                    <button
                      type="submit"
                      disabled={isApplyingCoupon}
                      className="px-4 py-2 bg-text-primary hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  </div>

                  {couponError && (
                    <div className="flex items-center gap-1.5 text-xs text-danger">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{couponError}</span>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
              <h2 className="text-lg font-bold text-text-primary pb-4 border-b border-border">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    Items ({items.length})
                  </span>

                  <span className="font-semibold text-text-primary">
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-text-secondary">Bag MRP Total</span>

                  <span className="font-semibold text-text-primary">
                    {formatPrice(rawSubtotal)}
                  </span>
                </div>

                {productSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Product Discounts</span>

                    <span className="font-semibold">
                      - {formatPrice(productSavings)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>

                  <span className="font-semibold text-text-primary">
                    {formatPrice(discountedItemsTotal)}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({appliedCoupon.code})</span>

                    <span className="font-semibold">
                      - {formatPrice(couponDiscount)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <div>
                  <span className="font-bold text-text-primary block">
                    Total Amount
                  </span>

                  <span className="text-xs text-text-muted">
                    Inclusive of all taxes
                  </span>
                </div>

                <span className="text-2xl font-black text-primary">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              <Link
                to="/checkout"
                state={{
                  coupon: appliedCoupon,
                  subtotal: discountedItemsTotal,
                  couponDiscount,
                  grandTotal,
                }}
                className="w-full py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-text-muted">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>Safe & Secure Payments</span>
              </div>

              <p className="text-xs text-center text-text-muted">
                Shipping and taxes will be calculated at checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
