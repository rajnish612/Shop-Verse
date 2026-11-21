import React from "react";
import { Link, useParams } from "react-router";
import {
  ArrowRight,
  ChevronRight,
  Loader2,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { productApis } from "../../services/products";
import { type Product } from "../../types";
import { formatPrice } from "../../utils/helperFunctions";

import CustomerReviews from "../../components/CustomerReviews";
import { cartApis } from "../../services/cart";
import { toast } from "sonner";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = React.useState<Product | null>(null);
  const [productLoading, setProductLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = React.useState<
    Record<number, number>
  >({});
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  //handle attribute selection
  const handleAttributeSelect = (attributeId: number, valueId: number) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: valueId,
    }));
  };
  // Fetch product
  React.useEffect(() => {
    const fetchProduct = async () => {
      const productId = Number(id);

      if (!id || !Number.isInteger(productId) || productId <= 0) {
        setProductLoading(false);
        return;
      }

      setProductLoading(true);
      setProduct(null);

      productApis
        .getProduct(productId)
        .then((data) => {
          setProduct(data);
          setSelectedImageIndex(0);

          const initialSelections: Record<number, number> = {};

          data.attributes?.forEach((attribute) => {
            const firstValueId = Object.keys(attribute.values)[0];

            if (firstValueId !== undefined) {
              initialSelections[attribute.id] = Number(firstValueId);
            }
          });

          setSelectedAttributes(initialSelections);
        })
        .catch((err) => {
          console.error("Error loading product:", err);
        })
        .finally(() => {
          setProductLoading(false);
        });
    };

    fetchProduct();
  }, [id]);

  //Add product to cart
  const handleAddToCart = async () => {
    if (!product) return;

    // Check stock
    if (product.stockQuantity <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    // Validate that every product attribute has a selection
    const requiredAttributeIds =
      product.attributes?.map((attribute) => attribute.id) ?? [];

    const allAttributesSelected = requiredAttributeIds.every(
      (attributeId) => selectedAttributes[attributeId] !== undefined,
    );

    if (!allAttributesSelected) {
      toast.error("Please select all product specifications.");
      return;
    }

    try {
      setIsAddingToCart(true);

      const response = await cartApis.addToCart({
        productId: product.id,
        quantity: 1,
        selectedAttributes: selectedAttributes,
      });

      console.log("Added to cart:", response);

      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Loading state
  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Loading product details...</p>
      </div>
    );
  }

  // Error state
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-text-primary">
          {error || "Product unavailable"}
        </h2>

        <Link to="/shop" className="text-primary hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.imageUrls ?? [];

  const discountedPrice = product.mrpPrice * (1 - product.discount / 100);

  const savings = product.mrpPrice - discountedPrice;

  return (
    <div className="min-h-screen bg-surface-alt py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-2 text-xs md:text-sm text-text-muted mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>

          <ChevronRight className="w-3.5 h-3.5" />

          <Link to="/shop" className="hover:text-primary transition-colors">
            Shop
          </Link>

          <ChevronRight className="w-3.5 h-3.5" />

          <Link
            to={`/shop?category=${product.categoryCode}`}
            className="hover:text-primary transition-colors capitalize"
          >
            {product.categoryName}
          </Link>

          <ChevronRight className="w-3.5 h-3.5" />

          <span className="text-text-primary font-medium truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Product Details */}
        <div className="bg-surface rounded-3xl border border-border shadow-xs p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Main Image */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-surface-alt border border-border">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    No image available
                  </div>
                )}

                {product.discount > 0 && (
                  <span className="absolute top-4 left-4 bg-danger text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx
                          ? "border-primary shadow-xs"
                          : "border-border hover:border-primary opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Category */}
              <div className="mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                  {product.categoryName}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Stock Status */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                {product.stockQuantity > 0 ? (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                    In Stock ({product.stockQuantity} left)
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-danger/10 text-danger">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline flex-wrap gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-text-primary">
                    {formatPrice(discountedPrice)}
                  </span>

                  {product.discount > 0 && (
                    <>
                      <span className="text-lg text-text-muted line-through">
                        {formatPrice(product.mrpPrice)}
                      </span>

                      <span className="text-sm font-bold text-danger">
                        Save {formatPrice(savings)} ({product.discount}%)
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-text-muted mt-1">
                  Inclusive of all taxes.
                </p>
              </div>

              {/* Description */}
              <div className="mb-6 pt-4 border-t border-border">
                <h2 className="text-sm font-semibold text-text-primary mb-2">
                  Product Description
                </h2>

                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                  {product.description || "No description available."}
                </p>
              </div>

              {/* Product Attributes - Display Only */}
              {product.attributes?.length > 0 && (
                <div className="space-y-4 mb-6 pt-4 border-t border-border">
                  <h2 className="text-sm font-semibold text-text-primary">
                    Product Specifications
                  </h2>

                  {product.attributes.map((attribute) => (
                    <div key={attribute.id} className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        {attribute.name}
                      </span>

                      <div className="flex flex-wrap gap-2">
                        {Object.entries(attribute.values).map(
                          ([valueId, value]) => {
                            const isSelected =
                              selectedAttributes[attribute.id] ===
                              Number(valueId);

                            return (
                              <span
                                onClick={() =>
                                  handleAttributeSelect(
                                    attribute.id,
                                    Number(valueId),
                                  )
                                }
                                key={valueId}
                                className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/10 text-primary font-semibold"
                                    : "border-border bg-surface-alt text-text-primary hover:border-primary"
                                }`}
                              >
                                {value}
                              </span>
                            );
                          },
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stockQuantity <= 0}
                className="group w-full mt-6 mb-6 relative overflow-hidden rounded-xl
    bg-primary px-6 py-4 text-white font-semibold
    shadow-lg shadow-primary/20
    transition-all duration-300
    hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
    active:translate-y-0 active:scale-[0.99]
    disabled:opacity-60 disabled:cursor-not-allowed
    disabled:hover:translate-y-0"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding to Cart...
                    </>
                  ) : product.stockQuantity <= 0 ? (
                    "Out of Stock"
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      Add to Cart
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
              {/* Product Information */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-surface-alt border border-border mt-auto text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-5 h-5 text-primary mb-1" />
                  <span className="text-xs font-semibold text-text-primary">
                    Free Delivery
                  </span>
                  <span className="text-[10px] text-text-muted">
                    On eligible orders
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-amber-500 text-xl mb-1">↩</span>
                  <span className="text-xs font-semibold text-text-primary">
                    15 Days Return
                  </span>
                  <span className="text-[10px] text-text-muted">
                    Money back guarantee
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-5 h-5 text-accent mb-1" />
                  <span className="text-xs font-semibold text-text-primary">
                    100% Genuine
                  </span>
                  <span className="text-[10px] text-text-muted">
                    Verified seller item
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Customer Reviews */}
      <CustomerReviews productId={Number(id)} />
    </div>
  );
};

export default ProductDetailsPage;
