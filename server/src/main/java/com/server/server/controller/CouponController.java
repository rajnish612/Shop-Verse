package com.server.server.controller;


import com.server.server.dto.CouponRequestDTO;
import com.server.server.dto.CouponResponseDTO;
import com.server.server.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/coupon")
@RequiredArgsConstructor
public class CouponController {
    private final CouponService couponService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CouponResponseDTO> createCoupon(@Valid @RequestBody CouponRequestDTO dto) {
        // Logic to create a coupon
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(couponService.createCoupon(dto));
    }


    //Endpoint to get all coupons with optional filters
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<CouponResponseDTO>> getAllCoupons(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime fromDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime toDate, @PageableDefault(size = 2, sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable) {

        return ResponseEntity.ok(
                couponService.getAllCoupons(
                        code, active, fromDate, toDate, pageable
                )
        );
    }


    //Endpoint to update the active status of a coupon
    @PatchMapping("/{couponId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CouponResponseDTO> updateCouponStatus(@PathVariable Long couponId, @RequestParam Boolean active) {
        return ResponseEntity.ok(couponService.updateCouponStatus(couponId, active));
    }

    //Endpoint to get a coupon by its code
    @GetMapping("/code/{code}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CouponResponseDTO> getCouponByCode(@PathVariable String code) {
        return ResponseEntity.ok(couponService.getCouponByCode(code));
    }


    //Endpoint to fetch all used couponse
    @GetMapping("/used")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<CouponResponseDTO>> getUsedCoupons(@AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("userId");
        return ResponseEntity.ok(couponService.getUsedCoupons(userId));
    }

}
