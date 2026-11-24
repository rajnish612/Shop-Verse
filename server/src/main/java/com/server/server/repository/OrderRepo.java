package com.server.server.repository;

import com.server.server.domain.OrderStatus;
import com.server.server.domain.PaymentStatus;
import com.server.server.entity.Order;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;

//Repository interface for Order entity, extending JpaRepository to provide CRUD operations
@Repository
public interface OrderRepo extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    @Query("""
                SELECT COALESCE(SUM(o.totalPrice), 0)
                FROM Order o
                WHERE o.orderStatus = :status
            """)
    BigDecimal getTotalRevenue(@Param("status") OrderStatus status);

}
