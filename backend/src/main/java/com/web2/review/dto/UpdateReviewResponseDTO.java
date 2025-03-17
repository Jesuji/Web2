package com.web2.review.dto;

public record UpdateReviewResponseDTO(Long id, Long restaurantId, Long userId, String name, int rating, String message, String hashtags, String updatedAt) {
}
