package com.server.server.controller;

import com.server.server.dto.CreateReviewRequestDTO;
import com.server.server.dto.ReviewResponseDTO;
import com.server.server.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    //Endpoint to get reviews for a specific product
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByProductId(@PathVariable Long productId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }


    //Endpoint to create a new review for a product
    @PostMapping("/product/{productId}")
    public ResponseEntity<ReviewResponseDTO> createReview(@PathVariable Long productId, @RequestBody CreateReviewRequestDTO dto, @RequestParam Long userId) {
        ReviewResponseDTO createdReview = reviewService.createReview(dto, userId);
        return ResponseEntity.ok(createdReview);
    }
}
