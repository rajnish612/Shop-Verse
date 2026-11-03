package com.server.server.repository;

import com.server.server.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponRepo extends JpaRepository<Coupon, Long>, JpaSpecificationExecutor<Coupon> {
    Optional<Coupon> findByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCase(String code);

    Optional<Coupon> findByCodeIgnoreCaseAndActiveTrue(String code);
}
