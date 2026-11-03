package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


//DTO for Product response
@Data
@Builder
@AllArgsConstructor
public class ProductResponseDTO {


    private Long id;

    private String name;

    private String description;

    private List<String> imageUrls;

    private int numRatings;

    private int stockQuantity;

    private Long categoryId;

    private String categoryName;

    private String categoryCode;



    private BigDecimal mrpPrice;

    private BigDecimal discount;


    private List<AttributeResponseDTO> attributes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
