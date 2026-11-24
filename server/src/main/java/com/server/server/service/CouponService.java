package com.server.server.service;


import com.server.server.dto.CouponRequestDTO;
import com.server.server.dto.CouponResponseDTO;
import com.server.server.entity.Coupon;
import com.server.server.exception.ApiException;
import com.server.server.repository.CouponRepo;
import com.server.server.specification.CouponSpecification;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CouponService {
    private final CouponRepo couponRepo;


    //Method to create coupon
    public CouponResponseDTO createCoupon(CouponRequestDTO dto) {
        if (dto.isPercentage()) {
            if (dto.getDiscount()
                    .compareTo(BigDecimal.valueOf(80)) > 0) {
                throw new ApiException(
                        "Percentage discount cannot exceed 80%",
                        HttpStatus.BAD_REQUEST
                );
            }
        } else {
            if (dto.getDiscount()
                    .compareTo(BigDecimal.valueOf(10000)) > 0) {
                throw new ApiException(
                        "Flat discount cannot exceed ₹10,000",
                        HttpStatus.BAD_REQUEST
                );
            }
        }
        if (dto.getExpiresAt() != null &&
                !dto.getExpiresAt()
                        .isAfter(LocalDateTime.now())) {
            throw new ApiException(
                    "Coupon expiry date must be in the future",
                    HttpStatus.BAD_REQUEST
            );
        }
        String code = normalizeCode(dto.getCode());

        if (couponRepo.existsByCodeIgnoreCase(code)) {
            throw new ApiException(
                    "Coupon code already exists",
                    HttpStatus.CONFLICT
            );
        }

        validateDiscount(dto);

        Coupon coupon = Coupon.builder()
                .code(code)
                .discount(dto.getDiscount())
                .percentage(dto.isPercentage())
                .expiresAt(dto.getExpiresAt())
                .active(true)
                .build();


        return toResponse(couponRepo.save(coupon));


    }

    //Method to get all coupons with optional filters
    public Page<CouponResponseDTO> getAllCoupons(String code, Boolean active, LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable) {
        Specification<Coupon> spec = Specification
                .where(CouponSpecification.hasCode(code))
                .and(CouponSpecification.hasActive(active))
                .and(CouponSpecification.hasExpiresAtBetween(fromDate, toDate));

        return couponRepo.findAll(spec, pageable)
                .map(this::toResponse);
    }


    //Update active status of coupon
    public CouponResponseDTO updateCouponStatus(Long couponId, Boolean active) {


        Coupon coupon = couponRepo.findById(couponId)
                .orElseThrow(() -> new ApiException(
                        "Coupon not found",
                        HttpStatus.NOT_FOUND
                ));

        coupon.setActive(active);
        return toResponse(couponRepo.save(coupon));
    }

    //Method to validate discount
    private void validateDiscount(CouponRequestDTO dto) {
        BigDecimal discount = dto.getDiscount();

        if (discount == null
                || discount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException(
                    "Discount must be greater than zero",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (dto.isPercentage()
                && discount.compareTo(new BigDecimal("100")) > 0) {
            throw new ApiException(
                    "Percentage discount cannot exceed 100",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (dto.getExpiresAt() != null
                && !dto.getExpiresAt()
                .isAfter(LocalDateTime.now())) {
            throw new ApiException(
                    "Expiry date must be in the future",
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    public List<CouponResponseDTO> getUsedCoupons(Long userId) {

        List<Coupon> usedCoupons = couponRepo.findByUsedByUsers_Id(userId);

        return usedCoupons.stream()
                .map(this::toResponse)
                .toList();
    }

    public CouponResponseDTO getCouponByCode(String code) {
        Coupon coupon = couponRepo.findByCodeIgnoreCaseAndActiveTrue(normalizeCode(code))
                .orElseThrow(() -> new ApiException(
                        "Coupon not found or inactive",
                        HttpStatus.NOT_FOUND
                ));

        if (coupon.getExpiresAt() != null && coupon.getExpiresAt()
                .isBefore(LocalDateTime.now())) {
            throw new ApiException(
                    "Coupon has expired",
                    HttpStatus.BAD_REQUEST
            );
        }

        return toResponse(coupon);
    }

    private String normalizeCode(String code) {
        if (code == null || code.isBlank()) {
            throw new ApiException(
                    "Coupon code is required",
                    HttpStatus.BAD_REQUEST
            );
        }

        return code.trim()
                .toUpperCase(Locale.ROOT);
    }

    private CouponResponseDTO toResponse(Coupon coupon) {
        return new CouponResponseDTO(
                coupon.getId(),
                coupon.getCode(),
                coupon.getDiscount(),
                coupon.isPercentage(),
                coupon.getExpiresAt(),
                coupon.isActive()
        );
    }


}
