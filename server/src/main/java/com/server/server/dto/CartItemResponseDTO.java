package com.server.server.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponseDTO {

    private Long cartItemId;

    private Long productId;
    private String productName;
    private List<String> imageUrls;

    private BigDecimal price;
    private BigDecimal discount;
    private Integer quantity;

    private String configurationKey;

    private List<AttributeResponseDTO> selectedAttributes;
}