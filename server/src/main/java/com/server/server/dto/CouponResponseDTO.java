package com.server.server.dto;

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
public class CouponResponseDTO {

    Long id;
    String code;
    BigDecimal discount;
    boolean percentage;
    LocalDateTime expiresAt;
    boolean active;
}