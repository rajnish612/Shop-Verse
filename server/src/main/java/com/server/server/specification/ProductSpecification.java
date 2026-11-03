package com.server.server.specification;

import com.server.server.entity.Product;
import com.server.server.entity.ProductAttributeValue;
import com.server.server.entity.Review;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class ProductSpecification {
    // Search by product name or description
    public static Specification<Product> keyword(String keyword) {
        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + keyword.trim()
                    .toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern)
            );
        };
    }

    // Filter by category
    public static Specification<Product> categoryId(Long categoryId) {
        return (root, query, cb) -> {

            if (categoryId == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.get("category")
                            .get("id"),
                    categoryId
            );
        };
    }

    public static Specification<Product> categoryIds(Set<Long> categoryIds) {
        return (root, query, cb) -> categoryIds == null || categoryIds.isEmpty()
                ? cb.conjunction()
                : root.get("category")
                .get("id")
                .in(categoryIds);
    }

    public static Specification<Product> minimumRating(Double minimumRating) {
        return (root, query, cb) -> {
            if (minimumRating == null || minimumRating <= 0) {
                return cb.conjunction();
            }
            var averageRating = query.subquery(Double.class);
            var review = averageRating.from(Review.class);
            averageRating.select(cb.avg(review.<Double>get("rating")));
            averageRating.where(cb.equal(
                    review.get("product")
                            .get("id"),
                    root.get("id")
            ));
            return cb.greaterThanOrEqualTo(averageRating, minimumRating);
        };
    }


    // Filter by effective price after product discount
    public static Specification<Product> priceRange(
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            Expression<BigDecimal> hundred =
                    cb.literal(new BigDecimal("100"));

            Expression<BigDecimal> discount =
                    cb.coalesce(
                            root.<BigDecimal>get("discount"),
                            BigDecimal.ZERO
                    );

            Expression<BigDecimal> remainingPercentage =
                    cb.diff(hundred, discount);

            Expression<BigDecimal> effectivePrice =
                    cb.quot(
                                    cb.prod(
                                            root.<BigDecimal>get("mrpPrice"),
                                            remainingPercentage
                                    ),
                                    hundred
                            )
                            .as(BigDecimal.class);

            if (minPrice != null) {
                predicates.add(
                        cb.greaterThanOrEqualTo(
                                effectivePrice,
                                minPrice
                        )
                );
            }

            if (maxPrice != null) {
                predicates.add(
                        cb.lessThanOrEqualTo(
                                effectivePrice,
                                maxPrice
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    // Filter by available stock
    public static Specification<Product> inStock(Boolean inStock) {
        return (root, query, cb) -> {

            if (inStock == null) {
                return cb.conjunction();
            }

            if (inStock) {
                return cb.greaterThan(
                        root.<Integer>get("stockQuantity"),
                        0
                );
            }

            return cb.equal(
                    root.<Integer>get("stockQuantity"),
                    0
            );
        };
    }

    // Filter by an inclusive stock quantity range
    public static Specification<Product> stockRange(Integer minimum, Integer maximum) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (minimum != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                        root.<Integer>get("stockQuantity"),
                        minimum
                ));
            }
            if (maximum != null) {
                predicates.add(cb.lessThanOrEqualTo(
                        root.<Integer>get("stockQuantity"),
                        maximum
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    // Match products containing at least one selected attribute value
    public static Specification<Product> attributeValueIds(
            Set<Long> attributeValueIds
    ) {
        return (root, query, cb) -> {

            if (attributeValueIds == null || attributeValueIds.isEmpty()) {
                return cb.conjunction();
            }

            Subquery<Long> subquery = query.subquery(Long.class);

            Root<Product> subRoot = subquery.from(Product.class);

            Join<Product, ProductAttributeValue> attributeJoin =
                    subRoot.join("productAttributeValues", JoinType.INNER);

            subquery.select(subRoot.get("id"))
                    .where(
                            cb.equal(subRoot.get("id"), root.get("id")),
                            attributeJoin.get("id")
                                    .in(attributeValueIds)
                    )
                    .groupBy(subRoot.get("id"))
                    .having(
                            cb.equal(
                                    cb.countDistinct(attributeJoin.get("id")),
                                    (long) attributeValueIds.size()
                            )
                    );

            return cb.exists(subquery);
        };
    }
}
