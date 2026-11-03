package com.server.server.dto;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

//DTO class for adding a product
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateProductRequestDTO {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "MRP Price is required")
    @Positive(message = "MRP Price must be greater than 0")
    private BigDecimal mrpPrice;


    @Digits(integer = 2, fraction = 2, message = "Discount must be a valid decimal number with up to 2 digits before and after the decimal point")
    private BigDecimal discount;


    @NotNull(message = "Quantity is required")
    @PositiveOrZero(message = "Quantity cannot be negative")
    private Integer stockQuantity;


    private List<String> imageUrls;

    @NotEmpty(message = "At least one attribute value is required")
    private Set<Long> attributeValueIds;
}
