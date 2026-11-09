import { Star } from "lucide-react";
import { type Review } from "../../types";
interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="border-b border-gray-200 py-5">
      {/* User details */}
      <div className="flex items-center gap-3">
        <img
          src={review.avatar || "/default-avatar.png"}
          alt={review.username}
          className="h-10 w-10 rounded-full object-cover"
        />

        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {review.username}
          </h3>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-3 flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={16}
            className={
              index < review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700">
          {review.rating}/5
        </span>
      </div>

      {/* Review text */}
      <p className="mt-3 text-sm leading-6 text-gray-700">{review.text}</p>
    </div>
  );
};

export default ReviewCard;
