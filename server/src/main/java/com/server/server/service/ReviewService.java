package com.server.server.service;

import com.server.server.dto.CreateReviewRequestDTO;
import com.server.server.dto.ReviewResponseDTO;
import com.server.server.entity.Product;
import com.server.server.entity.Review;
import com.server.server.entity.User;
import com.server.server.exception.ApiException;
import com.server.server.repository.ProductRepo;
import com.server.server.repository.ReviewRepo;
import com.server.server.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepo reviewRepo;
    private final ProductRepo productRepo;
    private final UserRepo userRepo;

    //Get reviews by product ID
    public List<ReviewResponseDTO> getReviewsByProductId(Long productId) {
        return reviewRepo.findByProductId(productId)
                .stream()
                .map(this::toResponse
                )
                .collect(Collectors.toList());
    }

    //Create new review
    public ReviewResponseDTO createReview(CreateReviewRequestDTO dto, Long userId) {
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new ApiException(
                        "Product not found with id: " + dto.getProductId(), HttpStatus.NOT_FOUND
                ));
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ApiException(
                        "User not found with id: " + userId, HttpStatus.NOT_FOUND
                ));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .text(dto.getText())
                .rating(dto.getRating())
                .build();
        Review savedReview = reviewRepo.save(review);

        return toResponse(savedReview);
    }

    //Convert Review entity to ReviewResponseDTO
    public ReviewResponseDTO toResponse(Review review) {
        return ReviewResponseDTO.builder()
                .id(review.getId())
                .productId(review.getProduct()
                        .getId())
                .text(review.getText())
                .userId(review.getUser()
                        .getId())
                .username(review.getUser()
                        .getName())
                .rating(review.getRating())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
