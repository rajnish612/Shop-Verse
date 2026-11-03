package com.server.server.specification;


import com.server.server.entity.Coupon;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public final class CouponSpecification {

    public static Specification<Coupon> hasCode(String code) {
        return (root, query, criteriaBuilder) -> {
            if (code == null || code.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("code")),
                    "%" + code.trim()
                            .toLowerCase() + "%"
            );
        };
    }

    public static Specification<Coupon> hasActive(Boolean active) {
        return (root, query, cb) -> {
            if (active == null) {
                return cb.conjunction();
            }

            return cb.equal(root.get("active"), active);
        };
    }


    public static Specification<Coupon> hasExpiresAtBetween(
            LocalDateTime fromDate,
            LocalDateTime toDate) {

        return (root, query, cb) -> {
            if (fromDate == null && toDate == null) {
                return cb.conjunction();
            }

            if (fromDate == null) {
                return cb.lessThanOrEqualTo(
                        root.get("expiresAt"), toDate
                );
            }

            if (toDate == null) {
                return cb.greaterThanOrEqualTo(
                        root.get("expiresAt"), fromDate
                );
            }

            return cb.between(
                    root.get("expiresAt"), fromDate, toDate
            );
        };
    }
}
