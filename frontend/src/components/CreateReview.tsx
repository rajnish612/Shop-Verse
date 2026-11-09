import React from "react";
import { Star } from "lucide-react";
import { reviewApis } from "../services/reviews";
import type { Review } from "../types";

interface CreateReviewProps {
  productId: number;
  onReviewCreated: (review: Review) => void;
}

const CreateReview: React.FC<CreateReviewProps> = ({
  productId,
  onReviewCreated,
}) => {
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!text.trim()) {
      setError("Please write your review.");
      return;
    }

    try {
      setLoading(true);

      const newReview = await reviewApis.createReview(productId, {
        rating,
        text: text.trim(),
        productId,
      });

      onReviewCreated(newReview);

      setRating(0);
      setText("");
    } catch (err) {
      console.error("Error creating review:", err);
      setError("Unable to submit your review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 rounded-2xl border border-border bg-surface-alt p-5 md:p-6">
      <h3 className="text-lg font-bold text-text-primary">Write a Review</h3>

      <p className="mt-1 text-sm text-text-muted">
        Share your experience with this product.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2">
            Your Rating
          </label>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
                aria-label={`Rate ${star} out of 5`}
              >
                <Star
                  className={`h-7 w-7 ${
                    star <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-text-muted"
                  }`}
                />
              </button>
            ))}

            <span className="ml-2 text-sm text-text-muted">
              {rating > 0 ? `${rating}/5` : "Select a rating"}
            </span>
          </div>
        </div>

        {/* Review text */}
        <div>
          <label
            htmlFor="review-text"
            className="block text-sm font-semibold text-text-secondary mb-2"
          >
            Your Review
          </label>

          <textarea
            id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did you like or dislike about this product?"
            rows={4}
            maxLength={1000}
            className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <p className="mt-1 text-right text-xs text-text-muted">
            {text.length}/1000
          </p>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default CreateReview;
