package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponseDTO {
    private Long id;

    private double rating;

    private String text;

    private Long productId;

    private Long userId;

    private String username;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
