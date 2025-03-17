package com.web2.review.dto;

public record CreateReviewResponseDTO(Long id, Long restaurantId, Long userId, String name, int rating, String message, String hashtags, String createdAt) {
}
