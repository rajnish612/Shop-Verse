package com.server.server.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CouponRequestDTO {
    @NotBlank(message = "Coupon code is required")
    @Size(max = 50, message = "Coupon code cannot exceed 50 characters")
    String code;

    @NotNull(message = "Discount is required")
    @DecimalMin(value = "0.01", message = "Discount must be greater than zero")
    BigDecimal discount;

    boolean percentage;

    LocalDateTime expiresAt;
}
