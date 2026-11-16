package com.server.server.specification;


import com.server.server.entity.Role;
import com.server.server.entity.User;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public final class UserDetailsSpecification {

    public static Specification<User> search(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isEmpty()) {
                return cb.conjunction();
            }
            String likePattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), likePattern),

                    cb.like(cb.lower(root.get("email")), likePattern)
            );
        };

    }

    public static Specification<User> hasRole(Role role) {
        return (root, query, cb) -> {
            if (role == null) {
                return cb.conjunction();
            }

            Join<User, Role> roleJoin = root.join("roles");
            return cb.equal(roleJoin.get("id"), role.getId());
        };
    }

    public static Specification<User> notEqualUserId(Long userId) {
        return (root, query, cb) -> {
            if (userId == null) {
                return cb.conjunction();
            }
            return cb.notEqual(root.get("id"), userId);
        };
    }

    public static Specification<User> isActive(Boolean isActive) {
        return (root, query, cb) -> {
            if (isActive == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("active"), isActive);
        };
    }
}
