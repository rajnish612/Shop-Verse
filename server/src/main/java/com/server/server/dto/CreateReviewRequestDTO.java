package com.server.server.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//DTO class for adding a product
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateReviewRequestDTO {
    @NotNull(message = "Rating is required")
    @DecimalMin(value = "1.0", message = "Rating must be at least 1")
    @DecimalMax(value = "5.0", message = "Rating cannot exceed 5")
    private Double rating;

    @NotBlank(message = "Review text is required")
    private String text;

    @NotNull(message = "Product ID is required")
    private Long productId;
}
