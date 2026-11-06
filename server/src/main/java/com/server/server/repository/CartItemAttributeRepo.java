package com.server.server.repository;

import com.server.server.entity.CartItemAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemAttributeRepo extends JpaRepository<CartItemAttribute, Long> {
    List<CartItemAttribute> findByCartItemIdIn(List<Long> cartItemIds);

}
