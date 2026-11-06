package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

//DTO for OrderItem response
@Data
@Builder
@AllArgsConstructor
public class OrderItemResponseDTO {

    private Long id;

    private Long productId;

    private String productName;

    private String imageUrl;

    private int quantity;

    private BigDecimal unitPrice;
    private List<SelectedAttributeResponseDTO> selectedAttributes;

}
