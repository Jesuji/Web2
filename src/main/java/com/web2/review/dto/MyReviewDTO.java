package com.web2.review.dto;

// 음식점 이름, 리뷰 내용, 평점
public record MyReviewDTO(Long id, String name, String message, int rating) {
}
