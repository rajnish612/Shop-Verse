import React from "react";
import type { Review } from "../types";
import { reviewApis } from "../services/reviews";
import { Star } from "lucide-react";
import ReviewCard from "./ui/ReviewCard";
import CreateReview from "./CreateReview";

const CustomerReviews: React.FC<{ productId: number }> = ({ productId }) => {
  const [loadingReviews, setLoadingReviews] = React.useState(true);
  const [reviews, setReviews] = React.useState<Review[]>([]);

  //Fetch all reviews of the product
  React.useEffect(() => {
    reviewApis
      .getAll(productId)
      .then((data) => setReviews(data))
      .catch((err) => {
        console.log("err fetching reviews");
      })
      .finally(() => setLoadingReviews(false));
  }, [productId]);

  // Add newly created review to the list
  const handleReviewCreated = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
  };

  return (
    <div className="mt-8 bg-surface rounded-3xl border border-border shadow-xs p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text-primary">
            Customer Reviews
          </h2>
          <p className="text-sm text-text-muted mt-1">
            What customers are saying about this product
          </p>
        </div>

        <span className="text-sm font-medium text-text-secondary">
          {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
        </span>
      </div>
      {/* Create Review */}
      <CreateReview
        productId={productId}
        onReviewCreated={handleReviewCreated}
      />

      {/* Reviews */}
      {loadingReviews ? (
        <p className="text-sm text-text-muted py-8 text-center">
          Loading reviews...
        </p>
      ) : reviews.length > 0 ? (
        <div className="divide-y divide-border">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-surface-alt flex items-center justify-center mb-4">
            <Star className="w-7 h-7 text-text-muted" />
          </div>

          <h3 className="text-base font-semibold text-text-primary">
            No reviews yet
          </h3>

          <p className="text-sm text-text-muted mt-1">
            Be the first to share your experience with this product.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
