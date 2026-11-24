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


    @NotNull(message = "Discount is required")
    @DecimalMin(value = "0.00", message = "Discount cannot be negative")
    @DecimalMax(value = "80.00", message = "Maximum discount allowed is 80%")
    @Digits(integer = 2, fraction = 2,
            message = "Discount can have up to 2 decimal places")
    private BigDecimal discount;


    @NotNull(message = "Quantity is required")
    @PositiveOrZero(message = "Quantity cannot be negative")
    private Integer stockQuantity;


    private List<String> imageUrls;

    @NotEmpty(message = "At least one attribute value is required")
    private Set<Long> attributeValueIds;
}
