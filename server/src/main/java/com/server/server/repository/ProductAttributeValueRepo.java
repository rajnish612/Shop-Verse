package com.server.server.repository;

import com.server.server.entity.ProductAttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface ProductAttributeValueRepo extends JpaRepository<ProductAttributeValue, Long> {
    Set<ProductAttributeValue> findAllByIdInAndProductAttributeId(List<Long> valueIds, Long attributeId);
}
