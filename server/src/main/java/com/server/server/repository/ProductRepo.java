package com.server.server.repository;


import com.server.server.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepo extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {


    boolean existsByCategoryId(Long categoryId);


    @Query("SELECT p FROM Product p WHERE p.discount > 0 AND p.stockQuantity >0 ORDER BY p.discount DESC")
    List<Product> findDeals();

}
