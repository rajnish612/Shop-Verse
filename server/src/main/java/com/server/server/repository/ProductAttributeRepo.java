package com.server.server.repository;

import com.server.server.entity.ProductAttribute;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductAttributeRepo extends JpaRepository<ProductAttribute, Long> {
}
