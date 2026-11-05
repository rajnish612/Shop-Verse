package com.server.server.repository;

import com.server.server.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Repository for CartItem entity, extending JpaRepository to provide CRUD operations
@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Long> {
    List<CartItem> findAllByCartId(Long cartId);

    Optional<CartItem> findByCartIdAndProductIdAndConfigurationKey(
            Long cartId,
            Long productId,
            String configurationKey
    );

}
