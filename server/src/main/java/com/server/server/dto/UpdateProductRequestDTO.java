package com.server.server.dto;


import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

//DTO for updating product details
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProductRequestDTO {
    private String name;

    private String description;

    private Long categoryId;

    @Positive(message = "MRP Price must be greater than 0")
    private BigDecimal mrpPrice;



    private BigDecimal discount;


    @PositiveOrZero(message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    private List<String> imageUrls;

    private List<Long> attributeValueIds;
}
