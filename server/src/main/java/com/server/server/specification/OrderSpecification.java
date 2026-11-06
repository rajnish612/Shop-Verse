package com.server.server.specification;

import com.server.server.domain.OrderStatus;
import com.server.server.entity.Order;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public final class OrderSpecification {
    public static Specification<Order> search(String keyword) {
        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            String searchTerm = "%" + keyword.trim()
                    .toLowerCase() + "%";

            Predicate customerName = cb.like(
                    cb.lower(root.get("user")
                            .get("name")),
                    searchTerm
            );

            Predicate customerEmail = cb.like(
                    cb.lower(root.get("user")
                            .get("email")),
                    searchTerm
            );

            Predicate transactionId = cb.like(
                    cb.lower(
                            root.get("paymentDetails")
                                    .get("transactionId")
                    ),
                    searchTerm
            );

            return cb.or(
                    customerName,
                    customerEmail,
                    transactionId
            );
        };
    }


    public static Specification<Order> hasStatus(OrderStatus status) {
        return (root, query, cb) -> {
            if (status == null) {
                return cb.conjunction();
            }

            return cb.equal(root.get("orderStatus"), status);
        };
    }

    public static Specification<Order> hasUserId(Long userId) {
        return (root, query, cb) -> {

            return cb.equal(root.get("user")
                    .get("id"), userId);
        };
    }
}